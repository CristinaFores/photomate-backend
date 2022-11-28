import type { NextFunction, Response } from "express";
import CustomError from "../../../CustomError/CustomError";
import Post from "../../../database/models/Post";
import type { CustomRequest } from "../../../types/types";
import { getPosts } from "./postControllers";

beforeEach(() => {
  jest.clearAllMocks();
});

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

describe("Given a getPosts controller", () => {
  const req: Partial<CustomRequest> = {
    userId: "123456",
  };

  describe("When it receives request with id '123456'", () => {
    test("Then it should call the response method status with a 200 and json with a list the user with'123456'", async () => {
      const postlist = [
        {
          title: "12345678",
          description: "esto es mi primer post",
          likes: [""],
          imagePaths: [""],
          buckpicture: [""],
          tags: [""],
          id: "6384fe9a96794a4b19432655",
        },
      ];
      const expectedStatus = 200;

      Post.find = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue(postlist),
      });

      await getPosts(req as CustomRequest, res as Response, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });

  describe("When it receives a request incorrect", () => {
    test("Then its should next should be called", async () => {
      const customError = new CustomError(
        "",
        500,
        "Database doesn't work, try again later"
      );

      const error = new Error();

      Post.find = jest.fn().mockRejectedValue(error);

      await getPosts(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(customError);
    });
  });
});
