import { createClient } from "@supabase/supabase-js";
import type { NextFunction, Response } from "express";
import path from "path";
import fs from "fs/promises";
import environment from "../../../loadEnviroment.js";
import type { CustomRequest } from "../../../types/types.js";
import CustomError from "../../../CustomError/CustomError.js";

const { supabaseUrl, supabaseKey, supabaseBucket } = environment;
const imagesRoute = process.env.IMAGES_ROUTE || "assets/images";

const supabase = createClient(supabaseUrl, supabaseKey);

export const bucket = supabase.storage.from(supabaseBucket);

const imageBackupUpload = async (
  req: CustomRequest<Record<string, unknown>, Record<string, unknown>>,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    next();
    return;
  }

  try {
    const imagePath = path.join(imagesRoute, req.file.originalname);
    await fs.rename(path.join(imagesRoute, req.file.filename), imagePath);

    const filenameImage = await fs.readFile(imagePath);

    await bucket.upload(req.file.filename, filenameImage);

    const {
      data: { publicUrl },
    } = bucket.getPublicUrl(req.file.originalname);

    req.body.imagePaths = [imagePath];
    req.body.buckpicture = [publicUrl];

    next();
  } catch (error: unknown) {
    next(new CustomError((error as Error).message, 400, "Error image upload"));
  }
};

export default imageBackupUpload;
