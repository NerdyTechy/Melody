import { ColorResolvable, EmbedBuilder } from "discord.js";
import ms from "ms";
import config from "../../config";

export default {
    name: "emptyChannel",
    async execute(queue) {
        try {
            queue.delete();
        } catch (err) {
            null;
        }

        const embed = new EmbedBuilder();

        embed.setDescription(`The music was stopped due to ${ms(ms(config.player.leaveOnEmptyDelay), { long: true })} of inactivity.`);
        embed.setColor(config.embedColour as ColorResolvable);

        queue.metadata.channel.send({ embeds: [embed] });
    },
};
