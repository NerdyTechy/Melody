const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { Player } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder().setName("resume").setDescription("Resumes the current track.").setDMPermission(false),
    async execute(interaction) {
        const player = Player.singleton();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(global.config.embedColour);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("There isn't currently any music playing.");
            return await interaction.reply({ embeds: [embed] });
        }

        if (!queue.node.isPaused()) {
            embed.setDescription("The queue isn't currently paused.");
            return await interaction.reply({ embeds: [embed] });
        }

        queue.node.setPaused(false);

        embed.setDescription(`Successfully unpaused **[${queue.currentTrack.title}](${queue.currentTrack.url})**.`);

        return await interaction.reply({ embeds: [embed] });
    },
};
