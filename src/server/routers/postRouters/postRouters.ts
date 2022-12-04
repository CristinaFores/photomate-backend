import express from "express";
import multer from "multer";
import {
  createPost,
  deletePostById,
  getPostById,
  getPosts,
} from "../../controllers/postControllers/postControllers.js";
import handleImage from "../../middlewares/handleImage/handleImage.js";
import imageBackupUpload from "../../middlewares/imagesBackupUpload/imagesBackupUpload.js";

const postsRouter = express.Router();

const upload = multer({
  dest: "assets/images",
  limits: {
    fileSize: 5000000,
  },
});

postsRouter.get("/", getPosts);
postsRouter.get("/:id", getPostById);
postsRouter.delete("/:id", deletePostById);

postsRouter.post(
  "/",
  upload.single("image"),
  handleImage,
  imageBackupUpload,
  createPost
);

export default postsRouter;
