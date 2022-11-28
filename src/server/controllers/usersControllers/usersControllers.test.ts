import type { NextFunction, Response, Request } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import User from "../../../database/models/User.js";
import type { Credentials } from "../../../types/types";
import { loginUser, registerUser } from "./usersControllers.js";
import bcrypt from "bcrypt";

beforeEach(() => {
  jest.clearAllMocks();
});

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

describe("Given a register controller", () => {
  const register = {
    username: "cristina",
    password: "12345678910",
  };

  describe("When it receives username 'cristina' and password 1234567890", () => {
    test("Then it should invoke its method status with 201 and its method json with the received user id and the username", async () => {
      const expectedStatus = 201;

      const req: Partial<Request> = {
        body: register,
      };

      User.create = jest.fn().mockResolvedValueOnce(register);

      await registerUser(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalled();
    });

    describe("When it receives incorrect username and password with 12345", () => {
      test("Then it should call next", async () => {
        const registerIncorrect: Credentials = {
          username: "cristina",
          password: "12345",
        };
        const req: Partial<Request> = {
          body: register,
        };
        User.create = jest.fn().mockRejectedValue(registerIncorrect);

        await registerUser(
          req as Request,
          res as Response,
          next as NextFunction
        );

        expect(next).toHaveBeenCalled();
      });
    });
  });
});

describe("Given a register loginUser", () => {
  const expectUser = {
    username: "Cristina",
    password: "123456789",
    email: "cris@email.com",
  };

  describe("When it receives username  username:'Cristina' , password'0123456789',  email: 'cris@email.com'", () => {
    test("Then it should invoke its method status with 200 , to login a username:'Cristina' , password'0123456789',  email: 'cris@email.com'", async () => {
      const expectedStatus = 200;

      const req: Partial<Request> = {
        body: expectUser,
      };
      User.findOne = jest.fn().mockResolvedValueOnce(expectUser);
      bcrypt.compare = jest.fn().mockResolvedValueOnce(true);

      await loginUser(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalled();
    });

    describe("When it receives incorrect  username:'Cristina' , password'0123456789',  email: 'cris@email.com'", () => {
      test("Then it should call next", async () => {
        const req: Partial<Request> = {
          body: expectUser,
        };

        User.findOne = jest.fn().mockResolvedValueOnce(expectUser);
        const passwordError = new CustomError(
          "Password is incorrect",
          401,
          "Wrong credentials"
        );

        bcrypt.compare = jest.fn().mockResolvedValueOnce(false);

        await loginUser(req as Request, res as Response, next as NextFunction);

        expect(next).toBeCalledWith(passwordError);

        expect(next).toHaveBeenCalled();
      });
    });

    describe("When it receives incorrect  username:'Cristina' , password'0123456789',  email: 'cris@email.com'", () => {
      test("Then it should call next", async () => {
        const req: Partial<Request> = {
          body: expectUser,
        };

        User.findOne = jest.fn().mockResolvedValueOnce(false);

        await loginUser(req as Request, res as Response, next as NextFunction);

        expect(next).toBeCalled();
      });
    });
  });
});
