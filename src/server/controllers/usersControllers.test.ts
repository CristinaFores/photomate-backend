import type { NextFunction, Response, Request } from "express";
import User from "../../database/models/User.js";
import type { Credentials } from "../../types/types";
import { registerUser } from "./usersControllers.js";

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
