import type { NextFunction } from "express";
import fs from "fs/promises";
import CustomError from "../../../CustomError/CustomError";
import type { CustomRequest } from "../../../types/types";
import postsRoutes from "../../routers/routes/postsRouters";

import handleImage from "./handleImage";

const { imagesRoute } = postsRoutes;

const postlist = [
  {
    title: "12345678",
    description: "esto es mi primer post",
    imagePaths: [""],
    buckpicture: [""],
  },
];
const req: Partial<CustomRequest> = {
  body: postlist,
};

const next: NextFunction = jest.fn();

const file: Partial<Express.Multer.File> = {
  filename: "postImage",
  originalname: "postImageOriginal",
};

let mockedFile = jest.fn();

beforeAll(async () => {
  await fs.writeFile(`${imagesRoute}/testpost`, "testpost");
});

beforeEach(() => {
  jest.clearAllMocks();
});

jest.mock("sharp", () => () => ({
  resize: jest.fn().mockReturnValue({
    webp: jest.fn().mockReturnValue({
      toFormat: jest.fn().mockReturnValue({
        toFile: mockedFile,
      }),
    }),
  }),
}));

describe("Given the handleImage middleware", () => {
  describe("When it receives a request with a correct file", () => {
    test("Then it should resize the image and call next", async () => {
      const expectedFile = "postImageOriginal.webp";
      req.file = file as Express.Multer.File;

      await handleImage(req as CustomRequest, null, next);

      expect(next).toHaveBeenCalled();
      expect(req.file.filename).toBe(expectedFile);
    });
  });

  describe("When it receives a request with an invalid file", () => {
    test("Then next should be called with a CustomError", async () => {
      mockedFile = jest.fn().mockRejectedValue(new Error());

      const newError = new CustomError(
        "Error formating image",

        400,
        "Sorry, your image is not valid"
      );

      await handleImage(req as CustomRequest, null, next);

      expect(next).toBeCalledWith(newError);
    });
  });
});
