import { ColorResolvable, EmbedBuilder } from "discord.js";
import { useMainPlayer } from "discord-player";
import config from "../config";

export default {
    name: "playerBack",
    async execute(interaction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour as ColorResolvable);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("There isn't currently any music playing.");
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (!queue.history.tracks.toArray()[0]) {
            embed.setDescription("There was no music played before this track.");
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await queue.history.back();
        embed.setDescription(`<@${interaction.user.id}>: Returning to the previous track in queue.`);

        return await interaction.reply({ embeds: [embed] });
    },
};
