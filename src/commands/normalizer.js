const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('normalizer')
        .setDescription('Applies the normalizer effect to the current music.'),
    async execute(interaction, client){
        const queue = player.getQueue(interaction.guild.id);
        
        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);
        
        if (!queue || !queue.playing){
            embed.setDescription("There isn't currently any music playing.");
        } else{
            queue.setFilters({ "normalizer2": !queue.getFiltersEnabled().includes('normalizer2'), });
        	embed.setDescription(`The **normalizer** filter is now ${queue.getFiltersEnabled().includes('normalizer2') ? 'enabled.' : 'disabled.'}`);
        }
        
        return await interaction.reply({ embeds: [embed] });
    },
};