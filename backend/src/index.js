import express from "express";

import cors from "cors";
import dotenv from "dotenv";
import { userRouter } from "./routes/user.routes.js";
import { contactRouter } from "./routes/contact.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();

app.use("/api/v1/user", userRouter);
app.use("/api/v1/contacts", contactRouter);

const PORT = process.env.PORT || 3000; // Use environment variable for port or default to 3000
app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);

export { app };
