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
    const posts = await Post.find({ owner: userId });
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

export const getPostById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { postId } = req.params;
  try {
    const posts = await Post.findById({ postId });

    if (!posts) {
      next(new CustomError("Post not found", 404, "Post not found"));

      return;
    }

    res.status(200).json(posts);
  } catch (error: unknown) {
    next(new CustomError((error as Error).message, 400, "Post not found"));
  }
};
