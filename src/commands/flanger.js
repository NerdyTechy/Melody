const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('flanger')
        .setDescription('Applies the flanger effect to the current music.'),
    async execute(interaction, client){
        const queue = player.getQueue(interaction.guild.id);
        
        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);
        
        if (!queue || !queue.playing){
            embed.setDescription("There isn't currently any music playing.");
        } else{
            queue.setFilters({ "flanger": !queue.getFiltersEnabled().includes('flanger'), });
        	embed.setDescription(`The **flanger** filter is now ${queue.getFiltersEnabled().includes('flanger') ? 'enabled.' : 'disabled.'}`);
        }
        
        return await interaction.reply({ embeds: [embed] });
    },
};