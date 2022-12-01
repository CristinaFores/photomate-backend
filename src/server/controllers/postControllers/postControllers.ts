import type { NextFunction, Response } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import Post from "../../../database/models/Post.js";
import type { CustomRequest } from "../../../types/types.js";

export const getPosts = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const posts = await Post.find({}).populate("owner");

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
  const { id } = req.params;

  try {
    const posts = await Post.findById(id);

    if (!posts) {
      next(new CustomError("Post not found", 404, "Post not found"));
      return;
    }

    res.status(200).json(posts);
  } catch (error: unknown) {
    next(new CustomError((error as Error).message, 400, "Post not found"));
  }
};

export const deletePostById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;
  const { id } = req.params;

  try {
    const post = await Post.findOne({ _id: id });

    if (post.owner.toString() !== userId) {
      next(new CustomError("Not allowed", 404, " Delete not allowed"));
      return;
    }

    await post.delete();

    res.status(200).json({ message: "Post Deleted successfully" });
  } catch (error: unknown) {
    next(new CustomError((error as Error).message, 400, "Post not found no"));
  }
};
