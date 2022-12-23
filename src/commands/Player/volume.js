const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("volume")
        .setDescription("Adjusts the volume of the current music.")
        .addIntegerOption((option) =>
            option
                .setName("volume")
                .setDescription("The volume to set the music to.")
                .setRequired(true)
        ),
    async execute(interaction, client) {
        const queue = player.getQueue(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        if (!queue || !queue.playing) {
            embed.setDescription(`There isn't currently any music playing.`);
        } else {
            const vol = interaction.options.getInteger("volume");

            if (queue.volume === vol) {
                embed.setDescription(
                    `The current queue volume is already set to ${vol}%.`
                );
                return await interaction.reply({ embeds: [embed] });
            }

            const maxVolume = 1000;

            if (vol < 0 || vol > maxVolume) {
                embed.setDescription(
                    `The number that you have specified is not valid. Please enter a number between **0 and ${maxVolume}**.`
                );
                return await interaction.reply({ embeds: [embed] });
            }

            const success = queue.setVolume(vol);
            success
                ? embed.setDescription(
                      `The current music's volume was set to **${vol}%**.`
                  )
                : embed.setDescription(
                      `An error occurred whilst attempting to set the volume.`
                  );
        }

        return await interaction.reply({ embeds: [embed] });
    },
};
