const { EmbedBuilder } = require("discord.js");
const { Player } = require("discord-player");
const config = require("../config");

module.exports = {
    name: "melody_back_song",
    async execute(interaction) {
        const player = Player.singleton();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("There isn't currently any music playing.");
            return await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        }

        if (!queue.history.tracks.toArray()[0]) {
            embed.setDescription("There was no music played before this track.");
            return await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        }

        await queue.history.back();
        embed.setDescription(`<@${interaction.user.id}>: Returning to the previous track in queue.`);

        return await interaction.reply({ embeds: [embed] });
    },
};
