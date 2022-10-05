const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('surround')
        .setDescription('Applies the surround effect to the current music.'),
    async execute(interaction, client){
        const queue = player.getQueue(interaction.guild.id);
        
        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);
        
        if (!queue || !queue.playing){
            embed.setDescription("There isn't currently any music playing.");
        } else{
            queue.setFilters({ "surrounding": !queue.getFiltersEnabled().includes('surrounding'), });
        	embed.setDescription(`The **surround** filter is now ${queue.getFiltersEnabled().includes('surrounding') ? 'enabled.' : 'disabled.'}`);
        }
        
        interaction.reply({ embeds: [embed] });
    },
};