import "../../../loadEnviroment";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";

import app from "../../app";
import { connectDb } from "../../../database";
import Post from "../../../database/models/Post";

let server: MongoMemoryServer;

const postlist = [
  {
    title: "12345678",
    description: "esto es mi primer post",
    imagePaths: [""],
    buckpicture: [""],
    tags: [""],
    id: "6384fe9a96794a4b19432655",
  },
];

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDb(server.getUri());

  await Post.create(postlist);
});

beforeEach(async () => {
  await Post.deleteMany();
});

afterAll(async () => {
  await mongoose.disconnect();
  await server.stop();
});

describe("Given a POST/ posts enpoint", () => {
  describe("When it receives a request with list the posts", () => {
    test("Then it should respond with a 200 status and a list post", async () => {
      const expectedStatus = 200;

      const response = await request(app)
        .get("/users/posts")
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("posts");
    });
  });
});

describe("Given a POST/ posts/:id enpoint", () => {
  describe("When it receives a request with one post by id user  ", () => {
    test("Then it should respond with a 200 status and post destil", async () => {
      const postlist = [
        {
          title: "12345678",
          description: "esto es mi primer post",
          imagePaths: [""],
          buckpicture: [""],
          tags: [""],
          id: "6384fe9a96794a4b19432655",
        },
      ];

      await Post.create(postlist);
      const expectedStatus = 400;
      const [{ id }] = postlist;
      await request(app).get(`/users/posts/${id}`).expect(expectedStatus);
    });
  });
});
