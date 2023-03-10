import mongoose from "mongoose";
import "../loadEnviroment.js";

export const connectDb = async (mongoUrl: string) => {
  await mongoose.connect(mongoUrl);

  mongoose.set("toJSON", {
    virtuals: true,
    transform(doc, ret) {
      delete ret._id;
      delete ret.__v;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return ret;
    },
  });
};
