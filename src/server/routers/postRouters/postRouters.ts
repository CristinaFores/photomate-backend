import express from "express";
import {
  getPostById,
  getPosts,
} from "../../controllers/postControllers/postControllers.js";

const postsRouters = express.Router();

postsRouters.get("/posts", getPosts);
postsRouters.get("/posts/:id", getPostById);

export default postsRouters;
