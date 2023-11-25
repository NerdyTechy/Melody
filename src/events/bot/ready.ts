import logger from "../../utils/logger";
import config from "../../config";
import { initConsole } from "../../utils/console";
import axios from "axios";
import crypto from "crypto";
import { Events } from "discord.js";

export default {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        if (config.enableAnalytics) {
            axios.post("https://analytics.techy.lol/melody", { identifier: crypto.createHash("sha256").update(config.clientId).digest("hex") }, { headers: { "Content-Type": "application/json" } }).catch(() => null);
        }

        initConsole(client);

        logger.success("Melody is now ready.");

        if (client.guilds.cache.size === 0) {
            logger.warn(`Melody is not in any servers. Invite Melody to your server using the following link: https://discord.com/api/oauth2/authorize?client_id=${config.clientId}&permissions=274914887744&scope=bot%20applications.commands`);
        } else {
            logger.info(`Melody is in ${client.guilds.cache.size} ${client.guilds.cache.size === 1 ? "server" : "servers"}.`);
        }
    },
};
