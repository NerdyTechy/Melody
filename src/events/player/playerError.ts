import { ColorResolvable, EmbedBuilder } from "discord.js";
import logger from "../../utils/logger";
import config from "../../config";

export default {
    name: "playerError",
    async execute(queue, error) {
        logger.error("A player error occurred whilst attempting to perform this action:");
        logger.error(error);

        try {
            queue.delete();
        } catch (err) {
            null;
        }

        const errEmbed = new EmbedBuilder();
        errEmbed.setDescription("A player error occurred whilst attempting to perform this action.");
        errEmbed.setColor(config.embedColour as ColorResolvable);

        queue.metadata.channel.send({ embeds: [errEmbed] });
        return;
    },
};
