import express from "express";
import multer from "multer";
import path from "path";
import {
  createPost,
  deletePostById,
  getPostById,
  getPosts,
} from "../../controllers/postControllers/postControllers.js";
import handleImage from "../../middlewares/handleImage/handleImage.js";
import imageBackupUpload from "../../middlewares/imagesBackupUpload/imagesBackupUpload.js";

import postRoutes from "../routes/postRouters.js";

const {
  postsRoute,
  createPostRoute,
  deletepostRoute,

  postIdRoute,
} = postRoutes;

const postsRouter = express.Router();

const upload = multer({
  dest: path.join("assets", "images"),
  limits: {
    fileSize: 5000000,
  },
});

postsRouter.get(postsRoute, getPosts);
postsRouter.get(postIdRoute, getPostById);
postsRouter.delete(deletepostRoute, deletePostById);

postsRouter.post(
  createPostRoute,

  upload.single("image"),
  handleImage,
  imageBackupUpload,
  createPost
);

export default postsRouter;
