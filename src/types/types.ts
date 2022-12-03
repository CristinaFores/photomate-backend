import type { JwtPayload } from "jsonwebtoken";
import type { Request } from "express";
import type * as core from "express-serve-static-core";
import type { PostStructure } from "../database/models/Post.js";
export interface Credentials {
  username: string;
  password: string;
}

export interface RegisterData extends Credentials {
  email: string;
}
export interface CustomRequest<
  P = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any
> extends Request<P, ResBody, ReqBody> {
  userId: string;
}
export interface UserTokenPayload extends JwtPayload {
  id: string;
  username: string;
}

export interface PostById extends PostStructure {
  _id: string;
}
