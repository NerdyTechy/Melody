import { ChatInputCommandInteraction, ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { useMainPlayer } from "discord-player";
import config from "../../config";

export default {
    data: new SlashCommandBuilder().setName("back").setDescription("Returns to the previous track.").setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour as ColorResolvable);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("There isn't currently any music playing.");
        } else if (!queue.history.tracks.toArray()[0]) {
            embed.setDescription("There was no music played before this track.");
        } else {
            await queue.history.back();
            embed.setDescription("Returning to the previous track in queue.");
        }

        return await interaction.reply({ embeds: [embed] });
    },
};
