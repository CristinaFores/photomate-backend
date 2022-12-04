import "../loadEnviroment.js";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { generalError, unknownEndpoint } from "./middlewares/errors.js";
import userRouters from "./routers/userRouters/usersRouters.js";
import corsOptions from "./cors/corsOptions.js";
import postsRouter from "./routers/postRouters/postRouters.js";
import { auth } from "./middlewares/auth/auth.js";

const app = express();

app.disable("x-powered-by");
app.use(cors(corsOptions));

app.use(morgan("dev"));
app.use(express.json());
app.use("/users", userRouters);
app.use("/posts", auth, postsRouter);
app.use(unknownEndpoint);
app.use(generalError);

export default app;
