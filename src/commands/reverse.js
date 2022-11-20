const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reverse')
        .setDescription('Applies the reverse effect to the current music.'),
    async execute(interaction, client){
        const queue = player.getQueue(interaction.guild.id);
        
        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);
        
        if (!queue || !queue.playing){
            embed.setDescription("There isn't currently any music playing.");
        } else{
            queue.setFilters({ "reverse": !queue.getFiltersEnabled().includes('reverse'), });
        	embed.setDescription(`The **reverse** filter is now ${queue.getFiltersEnabled().includes('reverse') ? 'enabled.' : 'disabled.'}`);
        }
        
        return await interaction.reply({ embeds: [embed] });
    },
};