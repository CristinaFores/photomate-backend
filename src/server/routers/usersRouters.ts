import express from "express";
import { validate } from "express-validation";
import registerUserSchema from "../../schemas/registerUserShema.js";
import { loginUser, registerUser } from "../controllers/usersControllers.js";

const userRouters = express.Router();

userRouters.post(
  "/register",
  validate(registerUserSchema, {}, { abortEarly: false }),
  registerUser
);
userRouters.post("/login", loginUser);

export default userRouters;
