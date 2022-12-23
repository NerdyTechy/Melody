const { EmbedBuilder } = require("discord.js");
const config = require("../../config.json");

module.exports = {
    name: "melody_pause_song",
    async execute(interaction, client) {
        const queue = player.getQueue(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        if (!queue || !queue.playing) {
            embed.setDescription("There isn't currently any music playing.");
            return await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        }

        if (!queue) {
            embed.setDescription("There isn't currently any music playing.");
            return await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        }

        queue.setPaused(!queue.connection.paused);

        embed.setDescription(
            `<@${interaction.user.id}>: Successfully ${
                queue.connection.paused ? "paused" : "unpaused"
            } **[${queue.current.title}](${queue.current.url})**.`
        );

        return await interaction.reply({ embeds: [embed] });
    },
};
