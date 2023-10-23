import chalk from "chalk";

export const warn = (...logs: unknown[]) => {
  console.log(
    `${chalk.black(new Date().toUTCString())} ${chalk.yellow("WARN")}`,
    ...logs
  );
};

export const error = (...logs: unknown[]) => {
  console.log(
    `${chalk.black(new Date().toUTCString())} ${chalk.red("ERROR")}`,
    ...logs
  );
};

export const info = (...logs: unknown[]) => {
  console.log(
    `${chalk.black(new Date().toUTCString())} ${chalk.blueBright("INFO")}`,
    ...logs
  );
};

export const success = (...logs: unknown[]) => {
  console.log(
    `${chalk.black(new Date().toUTCString())} ${chalk.green("SUCCESS")}`,
    ...logs
  );
};

export const debug = (...logs: unknown[]) => {
  console.log(
    `${chalk.black(new Date().toUTCString())} ${chalk.magentaBright("DEBUG")}`,
    ...logs
  );
};
