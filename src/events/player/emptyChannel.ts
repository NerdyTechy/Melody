import { ColorResolvable, EmbedBuilder } from "discord.js";
import ms from "ms";
import config from "../../config";
import logger from "../../utils/logger";

export default {
    name: "emptyChannel",
    async execute(queue) {
        try {
            queue.delete();
        } catch (err) {
            logger.debug(err);
        }

        const embed = new EmbedBuilder();

        embed.setDescription(`The music was stopped due to ${ms(ms(config.player.leaveOnEmptyDelay), { long: true })} of inactivity.`);
        embed.setColor(config.embedColour as ColorResolvable);

        queue.metadata.channel.send({ embeds: [embed] });
    },
};
