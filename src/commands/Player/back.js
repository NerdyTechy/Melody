const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { Player } = require('discord-player');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder().setName("back").setDescription("Returns to the previous track.").setDMPermission(false),
    async execute(interaction) {
        const player = Player.singleton();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("There isn't currently any music playing.");
        } else if (!queue.history.tracks.toArray()[0]) {
            embed.setDescription("There was no music played before this track.");
        } else {
            await queue.history.back();
            embed.setDescription("Returning to the previous track in queue.");
        }

        return await interaction.reply({ embeds: [embed] });
    },
};
