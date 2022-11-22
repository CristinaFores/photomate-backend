import "../loadEnviroment.js";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { unknownEndpoint } from "./middelwares/errors.js";

const app = express();

app.use(cors());

app.disable("x-powered-by");

app.use(morgan("dev"));
app.use(express.json());

app.use(unknownEndpoint);
export default app;
