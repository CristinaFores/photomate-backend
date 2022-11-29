import type { NextFunction } from "express";
import { auth } from "./auth";
import type { CustomRequest } from "../../../types/types";
import CustomError from "../../../CustomError/CustomError";

const req: Partial<CustomRequest> = {
  header: jest.fn().mockReturnThis(),
};

const next = jest.fn();

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

  describe("When it receives a request without an authorization header", () => {
    test("Then it should invoke next with and error status 401", () => {
      const error = new Error("");

      req.header = jest.fn().mockReturnValueOnce(error);

      auth(req as CustomRequest, null, next as NextFunction);

      expect(next).toBeCalled();
    });
  });
});
