const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('seek')
        .setDescription('Seeks the current song to the specified position.')
        .addIntegerOption(option => option.setName('minutes').setDescription("The amount of minutes to seek to.").setRequired(true))
        .addIntegerOption(option => option.setName('seconds').setDescription("The amount of seconds to seek to.").setRequired(true)),
    async execute(interaction, client){
        const queue = player.getQueue(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);
        
        if (!queue){
            embed.setDescription("There isn't currently any music playing.");
            return interaction.reply({ embeds: [embed] });
        }

        const minutes = interaction.options.getInteger('minutes');
        const seconds = interaction.options.getInteger('seconds');

        const newPosition = (minutes * 60 * 1000) + (seconds * 1000);

        await queue.seek(newPosition);

        embed.setDescription(`The current song has been seeked to **${minutes !== 0 ? `${minutes} minutes and ` : ""} ${seconds} seconds**.`);

        return interaction.reply({ embeds: [embed] });
    },
};