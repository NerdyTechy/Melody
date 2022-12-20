const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const config = require('../../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses the current track.'),
    async execute(interaction, client){
        const queue = player.getQueue(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);
        
        if (!queue){
            embed.setDescription("There isn't currently any music playing.");
            return await interaction.reply({ embeds: [embed] });
        }

        if (queue.connection.paused){
            embed.setDescription("The queue is already paused.");
            return await interaction.reply({ embeds: [embed] });
        }

        queue.setPaused(true);

        embed.setDescription(`Successfully paused **[${queue.current.title}](${queue.current.url})**.`);

        return await interaction.reply({ embeds: [embed] });
    },
};