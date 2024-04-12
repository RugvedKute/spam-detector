import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

const verifyJwt = async (req, res, next) => {
  try {
    const header = req.header("Authorization");
    if (!header) throw new ApiError(403, "Token is missing!");

    const token = header.split(" ")[1];
    if (!token) throw new ApiError(403, "Token is missing!");

    const data = jwt.verify(token, process.env.SECRET_KEY);
    if (!data) throw new ApiError(403, "Invalid Token!");

    req.email = data.email;
    req.id = data.id;
    next();
  } catch (err) {
    console.error(err);
    return res.json(new ApiError(500, "Internal Server Error"));
  }
};

export { verifyJwt };
