import { Router } from "express";

import {
  deleteAllUser,
  getSpamScoreNumber,
  loginUser,
  registerUser,
  sendOTP,
  verifyOtp,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/signup").post(registerUser);
router.route("/verify-otp").post(verifyJwt, verifyOtp);
router.route("/signin").post(loginUser);
router.route("/delete").get(deleteAllUser);
router.route("/get-score").post(verifyJwt, getSpamScoreNumber);
// router.route("/send-otp").get(verifyJwt, sendOTP);

export { router as userRouter };
