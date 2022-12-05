import "../../../loadEnviroment";
import environment from "../../../loadEnviroment";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import jwt from "jsonwebtoken";
import path from "path";
import app from "../../app";
import { connectDb } from "../../../database";
import Post from "../../../database/models/Post";

let server: MongoMemoryServer;

const requestUserToken = jwt.sign(
  { user: "Cristina", id: "6384fe9a96794a4b19432655" },
  environment.jwtSecret
);
const requestUser2Token = jwt.sign(
  { user: "Cristina2", id: "6384fe9a96794a4b19432656" },
  environment.jwtSecret
);

const postId = "6384fe9a96794a4b19432654";
const postList = [
  {
    title: "12345678",
    description: "esto es mi primer post",
    imagePaths: [""],
    buckpicture: [""],
    tags: [""],
    _id: postId,
    owner: "6384fe9a96794a4b19432655",
  },
];

jest.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    storage: {
      from: () => ({
        upload: jest.fn().mockResolvedValue({ error: null }),
        getPublicUrl: () => ({
          data: {
            publicUrl: "testFileImage.webptestOriginalImage.webp",
          },
        }),
      }),
    },
  }),
}));

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

describe("Given a POST /posts endpoint", () => {
  describe("When I send a valid request body", () => {
    test("Then the post is created", async () => {
      const expectedStatus = 201;

      const post = {
        title: "12345678",
        description: "esto es mi primer post",
      };
      const createdPost = await request(app)
        .post("/posts")
        .field("title", post.title)
        .field("description", post.description)
        .attach("image", path.join(__dirname, "testImage.jpeg"))
        .set("Authorization", `Bearer ${requestUserToken}`)
        .set("Content-Type", "application/json")
        .expect(expectedStatus);

      expect(createdPost.body).toMatchObject(post);
    });
  });
});

describe("Given a GET /posts/:id endpoint", () => {
  beforeEach(async () => {
    await Post.create(postList);
  });
  describe("When I request a valid post id", () => {
    test("Then it returns the requested post", async () => {
      const post = await request(app)
        .get(`/posts/${postId}`)
        .set("Authorization", `Bearer ${requestUserToken}`)
        .set("Content-Type", "application/json")
        .expect(200);

      expect(post.body).toMatchObject({
        title: postList[0].title,
        description: postList[0].description,
      });
    });
  });
  describe("When I request a non existent post id ", () => {
    test("Then it should respond with a 404 status", async () => {
      await request(app)
        .get(`/posts/6384fe9a96794a4b19432651`)
        .set("Authorization", `Bearer ${requestUserToken}`)
        .set("Content-Type", "application/json")
        .expect(404);
    });
  });

  describe("When I request an invalid id", () => {
    test("Then it should respond with a 400 status", async () => {
      await request(app)
        .get(`/posts/1234`)
        .set("Authorization", `Bearer ${requestUserToken}`)
        .set("Content-Type", "application/json")
        .expect(400);
    });
  });
});

describe("Given a GET /posts endpoint", () => {
  beforeEach(async () => {
    await Post.create(postList);
  });
  describe("When I request all posts", () => {
    test("Then it returns all posts", async () => {
      await request(app)
        .get(`/posts?title=12345678`)
        .set("Authorization", `Bearer ${requestUserToken}`)
        .set("Content-Type", "application/json")
        .expect(200);
    });
  });
});

describe("Given a PATCH /posts/:id endpoint", () => {
  beforeEach(async () => {
    await Post.create(postList);
  });
  describe("When I request to update a valid id", () => {
    test("Then it returns the updated post", async () => {
      const post = await request(app)
        .patch(`/posts/${postId}`)
        .field("title", "12345678")
        .set("Authorization", `Bearer ${requestUserToken}`)
        .set("Content-Type", "application/json")
        .expect(200);

      expect(post.body).toMatchObject({
        title: "12345678",
      });
    });
  });
  describe("When a user tries to update a post that is not his", () => {
    test("Then it should respond with a 403 status", async () => {
      await request(app)
        .patch(`/posts/${postId}`)
        .field("title", "12345678")
        .set("Authorization", `Bearer ${requestUser2Token}`)
        .set("Content-Type", "application/json")
        .expect(403);
    });
  });
  describe("When I request to update an invalid id", () => {
    test("Then it should respond with a 400 status", async () => {
      await request(app)
        .patch(`/posts/1234`)
        .field("title", "12345678")
        .set("Authorization", `Bearer ${requestUserToken}`)
        .set("Content-Type", "application/json")
        .expect(400);
    });
  });
});

describe("Given a DELETE /:id endpoint", () => {
  beforeEach(async () => {
    await Post.create(postList);
  });
  describe("When I request do delete a valid id", () => {
    test("Then it should delete it", async () => {
      const response = await request(app)
        .delete(`/posts/${postId}`)
        .set("Authorization", `Bearer ${requestUserToken}`)
        .expect(200);

      expect(response.body);
    });
  });

  describe("When a user deletes a post that is not his", () => {
    test("Then it should respond with a 401 status", async () => {
      await request(app)
        .delete(`/posts/${postId}`)
        .set("Authorization", `Bearer ${requestUser2Token}`)
        .expect(403);
    });
  });

  describe("When it receives an authorized request with an invalid id", () => {
    test("Then it should respond with status 400", async () => {
      const response = await request(app)
        .delete(`/posts/12345`)
        .set("Authorization", `Bearer ${requestUserToken}`)
        .expect(400);

      expect(response.body);
    });
  });
});
