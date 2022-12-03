import express from "express";
import multer from "multer";
import path from "path";
import {
  createPost,
  deletePostById,
  getPostById,
  getPosts,
} from "../../controllers/postControllers/postControllers.js";
import postsRoutes from "../routes/postsRouters.js";
const {
  postsRoute,
  createPostRoute,
  deletepostRoute,
  imagesRoute,
  postIdRoute,
} = postsRoutes;

const postsRouter = express.Router();
const upload = multer({
  dest: path.join(imagesRoute),
  limits: {
    fileSize: 5000000,
  },
});

postsRouter.get(postsRoute, getPosts);
postsRouter.get(postIdRoute, getPostById);
postsRouter.delete(deletepostRoute, deletePostById);
postsRouter.post(createPostRoute, upload.single, createPost);

export default postsRouter;
