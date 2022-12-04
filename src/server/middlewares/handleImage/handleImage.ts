import type { NextFunction, Response } from "express";
import path from "path";
import sharp from "sharp";
import CustomError from "../../../CustomError/CustomError.js";
import type { CustomRequest } from "../../../types/types.js";

const imagesRoute = process.env.IMAGES_ROUTE || "assets/images";

const handleImage = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    next();
    return;
  }

  const { filename, originalname } = req.file;

  try {
    const imagePath = `${path.basename(
      originalname,
      path.extname(originalname)
    )}`;

    await sharp(path.join(imagesRoute, filename))
      .resize(200, 200, { fit: "cover", position: "top" })
      .webp({ quality: 92 })
      .toFormat("webp")
      .toFile(path.join(imagesRoute, `${imagePath}.webp`));

    req.file.filename = `${imagePath}.webp`;

    next();
  } catch {
    const formatError = new CustomError(
      "Error formatting image",
      400,
      "Sorry, your image is not valid"
    );

    next(formatError);
  }
};

export default handleImage;
