import debugCreator from "debug";
import chalk from "chalk";

const debug = debugCreator("custom-error");

class CustomError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public publicMessage: string
  ) {
    super(message);
    debug(chalk.red(message));
  }
}
export default CustomError;
