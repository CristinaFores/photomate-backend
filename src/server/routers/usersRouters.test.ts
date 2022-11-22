import "../../loadEnviroment";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import User from "../../database/models/User.js";
import { connectDb } from "../../database";
import app from "../app";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDb(server.getUri());
});

beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await server.stop();
});

const expectUser = {
  username: "Cristina",
  password: "0123456789",
  email: "cris@email",
};

describe("Given a POST/ register enpoint", () => {
  describe("When it's receives a request with the username: 'Cristina' '0123456789'", () => {
    test("Then its should response status code 201 and the user", async () => {
      const expectSatus = 201;

      const response = await request(app)
        .post("/users/register")
        .send(expectUser)
        .expect(expectSatus);
      expect(response.body).toHaveProperty("user");
    });
  });

  describe("When it receives a request with the username: 'Cristina' '0123456789'and this username exists in the database ", () => {
    test("Then it should respond with a response status 500, and the message 'Something went wrong'", async () => {
      const expectedStatus = 500;

      await User.create(expectUser);

      const response = await request(app)
        .post("/users/register")
        .send(expectUser)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error", "Something went wrong");
    });
  });
});
