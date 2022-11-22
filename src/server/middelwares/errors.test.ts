import type { Response, Request, NextFunction } from "express";
import CustomError from "../../CustomError/CustomError";
import { httpStatusCodes, unknownEndpoint } from "./errors";

const {
  clientErrors: { notFoundError },
} = httpStatusCodes;

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();
describe("Given an errors middleware", () => {
  describe("And the function unknownEndpoint", () => {
    describe("When it receives a request  with path '/Unknown' and a next function ", () => {
      test("Then its should invoke next with a custom error: 'Unknown Endpoint: /Unknown', status code 404", () => {
        const path = "/Unknown";

        const expectedError = new CustomError(
          `Unknown Endpoint: ${path}`,
          notFoundError,
          "Unknown Endpoint"
        );

        const req: Partial<Request> = {
          path,
        };
        unknownEndpoint(req as Request, res as Response, next as NextFunction);

        expect(next).toHaveBeenCalledWith(expectedError);
      });
    });
  });
});
