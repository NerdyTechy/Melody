import { ButtonInteraction, ColorResolvable, EmbedBuilder } from "discord.js";
import { useMainPlayer } from "discord-player";
import config from "../config";

export default {
    name: "playerPause",
    async execute(interaction: ButtonInteraction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour as ColorResolvable);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("There isn't currently any music playing.");
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        queue.node.setPaused(!queue.node.isPaused());

        embed.setDescription(`<@${interaction.user.id}>: Successfully ${queue.node.isPaused() ? "paused" : "unpaused"} **[${queue.currentTrack.title}](${queue.currentTrack.url})**.`);
        return await interaction.reply({ embeds: [embed] });
    },
};
