const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { Player } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder().setName("vaporwave").setDescription("Applies the vaporwave effect to the current music.").setDMPermission(false),
    async execute(interaction) {
        const player = Player.singleton();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(global.config.embedColour);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("There isn't currently any music playing.");
        } else {
            queue.filters.ffmpeg.toggle(['vaporwave']);
            embed.setDescription(`The **vaporwave** filter is now ${queue.filters.ffmpeg.filters.includes('vaporwave') ? "enabled." : "disabled."}`);
        }

        return await interaction.reply({ embeds: [embed] });
    },
};
