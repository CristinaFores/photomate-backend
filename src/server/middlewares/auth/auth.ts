import type { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import CustomError from "../../../CustomError/CustomError.js";
import type { CustomRequest, UserTokenPayload } from "../../../types/types.js";

export const auth = (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      next(
        new CustomError("Authorization header missing", 401, "Missing token")
      );
      return;
    }

    if (!authHeader.startsWith("Bearer ")) {
      next(new CustomError("Missing Bearer in token", 401, "Invalid token"));
    }

    const token = authHeader.replace(/^Bearer \s*/, "");
    const user: UserTokenPayload = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as UserTokenPayload;

    req.userId = user.id;

    next();
  } catch (error: unknown) {
    next(new CustomError((error as Error).message, 401, "Invalid token"));
  }
};
