import type { Response, Request, NextFunction } from "express";
import CustomError from "../../CustomError/CustomError";
import { generalError, httpStatusCodes, unknownEndpoint } from "./errors";

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

describe("Given errors middelware", () => {
  describe("And the function generalError", () => {
    describe("When it receives an Error with message 'Something went wrong', no status code and no public message", () => {
      test("Then it should invoke metohd staus code 500 with message 'There is a error general ", () => {
        const errorMessage = "There is a error general";
        const errorStatusCode = errorGeneral;
        const error = new Error("Something went wrong");

        generalError(error as CustomError, null, res as Response, null);

        expect(res.status).toHaveBeenCalledWith(errorStatusCode);
        expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
      });
    });

    describe("when it recieves an CustomError with message intern, status code 404, and message public 'Theres is a error general", () => {
      test("Then it should invoke metohd statsus code 404, with message 'There is a error general' ", () => {
        const errorStatusCode = errorGeneral;

        const customError = new CustomError(
          "Something went wrong",
          errorStatusCode,
          "There is a error gener"
        );

        generalError(customError, null, res as Response, null);
      });
    });
  });
});
