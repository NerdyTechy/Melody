const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("save")
        .setDescription(
            "Sends you a direct message with details about the current track."
        ),
    async execute(interaction, client) {
        const queue = player.getQueue(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        if (!queue) {
            embed.setDescription("There isn't currently any music playing.");
            return await interaction.reply({ embeds: [embed] });
        }

        const info = new EmbedBuilder();
        info.setColor(config.embedColour);

        info.setTitle("Track Saved");

        var message = `
            **Track Name:** [${queue.current.title}](${queue.current.url})
            **Author:** ${queue.current.author}
            **Duration:** ${queue.current.duration}\n`;

        if (queue.current.playlist) {
            message += `**Playlist:** [${queue.current.playlist.title}](${queue.current.playlist.url})\n`;
        }

        message += `**Saved:** <t:${Math.round(Date.now() / 1000)}:R>`;

        info.setDescription(message);
        info.setThumbnail(queue.current.thumbnail);
        info.setFooter({ text: `Track saved from ${interaction.guild.name}` });
        info.setTimestamp();

        try {
            await interaction.user.send({ embeds: [info] });
        } catch (err) {
            embed.setDescription(
                "I cannot send you direct messages. Check your privacy settings and try again."
            );
            return await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        }

        embed.setDescription(
            "Successfully saved the current track to your direct messages!"
        );

        return await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
