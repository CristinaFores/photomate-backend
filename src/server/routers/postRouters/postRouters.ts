import express from "express";
import { getPosts } from "../../controllers/postControllers/postControllers.js";

const postsRouters = express.Router();

postsRouters.get("/posts", getPosts);

export default postsRouters;
