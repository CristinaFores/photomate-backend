import type { NextFunction } from "express";
import environment from "../../../loadEnviroment";
import jwt from "jsonwebtoken";
import { auth } from "./auth";
import type { CustomRequest } from "../../../types/types";
import CustomError from "../../../CustomError/CustomError";

const req: Partial<CustomRequest> = {
  header: jest.fn().mockReturnThis(),
};

const next = jest.fn();

const userId = "6384fe9a96794a4b19432655";
const userToken = jwt.sign(
  { user: "Cristina", id: userId },
  environment.jwtSecret
);

describe("Given an auth middleware", () => {
  describe("When it receives a request without an authorization header", () => {
    test("Then it should invoke next with and error status 401 and message 'Missing token'", () => {
      const expectedStatus = 401;
      const expectedError = new CustomError(
        "Authorization header missing",
        expectedStatus,
        "Missing token"
      );

      req.header = jest.fn().mockReturnValueOnce(undefined);

      auth(req as CustomRequest, null, next as NextFunction);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a token without the Bearer prefix", () => {
    test("Then it should throw an error with status 401 and message 'Invalid token'", () => {
      const expectedStatus = 401;
      const expectedError = new CustomError(
        "Missing Bearer in token",
        expectedStatus,
        "Invalid token"
      );

      req.header = jest.fn().mockReturnValueOnce("token");

      auth(req as CustomRequest, null, next as NextFunction);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a token with the Bearer prefix", () => {
    test("Then it should add the userId in the request", () => {
      req.header = jest.fn().mockReturnValueOnce(`Bearer ${userToken}`);

      auth(req as CustomRequest, null, next as NextFunction);

      expect(req.userId).toBe(userId);
    });
  });
});
