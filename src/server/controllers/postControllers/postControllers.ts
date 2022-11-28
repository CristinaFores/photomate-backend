import type { NextFunction, Response } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import Post from "../../../database/models/Post.js";
import type { CustomRequest } from "../../../types/types.js";

export const getPosts = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;
  try {
    const posts = await Post.find({ userPosts: userId });
    res.status(200).json({ posts });
  } catch (error: unknown) {
    next(
      new CustomError(
        (error as Error).message,
        500,
        "Database doesn't work, try again later"
      )
    );
  }
};
