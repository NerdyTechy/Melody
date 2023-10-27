const { REST, Routes } = require("discord.js");
import fs from 'fs';
import path from 'path';
import logger from '../utils/logger';
import config from '../config';

const token = config.botToken;
const clientId = config.clientId;

export default (client: any) => {
    if (!fs.existsSync(path.join(__dirname, '..', 'commands'))) return;

    client.commandArray = [];

    fs.readdirSync(path.join(__dirname, '..', 'commands')).forEach((folder) => {
        fs.readdirSync(path.join(__dirname, '..', 'commands', folder)).filter((file) => file.endsWith(".js") || file.endsWith(".ts")).forEach((file) => {
            const command = require(`../commands/${folder}/${file}`).default;
            client.commands.set(command.data.name, command);
            client.commandArray.push(command.data.toJSON());
        });
    });

    const rest = new REST().setToken(token);

    (async () => {
        try {
            logger.info("Reloading application commands...");
            await rest.put(Routes.applicationCommands(clientId), { body: client.commandArray });
            logger.success("Successfully reloaded application commands.");
        } catch (error) {
            logger.error("An error occurred whilst attempting to reload application commands:");
            logger.error(String(error));
        }
    })();
};
