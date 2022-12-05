import express from "express";
import multer from "multer";
import {
  createPost,
  deletePostById,
  getPostById,
  getPosts,
  updatePost,
} from "../../controllers/postControllers/postControllers.js";
import handleImage from "../../middlewares/handleImage/handleImage.js";

const postsRouter = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

postsRouter.get("/", getPosts);
postsRouter.get("/:id", getPostById);
postsRouter.delete("/:id", deletePostById);
postsRouter.patch("/:id", upload.single("image"), handleImage, updatePost);
postsRouter.post("/", upload.single("image"), handleImage, createPost);

export default postsRouter;
