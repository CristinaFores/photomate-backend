import "../../loadEnviroment.js";
import type { NextFunction, Request, Response } from "express";
import CustomError from "../../CustomError/CustomError.js";

export const httpStatusCodes = {
  clientErrors: {
    notFoundError: 404,
  },
};
const {
  clientErrors: { notFoundError },
} = httpStatusCodes;

export const unknownEndpoint = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { path } = req;

  next(
    new CustomError(
      `Unknown Endpoint: ${path}`,
      notFoundError,
      "Unknown endpoint"
    )
  );
};
