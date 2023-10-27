import { ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { useMainPlayer } from "discord-player";
import config from "../../config";

export default {
    data: new SlashCommandBuilder().setName("resume").setDescription("Resumes the current track.").setDMPermission(false),
    async execute(interaction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour as ColorResolvable);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("There isn't currently any music playing.");
            return await interaction.reply({ embeds: [embed] });
        }

        if (!queue.node.isPaused()) {
            embed.setDescription("The queue isn't currently paused.");
            return await interaction.reply({ embeds: [embed] });
        }

        queue.node.setPaused(false);

        embed.setDescription(`Successfully unpaused **[${queue.currentTrack.title}](${queue.currentTrack.url})**.`);
        return await interaction.reply({ embeds: [embed] });
    },
};
