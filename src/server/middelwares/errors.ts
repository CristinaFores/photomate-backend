import "../../loadEnviroment.js";
import type { NextFunction, Request, Response } from "express";
import CustomError from "../../CustomError/CustomError.js";

export const httpStatusCodes = {
  clientErrors: {
    notFoundError: 404,
  },
  serverError: {
    errorGeneral: 500,
  },
};
const {
  clientErrors: { notFoundError },
  serverError: { errorGeneral },
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

export const generalError = (
  error: CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  next: NextFunction
) => {
  const statusCode = error.statusCode ?? errorGeneral;
  const publicMessage = error.publicMessage || "There is a error general";

  res.status(statusCode).json({ error: publicMessage });
};
