import dotenv from "dotenv";

dotenv.config();

const environment = {
  port: process.env.PORT,
  mongoDbUrl: process.env.MONGODB_URL,
  jwtSecret: process.env.JWT_SECRET,
};

export default environment;
