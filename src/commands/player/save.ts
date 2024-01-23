import { ChatInputCommandInteraction, ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { useMainPlayer } from "discord-player";
import config from "../../config";

export default {
    data: new SlashCommandBuilder().setName("save").setDescription("Sends you a direct message with details about the current track.").setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour as ColorResolvable);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("There isn't currently any music playing.");
            return await interaction.reply({ embeds: [embed] });
        }

        let message = `
            **Track Name:** [${queue.currentTrack.title}](${queue.currentTrack.url})
            **Artist:** ${queue.currentTrack.author}
            **Duration:** ${queue.currentTrack.duration}\n`;

        if (queue.currentTrack.playlist) message += `**Playlist:** [${queue.currentTrack.playlist.title}](${queue.currentTrack.playlist.url})\n`;
        message += `**Saved:** <t:${Math.round(Date.now() / 1000)}:R>`;

        const info = new EmbedBuilder();
        info.setColor(config.embedColour as ColorResolvable);
        info.setTitle("Track Saved");
        info.setDescription(message);
        info.setThumbnail(queue.currentTrack.thumbnail);
        info.setFooter({ text: `Track saved from ${interaction.guild.name}` });
        info.setTimestamp();

        try {
            await interaction.user.send({ embeds: [info] });
        } catch (err) {
            embed.setDescription("I am unable to send you direct messages. Check your privacy settings and try again.");
            return await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        }

        embed.setDescription("Successfully saved the current track to your direct messages!");
        return await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
