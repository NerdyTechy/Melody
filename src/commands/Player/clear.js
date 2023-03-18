const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { Player } = require('discord-player');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder().setName("clear").setDescription("Removes all tracks from the queue.").setDMPermission(false),
    async execute(interaction) {
        const player = Player.singleton();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("There isn't currently any music playing.");
        } else if (!queue.tracks.toArray()[0]) {
            embed.setDescription("There aren't any other tracks in the queue. Use **/stop** to stop the current track.");
        } else {
            queue.tracks.clear();
            embed.setDescription("The server queue has been cleared.");
        }

        return await interaction.reply({ embeds: [embed] });
    },
};
