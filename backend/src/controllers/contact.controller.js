import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import zod from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createContact = async (req, res) => {
  const userId = req.id;
  const contactData = req.body;
  try {
    const contactSchema = zod.object({
      firstName: zod.string(),
      lastName: zod.string().optional(),
      phoneNo: zod.string().min(10),
      email: zod.string().email(),
    });

    const validateData = contactSchema.safeParse(contactData);

    if (!validateData.success)
      return res.json(new ApiError("Invalid data", 400));

    await prisma.contact.create({
      data: { ...validateData.data, userId },
    });
    return res.json(new ApiResponse(200, "Contact created successfully"));
  } catch (err) {
    console.log("Error in creating a new contact", err);
    return res.status(500).json(new ApiError(500, err.message));
  }
};

const getUserContacts = async (req, res) => {
  try {
    const userId = req.id;
    const contacts = await prisma.contact.findMany({ where: { userId } });
    return res.json(
      new ApiResponse(200, contacts, "Successfully fetched the user's contacts")
    );
  } catch (err) {
    console.error(err);
    return res.json(new ApiError(500, "Server error"));
  }
};

const singleContactDetails = async (req, res) => {
  const id = req.params.id;

  try {
    const contact = await prisma.contact.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!contact) {
      return res.status(404).json(new ApiError(404, "Contact not found"));
    }

    const user = await prisma.user.findFirst({
      where: {
        phoneNo: contact.phoneNo,
      },

      select: { spamScore: true },
    });

    const spamScore = user ? user.spamScore : 0;

    // Combine contact data with spam score
    const contactDetails = {
      id: contact.id,
      firstName: contact.firstName,
      lastName: contact.lastName,
      phoneNo: contact.phoneNo,
      email: contact.email,
      spamScore,
    };

    return res.json(
      new ApiResponse(
        200,
        contactDetails,
        "Successfully fetched single contact details"
      )
    );
  } catch (err) {
    console.error(err);
    return res.json(new ApiError(500, "Internal Server Error"));
  }
};

const calculateAndSetSpamScore = async (req, res) => {
  try {
    // Step 1: Retrieve all contacts for each user, along with their phone numbers
    const usersWithContacts = await prisma.user.findMany({
      include: {
        contacts: {
          select: {
            id: true,
            phoneNo: true,
            spam: true,
          },
        },
      },
    });

    const userSpamCountMap = new Map();

    for (const user of usersWithContacts) {
      const userSpamPhoneNumbers = new Set();
      for (const contact of user.contacts) {
        if (contact.spam) {
          userSpamPhoneNumbers.add(contact.phoneNo);
        }
      }
      userSpamCountMap.set(user.id, userSpamPhoneNumbers.size);
    }

    // Step 4: Retrieve the total number of registered users
    const totalUsersCount = await prisma.user.count();

    for (const [userId, spamCount] of userSpamCountMap) {
      const spamScoreFloat = (spamCount / totalUsersCount) * 100;
      const spamScore = Math.min(Math.round(spamScoreFloat), 100); // Round and cap at 100

      await prisma.user.update({
        where: { id: userId },
        data: { spamScore },
      });
    }

    return "Spam Score updated";
  } catch (err) {
    console.error("Error calculating and setting spam scores:", err);
    throw new ApiError(500, "Server error");
  }
};

const markSpam = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id || typeof id !== "string") {
      res.json(new ApiError(400, "'id' must be a string"));
    }

    const response = await prisma.contact.update({
      where: { id: parseInt(id) },
      data: {
        spam: true,
      },
    });
    await calculateAndSetSpamScore();

    return res.json(
      new ApiResponse(200, response, "Contact marked as spam successfully.")
    );
  } catch (err) {
    console.error(err);
    return res.json(new ApiError(500, "Internal Server Error"));
  }
};

export {
  createContact,
  getUserContacts,
  singleContactDetails,
  calculateAndSetSpamScore,
  markSpam,
};
