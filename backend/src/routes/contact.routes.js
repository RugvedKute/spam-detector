import { Router } from "express";
import {
  calculateAndSetSpamScore,
  createContact,
  getUserContacts,
  markSpam,
  singleContactDetails,
} from "../controllers/contact.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-contact").post(verifyJwt, createContact);
router.route("/get-contacts").get(verifyJwt, getUserContacts);
router.route("/singleContact/:id").get(verifyJwt, singleContactDetails);
router.route("/spam-score").get(verifyJwt, calculateAndSetSpamScore);
router.route("/mark-spam").post(verifyJwt, markSpam);

export { router as contactRouter };
