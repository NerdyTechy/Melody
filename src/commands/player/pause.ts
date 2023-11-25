import { ChatInputCommandInteraction, ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { useMainPlayer } from "discord-player";
import config from "../../config";

export default {
    data: new SlashCommandBuilder().setName("pause").setDescription("Pauses the current track.").setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour as ColorResolvable);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("There isn't currently any music playing.");
            return await interaction.reply({ embeds: [embed] });
        }

        queue.node.setPaused(!queue.node.isPaused());

        embed.setDescription(`Successfully ${queue.node.isPaused() === true ? "paused" : "unpaused"} **[${queue.currentTrack.title}](${queue.currentTrack.url})**.`);
        return await interaction.reply({ embeds: [embed] });
    },
};
