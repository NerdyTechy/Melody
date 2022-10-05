const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fs = require("fs");
const config = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the current song.'),
    async execute(interaction, client){
        const queue = player.getQueue(interaction.guild.id);
        
        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        if (!queue || !queue.playing) {
            embed.setDescription(`There isn't currently any music playing.`);
            return interaction.reply({ embeds: [embed] });
        }

        queue.skip();
        
        let rawdata = fs.readFileSync('src/data.json');
		var data = JSON.parse(rawdata);

        data["songs-skipped"] += 1;
        
        embed.setDescription(`The track **[${queue.current.title}](${queue.current.url})** was skipped.`);

        let newdata = JSON.stringify(data);
        fs.writeFileSync('src/data.json', newdata);
        
        return interaction.reply({ embeds: [embed] });
    },
};