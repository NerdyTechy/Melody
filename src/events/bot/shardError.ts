import { Events } from "discord.js";
import logger from "../../utils/logger";

export default {
    name: Events.ShardError,
    once: false,
    async execute(error) {
        logger.error("An unhandled error occurred during runtime:");
        logger.error(error);
    },
};
