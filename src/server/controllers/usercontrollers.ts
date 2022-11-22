import "../../loadEnviroment.js";
import type { NextFunction, Request, Response } from "express";
import CustomError from "../../CustomError/CustomError";
import User from "../../database/models/User";
import type { RegisterData } from "../../types/types.js";
import bcrypt from "bcrypt";
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password, email } = req.body as RegisterData;
  try {
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = User.create({ username, password: hashPassword, email });

    res.status(201).json({ user: { id: newUser, username, email } });
  } catch (error: unknown) {
    next(
      new CustomError((error as Error).message, 500, "Something went wrong")
    );
  }
};
