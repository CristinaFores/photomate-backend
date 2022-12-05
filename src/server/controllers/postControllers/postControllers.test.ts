import type { NextFunction, Response } from "express";
import CustomError from "../../../CustomError/CustomError";
import Post from "../../../database/models/Post";
import type { CustomRequest } from "../../../types/types";
import {
  createPost,
  deletePostById,
  getPostById,
  getPosts,
} from "./postControllers";

beforeEach(() => {
  jest.clearAllMocks();
});

const req: Partial<CustomRequest> = {
  userId: "1234",
  params: {
    id: "1234",
  },
};

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

describe("Given a getPosts controller", () => {
  describe("When it receives request with id '123456'", () => {
    test("Then it should call the response method status with a 200 and json with a list the user with'123456'", async () => {
      const postlist = [
        {
          title: "new post",
          description: "description",
          likes: [""],
          imagePaths: ["../../../img/algo-salio-mal.png"],
          buckpicture: ["../../../img/algo-salio-mal.png"],
          tags: [""],
          owner: {
            username: "cristina",
            email: "cris@gmail.com",
            password:
              "$2b$10$SYawM.JWs/5zeVxLNHAF4.ObXqJpQrLduNl6.nfTn7e/PQQWn4yFq",
            picturePath: "",
            createdAt: "2022-11-30T15:01:04.893Z",
            updatedAt: "2022-11-30T15:01:04.893Z",
            id: "638770308b1f8378415ffd13",
          },
          date: "2022-12-01T15:10:24.551Z",
          id: "6388c3e008d4c054bd2e59eb",
        },
      ];

      const expectedStatus = 200;

      Post.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              populate: jest.fn(),
            }),
          }),
        }),
      });
      Post.populate = jest.fn().mockReturnValue(postlist);
      Post.count = jest.fn().mockReturnValue(1);

      await getPosts(
        {} as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });

  describe("When it receives a request incorrect", () => {
    test("Then its should next should be called", async () => {
      const error = new Error();
      Post.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              populate: jest.fn(),
            }),
          }),
        }),
      });
      Post.populate = jest.fn().mockRejectedValue(error);
      Post.count = jest.fn().mockReturnValue(1);

      await getPosts(null, res as Response, next as NextFunction);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("Given a getPostById controller", () => {
    const post = {
      title: "12345678",
      description: "esto es mi primer post",
      likes: [""],
      imagePaths: [""],
      buckpicture: [""],
      tags: [""],
      id: "6384fe9a96794a4b19432655",
    };

    req.params = { postId: post.id };

    describe("When it receives a request with post Id and correct", () => {
      test("Then it should call the response method status with a 200 and json with post", async () => {
        const expectedStatus = 200;

        Post.findById = jest.fn().mockReturnThis();
        Post.populate = jest.fn().mockReturnValue(post);

        await getPostById(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(res.status).toHaveBeenCalledWith(expectedStatus);
        expect(res.json).toHaveBeenCalledWith(post);
      });
    });

    describe("When it receives a request with an incorrect post id", () => {
      test("Then it should call the next with a response status 404 and public message 'Post not found'", async () => {
        Post.findById = jest.fn().mockReturnThis();
        Post.populate = jest.fn().mockResolvedValue("");
        await getPostById(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );
        const newCustomError = new CustomError(
          "Post not found",
          404,
          "Post not found"
        );
        expect(next).toHaveBeenCalledWith(newCustomError);
      });
    });

    describe("When it receives a request with id no exist", () => {
      test("Then it should call the next", async () => {
        const error = new Error();
        Post.findById = jest.fn().mockReturnThis();
        Post.populate = jest.fn().mockRejectedValue(error);
        await getPostById(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );
        expect(next).toHaveBeenCalled();
      });
    });
  });
});

describe("Given a deletePostById controller", () => {
  describe("When it receives a request from user id '123' to delete a post '1234'", () => {
    test("Then it should invoke next with an error with code 403", async () => {
      req.userId = "123";
      req.params = {
        id: "1234",
      };

      Post.findOne = jest.fn().mockResolvedValue({
        owner: { toString: jest.fn().mockReturnValue("5678") },
      });

      await deletePostById(req as CustomRequest, res as Response, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it receives a request from userId '1234' and the user is the owner 1234", () => {
    test("Then it should invoke response's status with 200 ", async () => {
      req.userId = "1234";
      req.params = {
        id: "1234",
      };

      const post = {
        title: "12345678",
        description: "esto es mi primer post",
        likes: [""],
        imagePaths: [""],
        buckpicture: [""],
        tags: [""],
        id: "6384fe9a96794a4b19432655",
      };

      Post.findOne = jest.fn().mockResolvedValue({
        owner: { toString: jest.fn().mockReturnValue("1234") },
        delete: jest.fn().mockResolvedValue(undefined),
        post,
      });

      await deletePostById(req as CustomRequest, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("When it receives a request to delete a post and there is an error", () => {
    test("Then it should invoke next with an error", async () => {
      req.userId = "1234";
      req.params = {
        id: "1234",
      };
      const error = new Error("");
      Post.findOne = jest.fn().mockResolvedValue({
        owner: { toString: jest.fn().mockReturnValue("1234") },
        delete: jest.fn().mockRejectedValue(error),
      });
      await deletePostById(req as CustomRequest, res as Response, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a controller createPost", () => {
  const post = {
    title: "12345678",
    description: "esto es mi primer post",
    likes: [""],
    imagePaths: [""],
    buckpicture: [""],
    tags: [""],
    id: "6384fe9a96794a4b19432655",
  };
  const req: Partial<CustomRequest> = {
    body: post,
    userId: "1234",
    params: {
      id: "1234",
    },
  };
  describe("When it receives a request create post with title,description,image", () => {
    test("Then it should the response method status with a 201 ", async () => {
      const newPost = { ...post };
      const expexStatus = 201;
      Post.find = jest.fn().mockReturnValue([]);
      Post.create = jest.fn().mockReturnValue(newPost);

      await createPost(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expexStatus);
    });
  });

  describe("When it receives a request create post with  error", () => {
    test("Then it should call next ", async () => {
      Post.find = jest.fn().mockResolvedValue([]);

      await createPost(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalled();
    });
  });
});
