import type { NextFunction, Response } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import type { PostStructure } from "../../../database/models/Post.js";
import Post from "../../../database/models/Post.js";
import type { CustomRequest } from "../../../types/types.js";

export const getPosts = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { skip = 0, limit = 10, title = "" } = req.query || {};
    const filter = title ? { title: { $regex: title, $options: "i" } } : {};

    const posts = await Post.find(filter)
      .sort({ _id: -1 })
      .skip(+skip)
      .limit(+limit)
      .populate("owner");

    const total = await Post.count(filter);

    res.status(200).json({
      posts,
      pagination: { skip: +skip, limit: +limit, total },
    });
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
    const posts = await Post.findById(id).populate("owner");
    if (!posts) {
      next(new CustomError("Post not found", 404, "Post not found"));
      return;
    }

    res.status(200).json(posts);
  } catch (error: unknown) {
    next(new CustomError((error as Error).message, 400, "Invalid Id"));
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
      next(new CustomError("Not allowed", 403, " Delete not allowed"));
      return;
    }

    await post.delete();

    res.status(200).json({ message: "Post Deleted successfully" });
  } catch (error: unknown) {
    next(new CustomError((error as Error).message, 400, "Post not found no"));
  }
};

export const updatePost = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;
  const { title, description, imagePaths, buckpicture } =
    req.body as PostStructure;

  try {
    const post = await Post.findOne({ _id: req.params.id });

    if (post.owner.toString() !== userId) {
      next(new CustomError("Not allowed", 403, " Update not allowed"));
      return;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        imagePaths,
        buckpicture,
      },
      { new: true }
    );

    res.status(200).json({ ...updatedPost.toJSON(), image: post.imagePaths });
  } catch (error: unknown) {
    next(new CustomError((error as Error).message, 400, "Error updating post"));
  }
};

export const createPost = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;
  const { title, description, imagePaths, buckpicture } =
    req.body as PostStructure;

  try {
    const post = {
      title,
      description,
      buckpicture,
      imagePaths,
      owner: userId,
      date: new Date(),
    };

    const newPost = await Post.create(post);

    return res
      .status(201)
      .json({ ...newPost.toJSON(), image: post.imagePaths });
  } catch (error: unknown) {
    next(
      new CustomError((error as Error).message, 400, "Error creating the post")
    );
  }
};
