import chalk from "chalk";
import fs from "fs";
import { format } from "date-fns";

class Logger {
    info(str: string) {
        if (!fs.existsSync("logs")) {
            fs.mkdirSync("logs");
        }
        fs.appendFile(`logs/Log-${format(new Date(), "yyyy-MM-dd")}.log`, `[${format(new Date(), "hh:mm:ss")}] [Melody] [INFO]: ${str}\n`, (err) => {
            if (err) throw err;
        });
        console.info(chalk.cyan(`[Melody] ${chalk.bold("INFO:")} ${str}`));
    }

    warn(str: string) {
        if (!fs.existsSync("logs")) {
            fs.mkdirSync("logs");
        }
        fs.appendFile(`logs/Log-${format(new Date(), "yyyy-MM-dd")}.log`, `[${format(new Date(), "hh:mm:ss")}] [Melody] [WARN]: ${str}\n`, (err) => {
            if (err) throw err;
        });
        console.warn(chalk.yellow(`[Melody] ${chalk.bold("WARNING:")} ${str}`));
    }

    error(str: string) {
        if (!fs.existsSync("logs")) {
            fs.mkdirSync("logs");
        }
        fs.appendFile(`logs/Log-${format(new Date(), "yyyy-MM-dd")}.log`, `[${format(new Date(), "hh:mm:ss")}] [Melody] [ERROR]: ${str}\n`, (err) => {
            if (err) throw err;
        });
        console.error(chalk.red(`[Melody] ${chalk.bold("ERROR:")} ${str}`));
    }

    success(str: string) {
        if (!fs.existsSync("logs")) {
            fs.mkdirSync("logs");
        }
        fs.appendFile(`logs/Log-${format(new Date(), "yyyy-MM-dd")}.log`, `[${format(new Date(), "hh:mm:ss")}] [Melody] [SUCCESS]: ${str}\n`, (err) => {
            if (err) throw err;
        });
        console.info(chalk.green(`[Melody] ${chalk.bold("SUCCESS:")} ${str}`));
    }

    debug(str: string) {
        if (!fs.existsSync("logs")) {
            fs.mkdirSync("logs");
        }
        fs.appendFile(`logs/Debug-${format(new Date(), "yyyy-MM-dd")}.log`, `[${format(new Date(), "hh:mm:ss")}] [Melody] [DEBUG]: ${str}\n`, (err) => {
            if (err) throw err;
        });
        console.info(chalk.blueBright(`[Melody] ${chalk.bold("DEBUG:")} ${str}`));
    }
}

const logger = new Logger();
export default logger;