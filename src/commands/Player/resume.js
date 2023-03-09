const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

// TODO update this command to work with discord-player v6
// TODO possibly merge this command with the pause command

module.exports = {
    data: new SlashCommandBuilder().setName("resume").setDescription("Resumes the current track.").setDMPermission(false),
    async execute(interaction) {
        const queue = global.player.getQueue(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(global.config.embedColour);

        if (!queue) {
            embed.setDescription("There isn't currently any music playing.");
            return await interaction.reply({ embeds: [embed] });
        }

        if (!queue.connection.paused) {
            embed.setDescription("The queue isn't currently paused.");
            return await interaction.reply({ embeds: [embed] });
        }

        queue.setPaused(false);

        embed.setDescription(`Successfully resumed **[${queue.current.title}](${queue.current.url})**.`);

        return await interaction.reply({ embeds: [embed] });
    },
};
