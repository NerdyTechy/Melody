const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js")
const { Player } = require('discord-player');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder().setName("pause").setDescription("Pauses the current track.").setDMPermission(false),
    async execute(interaction) {
        const player = Player.singleton();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("There isn't currently any music playing.");
            return await interaction.reply({ embeds: [embed] });
        }

        queue.node.setPaused(!queue.node.isPaused());

        embed.setDescription(`Successfully ${queue.node.isPaused() === true ? "paused" : "unpaused"} **[${queue.currentTrack.title}](${queue.currentTrack.url})**.`);

        return await interaction.reply({ embeds: [embed] });
    },
};
