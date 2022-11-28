import "../loadEnviroment.js";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { generalError, unknownEndpoint } from "./middlewares/errors.js";
import userRouters from "./routers/userRouters/usersRouters.js";
import corsOptions from "./cors/corsOptions.js";
import postsRouters from "./routers/postRouters/postRouters.js";

const app = express();

app.disable("x-powered-by");
app.use(cors(corsOptions));

app.use(morgan("dev"));
app.use(express.json());
app.use("/users", userRouters);
app.use("/users", postsRouters);
app.use(unknownEndpoint);
app.use(generalError);

export default app;
