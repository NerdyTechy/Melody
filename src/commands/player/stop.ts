import { ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { useMainPlayer } from "discord-player";
import config from "../../config";

export default {
    data: new SlashCommandBuilder().setName("stop").setDescription("Stops the current track and clears the queue.").setDMPermission(false),
    async execute(interaction, client) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour as ColorResolvable);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("There isn't currently any music playing.");
        } else {
            queue.delete();
            embed.setDescription("The music has been stopped.");
        }

        return await interaction.reply({ embeds: [embed] });
    },
};
