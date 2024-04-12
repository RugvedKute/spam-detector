import { PrismaClient } from "@prisma/client";
import zod from "zod";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/sendEmail.js";
import { calculateAndSetSpamScore } from "./contact.controller.js";

const prisma = new PrismaClient();

const otpCache = new Map();

const registerUser = async (req, res) => {
  try {
    const registerUserData = zod.object({
      name: zod.string(),
      email: zod.string().email("Please provide a valid email."),
      password: zod.string(),
      phoneNo: zod.string(),
      country: zod.string().optional(),
      city: zod.string().optional(),
      spamScore: zod
        .number()
        .int()
        .positive("Spam score must be positive.")
        .optional(),
    });
    const validatedData = registerUserData.safeParse(req.body);

    if (!validatedData.success) {
      throw new ApiError(404, "Invalid input data");
    }

    const userExists = await prisma.user.findUnique({
      where: { email: req.body.email, phoneNo: req.body.phoneNo },
    });

    if (userExists) {
      return res.json(new ApiError(409, "User already exists."));
    }

    const user = await prisma.user.create({ data: req.body });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },

      process.env.SECRET_KEY
    );

    await sendOTP(user.email);
    await calculateAndSetSpamScore();

    return res
      .status(201)
      .json(new ApiResponse(200, "Successfully registered the user", token));
  } catch (error) {
    console.error("Error creating user:", error);
    return res.json(new ApiError(500, "Internal Server Error"));
  } finally {
    await prisma.$disconnect();
  }
};

const sendOTP = async (email) => {
  try {
    const otp = Math.floor(1000 + Math.random() * 9000);

    otpCache.set(email, otp);

    await sendMail(
      email,
      "To verify your account of spam detector",
      `Your OTP is: ${otp}`
    );
    return otp;
  } catch (err) {
    console.log("Send OTP error", err);
    throw new ApiError(500, "Failed to Send OTP");
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const email = req.email;

    if (!otp || typeof otp !== "string") {
      return res.json(new ApiError(400, "Invalid OTP format"));
    }

    const storedOtp = otpCache.get(email);

    console.log(storedOtp, "storedOtp");
    console.log(otp, "otp body");

    if (!storedOtp || otp !== storedOtp.toString()) {
      return res.json(new ApiError(403, "Wrong OTP entered"));
    } else {
      otpCache.delete(email);
      await prisma.user.update({
        where: {
          email: email,
        },
        data: { isVerified: true },
      });
      return res
        .status(200)
        .json(new ApiResponse(200, "The email verified successfully"));
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.json(newApiError(500, "Internal Server Error"));
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const loginUserData = zod.object({
      email: zod.string().email(),
      password: zod.string(),
    });

    const validData = loginUserData.safeParse(req.body);

    if (!validData.success) {
      throw new ApiError(400, "Invalid Data");
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    console.log(user);
    console.log(user.password, "user password");

    if (!user || user.password !== password || !user.isVerified) {
      return res
        .status(401)
        .json(
          new ApiError(401, "Email or Password is incorrect", [
            "Invalid email or password",
          ])
        );
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: req.body.email,
      },
      process.env.SECRET_KEY
    );

    return res
      .status(200)
      .json(new ApiResponse(200, token, "Login Successfully"));
  } catch (err) {
    console.error(err);
    return res.json(new ApiError(500, "Internal Server Error"));
  }
};

const deleteAllUser = async (req, res) => {
  try {
    const deletedUsers = await prisma.user.deleteMany({});

    return res.status(200).json(deletedUsers);
  } catch (err) {
    return res.json(err);
  }
};

const getSpamScoreNumber = async (req, res) => {
  try {
    const phoneNumber = req.body.phoneNo;

    const user = await prisma.user.findFirst({
      where: { phoneNo: phoneNumber },
      select: {
        spamScore: true,
        name: true,
        email: true,
        phoneNo: true,
      },
    });

    if (!user) {
      return res.json(new ApiError(404, "Not Found User"));
    }

    res.json(new ApiResponse(200, user, "User Found"));
  } catch (err) {
    console.error(err);
    return new ApiError(500, "Internal server error");
  }
};

export {
  registerUser,
  sendOTP,
  verifyOtp,
  loginUser,
  deleteAllUser,
  getSpamScoreNumber,
};
