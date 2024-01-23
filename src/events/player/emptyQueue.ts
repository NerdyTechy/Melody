import { ColorResolvable, EmbedBuilder } from "discord.js";
import config from "../../config";

export default {
    name: "emptyQueue",
    async execute(queue) {
        try {
            queue.delete();
        } catch (err) {
            null;
        }

        const embed = new EmbedBuilder();

        embed.setDescription("The music was stopped because there were no more songs in the queue.");
        embed.setColor(config.embedColour as ColorResolvable);

        queue.metadata.channel.send({ embeds: [embed] });
    },
};
