import chalk from "chalk";
import fs from "fs";
import { format } from "date-fns";
import config from "../config";

class Logger {
    info(str: string) {
        if (!fs.existsSync("logs")) fs.mkdirSync("logs");
        fs.appendFileSync(`logs/Log-${format(new Date(), "yyyy-MM-dd")}.log`, `[${format(new Date(), "hh:mm:ss")}] [Melody] [INFO]: ${str}\n`);
        console.info(chalk.cyan(`[Melody] ${chalk.bold("INFO:")} ${str}`));
    }

    warn(str: string) {
        if (!fs.existsSync("logs")) fs.mkdirSync("logs");
        fs.appendFileSync(`logs/Log-${format(new Date(), "yyyy-MM-dd")}.log`, `[${format(new Date(), "hh:mm:ss")}] [Melody] [WARN]: ${str}\n`);
        console.warn(chalk.yellow(`[Melody] ${chalk.bold("WARNING:")} ${str}`));
    }

    error(str: string) {
        if (!fs.existsSync("logs")) fs.mkdirSync("logs");
        fs.appendFileSync(`logs/Log-${format(new Date(), "yyyy-MM-dd")}.log`, `[${format(new Date(), "hh:mm:ss")}] [Melody] [ERROR]: ${str}\n`);
        console.error(chalk.red(`[Melody] ${chalk.bold("ERROR:")} ${str}`));
    }

    success(str: string) {
        if (!fs.existsSync("logs")) fs.mkdirSync("logs");
        fs.appendFileSync(`logs/Log-${format(new Date(), "yyyy-MM-dd")}.log`, `[${format(new Date(), "hh:mm:ss")}] [Melody] [SUCCESS]: ${str}\n`);
        console.info(chalk.green(`[Melody] ${chalk.bold("SUCCESS:")} ${str}`));
    }

    debug(str: string) {
        if (!config.debug) return;
        if (!fs.existsSync("logs")) fs.mkdirSync("logs");
        fs.appendFileSync(`logs/Debug-${format(new Date(), "yyyy-MM-dd")}.log`, `[${format(new Date(), "hh:mm:ss")}] [Melody] [DEBUG]: ${str}\n`);
        console.info(chalk.blueBright(`[Melody] ${chalk.bold("DEBUG:")} ${str}`));
    }
}

const logger = new Logger();
export default logger;
