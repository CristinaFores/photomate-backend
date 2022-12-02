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
});

afterAll(async () => {
  await mongoose.connection.close();
  await server.stop();
});

afterEach(async () => {
  await Post.deleteMany();
});

describe("Given a POST/ posts enpoint", () => {
  beforeEach(async () => {
    await Post.create(postlist);
  });

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
  beforeEach(async () => {
    await Post.create(postlist);
  });
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

describe("Given a DELETE /:id endpoint", () => {
  describe("When it receives a request with one post by id and it existe", () => {
    test("Then it should respond with status 200 ", async () => {
      const postlist = [
        {
          title: "new post",
          description: "description",
          imagePaths: ["../../../img/algo-salio-mal.png"],
          buckpicture: ["../../../img/algo-salio-mal.png"],
          date: "2022-12-01T15:10:24.551Z",
          _id: userId,
          owner: userId,
        },
      ];
      const [{ _id }] = postlist;
      await Post.create(postlist);

      const response = await request(app)
        .delete(`/posts/${_id}`)
        .set("Authorization", `Bearer ${requestUserToken}`)
        .send({ id: "6388c3e008d4c054bd2e59eb" })
        .expect(200);

      expect(response.body);
    });
  });

  describe("When it receives an authorized request with an invalid id", () => {
    test("Then it should respond with status 403 '", async () => {
      const response = await request(app)
        .delete(`/posts/12345`)
        .set("Authorization", `Bearer ${requestUserToken}`)
        .expect(400);

      expect(response.body);
    });
  });
});
