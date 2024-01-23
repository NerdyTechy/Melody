import { ColorResolvable, EmbedBuilder } from "discord.js";
import logger from "../../utils/logger";
import config from "../../config";

export default {
    name: "error",
    async execute(queue, error) {
        logger.error("An unhandled Melody error occurred during runtime:");
        logger.error(error);

        try {
            queue.delete();
        } catch (err) {
            null;
        }

        const errEmbed = new EmbedBuilder();
        errEmbed.setDescription("An error occurred whilst attempting to perform this action. This media may not be supported.");
        errEmbed.setColor(config.embedColour as ColorResolvable);

        queue.metadata.channel.send({ embeds: [errEmbed] });
        return;
    },
};
