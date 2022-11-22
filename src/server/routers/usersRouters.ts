import express from "express";
import { registerUser } from "../controllers/usersControllers.js";

const userRouters = express.Router();

userRouters.post("/register", registerUser);

export default userRouters;
