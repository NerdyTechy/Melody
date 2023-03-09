const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

// TODO update this command to work with discord-player v6

module.exports = {
    data: new SlashCommandBuilder().setName("back").setDescription("Returns to the previous track.").setDMPermission(false),
    async execute(interaction) {
        const queue = global.player.getQueue(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(global.config.embedColour);

        if (!queue || !queue.playing) {
            embed.setDescription("There isn't currently any music playing.");
        } else if (!queue.previousTracks[1]) {
            embed.setDescription("There was no music played before this track.");
        } else {
            await queue.back();
            embed.setDescription("Returning to the previous track in queue.");
        }

        return await interaction.reply({ embeds: [embed] });
    },
};
