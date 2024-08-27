import { ColorResolvable, EmbedBuilder } from "discord.js";
import config from "../../config";
import logger from "../../utils/logger";

export default {
    name: "emptyQueue",
    async execute(queue) {
        try {
            queue.delete();
        } catch (err) {
            logger.debug(err);
        }

        const embed = new EmbedBuilder();

        embed.setDescription("The music was stopped because there were no more songs in the queue.");
        embed.setColor(config.embedColour as ColorResolvable);

        queue.metadata.channel.send({ embeds: [embed] });
    },
};
