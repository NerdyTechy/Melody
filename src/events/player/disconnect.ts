import { ColorResolvable, EmbedBuilder } from "discord.js";
import ms from "ms";
import config from "../../config";

export default {
    name: "disconnect",
    async execute(queue) {
        try {
            queue.delete();
        } catch (err) {
            null;
        }

        const embed = new EmbedBuilder();

        embed.setDescription(`The music was stopped because I was disconnected from the channel.`);
        embed.setColor(config.embedColour as ColorResolvable);

        queue.metadata.channel.send({ embeds: [embed] });
    },
};
