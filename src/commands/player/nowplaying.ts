import { EmbedBuilder, ActionRowBuilder, ButtonStyle, SlashCommandBuilder, ButtonBuilder, ColorResolvable, ChatInputCommandInteraction } from "discord.js";
import { useMainPlayer } from "discord-player";
import config from "../../config";

export default {
    data: new SlashCommandBuilder().setName("nowplaying").setDescription("View information about the current track.").setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour as ColorResolvable);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("There isn't currently any music playing.");
            return await interaction.reply({ embeds: [embed] });
        }

        const progress = queue.node.createProgressBar();

        embed.setAuthor({ name: `${queue.currentTrack.title} - ${queue.currentTrack.author}`, url: queue.currentTrack.url });
        embed.setDescription(`${progress}\n\nThis track was requested by <@${queue.currentTrack.requestedBy.id}>.`);
        embed.setThumbnail(queue.currentTrack.thumbnail);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("playerBack")
                .setEmoji(config.emojis.back.length <= 3 ? { name: config.emojis.back.trim() } : { id: config.emojis.back.trim() })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("playerPause")
                .setEmoji(config.emojis.pause.length <= 3 ? { name: config.emojis.pause.trim() } : { id: config.emojis.pause.trim() })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("playerSkip")
                .setEmoji(config.emojis.pause.length <= 3 ? { name: config.emojis.skip.trim() } : { id: config.emojis.skip.trim() })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("playerStop")
                .setEmoji(config.emojis.stop.length <= 3 ? { name: config.emojis.stop.trim() } : { id: config.emojis.stop.trim() })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("lyrics")
                .setEmoji(config.emojis.lyrics.length <= 3 ? { name: config.emojis.lyrics.trim() } : { id: config.emojis.lyrics.trim() })
                .setStyle(ButtonStyle.Secondary)
        );

        return await interaction.reply({ embeds: [embed], components: [row] });
    },
};
