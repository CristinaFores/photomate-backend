import type { NextFunction, Response } from "express";
import path from "path";
import sharp from "sharp";
import CustomError from "../../../CustomError/CustomError.js";
import type { CustomRequest } from "../../../types/types.js";
import environment from "../../../loadEnviroment.js";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const { supabaseUrl, supabaseKey, supabaseBucket } = environment;
const imagesRoute = process.env.IMAGES_ROUTE || "assets/images";
const supabase = createClient(supabaseUrl, supabaseKey);
export const bucket = supabase.storage.from(supabaseBucket);

const handleImage = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    next();
    return;
  }

  try {
    const file = await sharp(req.file.buffer)
      .resize({ height: 400, width: 400, fit: sharp.fit.cover })
      .webp({ quality: 80 })
      .toFormat("webp")
      .toBuffer();

    const fileName = `${crypto.randomBytes(16).toString("hex")}.webp`;

    await bucket.upload(fileName, file);
    const {
      data: { publicUrl },
    } = bucket.getPublicUrl(fileName);

    await sharp(file).toFile(path.join(imagesRoute, `${fileName}`));

    req.file.filename = fileName;
    req.body.imagePaths = [`assets/images/${fileName}`];
    req.body.buckpicture = [publicUrl];
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
