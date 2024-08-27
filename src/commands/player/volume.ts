import { ChatInputCommandInteraction, ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { useMainPlayer } from "discord-player";
import config from "../../config";

export default {
    data: new SlashCommandBuilder()
        .setName("volume")
        .setDescription("Adjusts the volume of the current music.")
        .setDMPermission(false)
        .addIntegerOption((option) => option.setName("volume").setDescription("The volume to set the music to.").setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour as ColorResolvable);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("There isn't currently any music playing.");
        } else {
            const vol = interaction.options.getInteger("volume");

            if (queue.node.volume === vol) {
                embed.setDescription(`The current queue volume is already set to ${vol}%.`);
                return await interaction.reply({ embeds: [embed] });
            }

            if (vol < 0 || vol > 1000) {
                embed.setDescription("The number that you have specified is not valid. Please enter a number between **0** and **1000**.");
                return await interaction.reply({ embeds: [embed] });
            }

            const success = queue.node.setVolume(vol);
            embed.setDescription(success ? `The queue volume has been set to **${vol}%**.` : "An error occurred whilst attempting to set the volume.");
        }

        return await interaction.reply({ embeds: [embed] });
    },
};
