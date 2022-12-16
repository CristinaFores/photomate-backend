/* eslint-disable @typescript-eslint/consistent-type-assertions */
import type { NextFunction, Response } from "express";
import fs from "fs/promises";
import CustomError from "../../../CustomError/CustomError";

import type { CustomRequest } from "../../../types/types";
import imageBackupUpload, { bucket } from "./imagesBackupUpload";

const imagesRoute = process.env.IMAGES_ROUTE || "assets/images";

const newPost = {
  title: "12345678",
  description: "esto es mi primer post",
  imagePaths: [""],
  buckpicture: [""],
};

delete newPost.buckpicture;

jest.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    storage: {
      from: () => ({
        upload: jest.fn().mockResolvedValue({ error: null }),
        bucket: () => ({
          getPublicUrl: () => ({
            publicUrl: "testFileImage.webptestOriginalImage.webp",
          }),
        }),
      }),
    },
  }),
}));

beforeEach(async () => {
  await fs.writeFile(`${imagesRoute}/testFileImage.webp`, "testFileImage");
  await fs.writeFile(
    `${imagesRoute}/testOriginalImage.webp`,
    "testOriginalImage"
  );
});

const fileTest = {
  filename: "testFileImage.webp",
  originalname: "testOriginalImage.webp",
} as Partial<Express.Multer.File>;

const req = {
  body: newPost,
  file: fileTest,
} as Partial<CustomRequest>;

const res: Partial<Response> = {};

const next = jest.fn();
describe("Given the imageBackupUpload middleware", () => {
  describe("When it's invoked with a file that have a file image in it", () => {
    test("Then it should rename the file and upload it to supabase", async () => {
      fs.readFile = jest.fn().mockResolvedValueOnce(newPost.imagePaths);

      bucket.upload = jest.fn();

      bucket.getPublicUrl = jest
        .fn()
        .mockReturnValueOnce({ data: { publicUrl: newPost.imagePaths } });

      await imageBackupUpload(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it's invoked with a file in the request and throws an error", () => {
    test("Then it should call next with a CustomError", async () => {
      const customError = new CustomError("", 400, "Error image upload");
      fs.readFile = jest.fn().mockRejectedValue(customError);

      await imageBackupUpload(req as CustomRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });
});
