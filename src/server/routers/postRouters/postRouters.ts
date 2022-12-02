import express from "express";
import {
  deletePostById,
  getPostById,
  getPosts,
} from "../../controllers/postControllers/postControllers.js";

const postsRouters = express.Router();

postsRouters.get("/", getPosts);
postsRouters.get("/:id", getPostById);
postsRouters.delete("/:id", deletePostById);

export default postsRouters;
