const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fs = require("fs");
const config = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffles all songs currently in the queue.'),
    async execute(interaction, client){
        const queue = player.getQueue(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);
        
        if (!queue || !queue.playing){
            embed.setDescription("There isn't currently any music playing.");
            return interaction.reply({ embeds: [embed] });
        } 

        if (!queue.tracks[0]){
            embed.setDescription(`There isn't any other songs in the queue. Use **/play** to add some more.`);
            return interaction.reply({ embeds: [embed] });
        } 

        await queue.shuffle();
        
        let rawdata = fs.readFileSync('src/data.json');
		var data = JSON.parse(rawdata);

        data["queues-shuffled"] += 1;
        
        let newdata = JSON.stringify(data);
        fs.writeFileSync('src/data.json', newdata);

        embed.setDescription(queue.tracks.length > 1 ? `Successfully shuffled **${queue.tracks.length} songs**!` : `Successfully shuffled **${queue.tracks.length} song**!`);
        return interaction.reply({ embeds: [embed] });
    },
};