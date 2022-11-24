import "../../loadEnviroment.js";
import type { NextFunction, Request, Response } from "express";
import CustomError from "../../CustomError/CustomError.js";
import User from "../../database/models/User.js";
import type { RegisterData } from "../../types/types.js";
import bcrypt from "bcrypt";
import environment from "../../loadEnviroment.js";
import jwt from "jsonwebtoken";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password, email } = req.body as RegisterData;
  try {
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashPassword,
      email,
    });

    res.status(201).json({ user: { id: newUser, username, email } });
  } catch (error: unknown) {
    next(
      new CustomError((error as Error).message, 500, "Something went wrong")
    );
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body as RegisterData;

  const user = await User.findOne({ username });

  if (!user) {
    next(new CustomError("Username not found", 401, "Wrong credentials"));
    return;
  }

  if (!(await bcrypt.compare(password, user.password))) {
    next(new CustomError("Password is incorrect", 401, "Wrong credentials"));
    return;
  }

  const tokenPayload = {
    id: user._id,
  };

  const token = jwt.sign(tokenPayload, environment.jwtSecret, {
    expiresIn: "1d",
  });

  res.status(200).json({ token });
};
