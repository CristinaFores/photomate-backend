import type { Response, Request, NextFunction } from "express";
import { ValidationError } from "express-validation";
import CustomError from "../../CustomError/CustomError";
import { httpStatusCodes } from "../../database/utils/statusCodes";
import { generalError, unknownEndpoint } from "./errors";

const {
  clientErrors: { notFoundError },
  serverError: { errorGeneral },
} = httpStatusCodes;

beforeAll(() => {
  jest.clearAllMocks();
});
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

describe("Given errors middleware", () => {
  describe("And the function generalError", () => {
    describe("When it receives an Error with message 'Something went wrong', no status code and no public message", () => {
      test("Then it should invoke method status code 500 with message 'There is a error general ", () => {
        const errorMessage = "There is a error general";
        const errorStatusCode = errorGeneral;
        const error = new Error("Something went wrong");

        generalError(error as CustomError, null, res as Response, null);

        expect(res.status).toHaveBeenCalledWith(errorStatusCode);
        expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
      });
    });

    describe("When it receives a validation error", () => {
      test("Then returns the parsed error message ", () => {
        const customError = new ValidationError({}, {});
        generalError(customError, null, res as Response, null);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(customError);
      });
    });
  });
});
