const { EmbedBuilder } = require("discord.js");
const config = require('../../config.json');

module.exports = {
    name: 'melody_back_song',
    async execute(interaction, client){
        const queue = player.getQueue(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        if (!queue || !queue.playing){
            embed.setDescription("There isn't currently any music playing.");
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (!queue || !queue.playing) {
            embed.setDescription(`There isn't currently any music playing.`);
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        } else if (!queue.previousTracks[1]){
            embed.setDescription(`There was no music played before this track.`);
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            await queue.back();
            embed.setDescription(`<@${interaction.user.id}>: Returning to the previous track in queue.`);
        }
        
        return await interaction.reply({ embeds: [embed] });
    }
};