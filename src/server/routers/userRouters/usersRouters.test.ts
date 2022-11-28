import "../../../loadEnviroment";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import bcrypt from "bcrypt";
import { connectDb } from "../../../database";
import User from "../../../database/models/User";
import app from "../../app";
import type { RegisterData } from "../../../types/types";

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
  password: "123456789",
  email: "cris@email.com",
};

describe("Given a POST/ register enpoint", () => {
  describe("When it's receives a request with the username:'Cristina' , password'0123456789',  email: 'cris@email.com' ", () => {
    test("Then its should response status code 201 and the user", async () => {
      const expectSatus = 201;

      const response = await request(app)
        .post("/users/register")
        .send(expectUser)
        .expect(expectSatus);
      expect(response.body).toHaveProperty("user");
    });
  });

  describe("When it receives a request with the username: 'Cristina' , password'0123456789',  email: 'cris@email.com' ", () => {
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

describe("Given POST/ login enpoint", () => {
  const registerctUser: RegisterData = {
    username: "Cristina",
    password: "123456789",
    email: "cris@email.com",
  };

  describe("When it recieves a request the username: 'Cristina' , password'0123456789',  email: 'cris@email.com' ", () => {
    test("Then its should response status code 200 and the user", async () => {
      const expectStatus = 200;
      const hashedPassword = await bcrypt.hash(registerctUser.password, 10);

      await User.create({
        username: registerctUser.username,
        password: hashedPassword,
        email: registerctUser.email,
      });

      const response = await request(app)
        .post("/users/login")
        .send(registerctUser)
        .expect(expectStatus);

      expect(response.body).toHaveProperty("token");
    });
  });

  describe("When it recieves a request the username: 'Cristina' , password'0123456789',  email: 'cris@email.com'", () => {
    test("Then it should respond with a response status 401, and the message 'Wrong credentials'", async () => {
      const expectedStatus = 401;

      const response = await request(app)
        .post("/users/login/")
        .send(registerctUser)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error", "Wrong credentials");
    });
  });

  describe("When it receives a request with origin no valid", () => {
    test("Then it should response with an error status 500, ", async () => {
      const response = await request(app)
        .get("/users/login")
        .set("Origin", "http://cris.com")
        .expect(500);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("When it receives a request with origin no valid", () => {
    test("Then it should response with an error status 500, ", async () => {
      const response = await request(app)
        .get("/users/posts")
        .set("Origin", "http://cris.com")
        .expect(500);

      expect(response.body).toHaveProperty("error");
    });
  });
});
