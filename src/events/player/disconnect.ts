import { ColorResolvable, EmbedBuilder } from "discord.js";
import config from "../../config";
import logger from "../../utils/logger";

export default {
    name: "disconnect",
    async execute(queue) {
        try {
            queue.delete();
        } catch (err) {
            logger.debug(err);
        }

        const embed = new EmbedBuilder();

        embed.setDescription("The music was stopped because I was disconnected from the channel.");
        embed.setColor(config.embedColour as ColorResolvable);

        queue.metadata.channel.send({ embeds: [embed] });
    },
};
