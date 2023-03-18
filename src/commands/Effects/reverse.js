const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { Player } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder().setName("reverse").setDescription("Applies the reverse effect to the current music.").setDMPermission(false),
    async execute(interaction) {
        const player = Player.singleton();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(global.config.embedColour);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("There isn't currently any music playing.");
        } else {
            queue.filters.ffmpeg.toggle(['reverse']);
            embed.setDescription(`The **reverse** filter is now ${queue.filters.ffmpeg.filters.includes('reverse') ? "enabled." : "disabled."}`);
        }

        return await interaction.reply({ embeds: [embed] });
    },
};
