const { EmbedBuilder } = require("discord.js");
const { Player } = require("discord-player");
const config = require("../config");

module.exports = {
    name: "melody_pause_song",
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

        queue.node.setPaused(!queue.node.isPaused());

        embed.setDescription(`<@${interaction.user.id}>: Successfully ${queue.node.isPaused() ? "paused" : "unpaused"} **[${queue.currentTrack.title}](${queue.currentTrack.url})**.`);

        return await interaction.reply({ embeds: [embed] });
    },
};
