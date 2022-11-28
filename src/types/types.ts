import type { JwtPayload } from "jsonwebtoken";
import type { Request } from "express";
import type { PostStructure } from "../database/models/Post";
export interface Credentials {
  username: string;
  password: string;
}

export interface RegisterData extends Credentials {
  email: string;
}

export interface CustomRequest extends Request {
  userId: string;
}

export interface UserTokenPayload extends JwtPayload {
  id: string;
  username: string;
}

export interface PostById extends PostStructure {
  _id: string;
}
