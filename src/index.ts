import "./loadEnviroment.js";
import debugCreator from "debug";
import environment from "./loadEnviroment.js";
import startServer from "./server/startServer.js";
import chalk from "chalk";
import app from "./server/app.js";

const debug = debugCreator("post:server");

const { port } = environment;

try {
  await startServer(app, Number(port));
  debug(chalk.magenta("Start server"));
} catch (error: unknown) {
  debug(
    chalk.red(`Error connecting to the database ${(error as Error).message}`)
  );
}
