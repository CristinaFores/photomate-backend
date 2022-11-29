import express from "express";
import {
  getPostById,
  getPosts,
} from "../../controllers/postControllers/postControllers.js";

const postsRouters = express.Router();

postsRouters.get("/", getPosts);
postsRouters.get("/:id", getPostById);

export default postsRouters;
