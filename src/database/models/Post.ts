import type { InferSchemaType } from "mongoose";
import { model, Schema } from "mongoose";

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
    min: 2,
    max: 50,
  },
  description: {
    type: String,
    required: true,
    min: 2,
    max: 160,
  },
  location: {
    type: String,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  imagePaths: [
    {
      type: String,
    },
  ],
  buckpicture: [
    {
      type: String,
    },
  ],
  tags: [
    {
      type: String,
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
  },
});

const Post = model("Post", postSchema, "posts");
export type PostStructure = InferSchemaType<typeof postSchema>;

export default Post;
