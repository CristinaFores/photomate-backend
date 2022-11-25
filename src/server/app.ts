import "../loadEnviroment.js";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { generalError, unknownEndpoint } from "./middlewares/errors.js";
import userRouters from "./routers/usersRouters.js";
import corsOptions from "./cors/corsOptions.js";

const app = express();

app.use(cors(corsOptions));

app.disable("x-powered-by");

app.use(morgan("dev"));
app.use(express.json());
app.use("/users", userRouters);

app.use(unknownEndpoint);
app.use(generalError);

export default app;
