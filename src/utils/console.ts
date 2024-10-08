import readline from "readline";
import { Client } from "discord.js";
import config from "../config";
import chalk from "chalk";
import os from "os-utils";
import fs from "fs";
import path from "path";

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "package.json"), "utf8"));

const Console = readline.createInterface({
    input: process.stdin as unknown as NodeJS.ReadableStream,
    output: process.stdout as unknown as NodeJS.WritableStream,
});

const banner = ` __  __      _           _       
|  \\/  |    | |         | |      
| \\  / | ___| | ___   __| |_   _ 
| |\\/| |/ _ \\ |/ _ \\ / _\` | | | |
| |  | |  __/ | (_) | (_| | |_| |
|_|  |_|\\___|_|\\___/ \\__,_|\\__, |
                            __/ |
                           |___/ `;

function print(str: string) {
    console.info(chalk.magenta(str));
}

function getCpuUsage(): Promise<string> {
    return new Promise((resolve) => {
        os.cpuUsage((value) => resolve((value * 100).toFixed(2)));
    });
}

async function getUsageStats() {
    const stats = { cpu: null, memTotal: null, memFree: null, platform: null, uptime: null };
    stats.cpu = await getCpuUsage();
    stats.memFree = `${os.freemem().toFixed(2)} MB`;
    stats.memTotal = `${os.totalmem().toFixed(2)} MB`;
    stats.platform = os.platform();
    stats.uptime = os.processUptime().toFixed(2);
    return stats;
}

export function initConsole(client: Client): void {
    Console.question("", async (input) => {
        switch (input.split(" ")[0].toLowerCase()) {
            case "help":
                print(`help: Prints this menu
info: Prints information about this instance of the bot
invite: Prints a Discord bot invite link for this Melody instance
servers: Prints the number of servers that this Melody instance is currently in
stop: Stops the bot instance
leaveguild <guild id>: Makes the bot leave the specified guild`);
                return initConsole(client);
            case "info": {
                const usageStats = await getUsageStats();
                print(`-----------------------------------------------------------------------------------
${banner}

Melody v${packageJson.version} by NerdyTechy.
https://github.com/NerdyTechy/Melody

Using ${Object.keys(packageJson.dependencies).length + Object.keys(packageJson.devDependencies).length} packages

CPU Usage: ${usageStats.cpu}%
Total Memory: ${usageStats.memTotal}
Free Memory: ${usageStats.memFree}
Platform: ${usageStats.platform}
Uptime: ${usageStats.uptime} seconds
-----------------------------------------------------------------------------------`);
                return initConsole(client);
            }
            case "invite":
                print(`Use this link to invite your instance of Melody to a server:\nhttps://discord.com/api/oauth2/authorize?client_id=${config.clientId}&permissions=274914887744&scope=bot%20applications.commands`);
                return initConsole(client);
            case "servers":
                print(`Your instance of Melody is in ${client.guilds.cache.size} guilds.`);
                print(`Server List: ${client.guilds.cache.map((g) => `${g.name} (${g.id})`).join(", ")}`);
                return initConsole(client);
            case "stop":
                return process.exit(0);
            case "leaveguild": {
                const args = input.split(" ").splice(1);
                if (!args || args.length !== 1 || args[0].length === 0) {
                    print("Invalid usage: leaveguild <guild id>");
                    return initConsole(client);
                }

                const guild = client.guilds.cache.get(args[0]);
                if (!guild) {
                    print("This instance of Melody is not in the specified guild.");
                    return initConsole(client);
                }

                await guild.leave();
                print(`Successfully left ${guild.name} (${guild.id}).`);
                return initConsole(client);
            }
            default:
                console.error("Invalid command: The command you have entered is invalid. Use 'help' to see a list of commands.");
                return initConsole(client);
        }
    });
}
