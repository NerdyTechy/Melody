const chalk = require("chalk");
const fs = require("node:fs");

function info(str) {
    const date = new Date();
    if (!fs.existsSync("logs")) {
        fs.mkdirSync("logs");
    }
    if (!fs.existsSync(`logs/Log-${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}.txt`)) {
        fs.writeFile(`logs/Log-${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}.txt`, `[${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}] [Melody] [INFO]: ${str}`, (err) => {
            if (err) throw err;
        });
    } else {
        fs.appendFile(`logs/Log-${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}.txt`, `\n[${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}] [Melody] [INFO]: ${str}`, (err) => {
            if (err) throw err;
        });
    }
    console.info(chalk.cyan(`[Melody] ${chalk.bold("INFO:")} ${str}`));
}

function warn(str) {
    const date = new Date();
    if (!fs.existsSync("logs")) {
        fs.mkdirSync("logs");
    }
    if (!fs.existsSync(`logs/Log-${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}.txt`)) {
        fs.writeFile(`logs/Log-${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}.txt`, `[${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}] [Melody] [WARN]: ${str}`, (err) => {
            if (err) throw err;
        });
    } else {
        fs.appendFile(`logs/Log-${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}.txt`, `\n[${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}] [Melody] [WARN]: ${str}`, (err) => {
            if (err) throw err;
        });
    }
    console.warn(chalk.yellow(`[Melody] ${chalk.bold("WARNING:")} ${str}`));
}

function error(str) {
    const date = new Date();
    if (!fs.existsSync("logs")) {
        fs.mkdirSync("logs");
    }
    if (!fs.existsSync(`logs/Log-${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}.txt`)) {
        fs.writeFile(`logs/Log-${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}.txt`, `[${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}] [Melody] [ERROR]: ${str}`, (err) => {
            if (err) throw err;
        });
    } else {
        fs.appendFile(`logs/Log-${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}.txt`, `\n[${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}] [Melody] [ERROR]: ${str}`, (err) => {
            if (err) throw err;
        });
    }
    console.error(chalk.red(`[Melody] ${chalk.bold("ERROR:")} ${str}`));
}

function success(str) {
    const date = new Date();
    if (!fs.existsSync("logs")) {
        fs.mkdirSync("logs");
    }
    if (!fs.existsSync(`logs/Log-${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}.txt`)) {
        fs.writeFile(`logs/Log-${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}.txt`, `[${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}] [Melody] [SUCCESS]: ${str}`, (err) => {
            if (err) throw err;
        });
    } else {
        fs.appendFile(`logs/Log-${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}.txt`, `\n[${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}] [Melody] [SUCCESS]: ${str}`, (err) => {
            if (err) throw err;
        });
    }
    console.info(chalk.green(`[Melody] ${chalk.bold("SUCCESS:")} ${str}`));
}

module.exports = {
    info,
    warn,
    error,
    success,
};
