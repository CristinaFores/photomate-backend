import "../loadEnviroment.js";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { generalError, unknownEndpoint } from "./middelwares/errors.js";

const app = express();

app.use(cors());

app.disable("x-powered-by");

app.use(morgan("dev"));
app.use(express.json());

app.use(unknownEndpoint);
app.use(generalError);
app.use(generalError);
export default app;
