import fs from "fs";
import path from "path";
import { useMainPlayer } from "discord-player";
import config from "../config";
import logger from "../utils/logger";
import { Client } from "discord.js";

export default (client: Client) => {
    const botEventsPath = path.join(__dirname, "../events/bot");
    fs.readdirSync(botEventsPath)
        .filter((file) => file.endsWith(".js") || file.endsWith(".ts"))
        .forEach((file) => {
            const filePath = path.join(botEventsPath, file);
            const event = require(filePath).default;
            if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
            else client.on(event.name, (...args) => event.execute(...args, client));
        });

    const playerEventsPath = path.join(__dirname, "../events/player");
    const player = useMainPlayer();

    fs.readdirSync(playerEventsPath)
        .filter((file) => file.endsWith(".js") || file.endsWith(".ts"))
        .forEach((file) => {
            const filePath = path.join(playerEventsPath, file);
            const event = require(filePath).default;
            player.events.on(event.name, (...args) => event.execute(...args, client));
        });

    player.on("debug", (message) => {
        if (config.debug) logger.debug(message);
    });
};
