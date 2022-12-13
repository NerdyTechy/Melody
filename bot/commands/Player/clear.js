const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const config = require('../../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clears the queue.'),
    async execute(interaction, client){
        const queue = player.getQueue(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);
        
        if (!queue || !queue.playing){
            embed.setDescription(`There isn't currently any music playing.`);
        } else if (!queue.tracks[0]) {
            embed.setDescription(`There isn't any other songs in the queue. Use **/stop** to stop this song.`);
        } else{
            await queue.clear();
            embed.setDescription("The server queue has been cleared.");
        }

        return await interaction.reply({ embeds: [embed] });
    },
};