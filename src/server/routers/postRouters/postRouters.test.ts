import "../../../loadEnviroment";
import environment from "../../../loadEnviroment";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../app";
import { connectDb } from "../../../database";
import Post from "../../../database/models/Post";
import type { Credentials } from "../../../types/types";

let server: MongoMemoryServer;

const userId = "6384fe9a96794a4b19432655";
const user: Credentials = {
  username: "Cristina",
  password: "123456789",
};

const requestUserToken = jwt.sign(
  { user: user.username, id: userId },

  environment.jwtSecret
);

const postlist = [
  {
    title: "12345678",
    description: "esto es mi primer post",
    imagePaths: [""],
    buckpicture: [""],
    tags: [""],
    _id: userId,
    owner: userId,
  },
];

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDb(server.getUri());

  await Post.create(postlist);
});

afterAll(async () => {
  await Post.deleteMany();
  await mongoose.disconnect();
  await server.stop();
});

describe("Given a POST/ posts enpoint", () => {
  describe("When it receives a request with list the posts", () => {
    test("Then it should respond with a 200 status and a list post", async () => {
      const expectedStatus = 200;

      const response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${requestUserToken}`)
        .set("Content-Type", "application/json")
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("posts");
    });
  });
});

describe("Given a POST/ posts/:id enpoint", () => {
  describe("When it receives a request with one post by id user  ", () => {
    test("Then it should respond with a 200 status and post list", async () => {
      const expectedStatus = 200;
      await request(app)
        .get(`/posts/${userId}`)
        .set("Authorization", `Bearer ${requestUserToken}`)
        .set("Content-Type", "application/json")
        .expect(expectedStatus);
    });
  });
  describe("When it receives a request with one post by id user  ", () => {
    test("Then it should respond with a 404 status", async () => {
      const expectedStatus = 404;

      await request(app)
        .get(`/posts/6384fe9a96794a4b19432651`)
        .set("Authorization", `Bearer ${requestUserToken}`)
        .set("Content-Type", "application/json")
        .expect(expectedStatus);
    });
  });

  describe("Given a POST/ posts/:id enpoint", () => {
    describe("When it receives a request with one post by id user  ", () => {
      test("Then it should respond with a 401 status and post destil", async () => {
        const expectedStatus = 401;
        const [{ _id }] = postlist;
        await request(app)
          .get(`/posts/${_id}`)
          .set("Authorization", `Bearer ${""}`)
          .set("Content-Type", "application/json")
          .expect(expectedStatus);
      });
    });
  });
});
