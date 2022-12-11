const { EmbedBuilder } = require("discord.js");
const fs = require('node:fs');
const config = require('../../config.json');

module.exports = {
    name: 'melody_skip_song',
    async execute(interaction, client){
        const queue = player.getQueue(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        if (!queue || !queue.playing){
            embed.setDescription("There isn't currently any music playing.");
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        queue.skip();
        
        let rawdata = fs.readFileSync('src/data.json');
        var data = JSON.parse(rawdata);

        data["songs-skipped"] += 1;
        
        embed.setDescription(`<@${interaction.user.id}>: The track **[${queue.current.title}](${queue.current.url})** was skipped.`);

        let newdata = JSON.stringify(data);
        fs.writeFileSync('src/data.json', newdata);
        
        return await interaction.reply({ embeds: [embed] });
    }
};