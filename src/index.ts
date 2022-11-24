import environment from "./loadEnviroment.js";
import debugCreator from "debug";
import startServer from "./server/startServer.js";
import chalk from "chalk";
import app from "./server/app.js";
import { connectDb } from "./database/index.js";

const debug = debugCreator("post:server");

const { port, mongoDbUrl } = environment;

try {
  await startServer(app, +port);
  debug(chalk.magenta("Start server"));
  await connectDb(mongoDbUrl);
  debug(chalk.blue("Connect data base"));
} catch (error: unknown) {
  debug(
    chalk.red(`Error connecting to the database ${(error as Error).message}`)
  );
}
