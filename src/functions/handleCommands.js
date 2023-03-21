const { REST } = require("@discordjs/rest");
const { Routes } = require("discord.js");
const fs = require("node:fs");
const logger = require("../utils/logger");
const config = require("../config");

const token = config.token;
const clientId = config.clientId;

module.exports = (client) => {
    client.handleCommands = async () => {
        client.commandArray = [];

        const commandFolders = fs.readdirSync("src/commands");

        for (var folder of commandFolders) {
            const commandFiles = fs.readdirSync(`src/commands/${folder}`);
            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
                client.commands.set(command.data.name, command);
                client.commandArray.push(command.data.toJSON());
            }
        }

        const rest = new REST({ version: "10" }).setToken(token);

        (async () => {
            try {
                logger.info("Reloading application commands...");
                await rest.put(Routes.applicationCommands(clientId), {
                    body: client.commandArray,
                });
                logger.success("Successfully reloaded application commands.");
            } catch (error) {
                logger.error("An error occurred whilst attempting to reload application commands:");
                logger.error(error);
            }
        })();
    };
};
