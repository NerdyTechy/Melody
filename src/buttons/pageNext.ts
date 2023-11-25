import { ButtonBuilder, EmbedBuilder, ActionRowBuilder, ButtonStyle } from "discord.js";
import { useMainPlayer } from "discord-player";
import { paginate, numberOfPages } from "../utils/pagination";
import config from "../config";

export default {
    name: "pageNext",
    async execute(interaction, client) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild.id);

        const currentPage = parseInt(String(interaction.customId).split("-")[2]);

        const embed = new EmbedBuilder();

        const queuedTracks = queue.tracks.toArray();

        embed.setThumbnail(interaction.guild.iconURL({ size: 2048, dynamic: true }) || client.user.displayAvatarURL({ size: 2048, dynamic: true }));
        embed.setAuthor({ name: `Server Queue - ${interaction.guild.name}` });

        const numPages = numberOfPages(queuedTracks, 5);

        if (currentPage + 1 > numPages) return interaction.update({ content: null });

        const paginated = paginate(queuedTracks, 5, (currentPage + 1) % numPages);

        const tracks = paginated.data.map((track, i) => `\`${paginated.startIndex + i + 1}\` [${track.title}](${track.url}) by **${track.author}** (Requested by <@${track.requestedBy.id}>)`);
        const progress = queue.node.createProgressBar();

        embed.setDescription(`**Current Track:** [${queue.currentTrack.title}](${queue.currentTrack.url}) by **${queue.currentTrack.author}**\n${progress}\n\n${tracks.join("\n")}`);
        embed.setFooter({ text: `${queuedTracks.length} songs  •  Page ${currentPage + 1} of ${numPages}` });
        embed.setTimestamp();

        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`pageFirst-${interaction.user.id}-${currentPage + 1}`)
                .setLabel("First Page")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(`pagePrevious-${interaction.user.id}-${currentPage + 1}`)
                .setLabel("Previous Page")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(`pageNext-${interaction.user.id}-${currentPage + 1}`)
                .setLabel("Next Page")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(`pageLast-${interaction.user.id}-${currentPage + 1}`)
                .setLabel("Last Page")
                .setStyle(ButtonStyle.Primary)
        );

        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`playerBack`)
                .setEmoji(config.emojis.back.length <= 3 ? { name: config.emojis.back.trim() } : { id: config.emojis.back.trim() })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`playerPause`)
                .setEmoji(config.emojis.pause.length <= 3 ? { name: config.emojis.pause.trim() } : { id: config.emojis.pause.trim() })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`playerSkip`)
                .setEmoji(config.emojis.pause.length <= 3 ? { name: config.emojis.skip.trim() } : { id: config.emojis.skip.trim() })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`playerStop`)
                .setEmoji(config.emojis.stop.length <= 3 ? { name: config.emojis.stop.trim() } : { id: config.emojis.stop.trim() })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`lyrics`)
                .setEmoji(config.emojis.lyrics.length <= 3 ? { name: config.emojis.lyrics.trim() } : { id: config.emojis.lyrics.trim() })
                .setStyle(ButtonStyle.Secondary)
        );

        return await interaction.update({ embeds: [embed], components: numPages > 1 ? [row1, row2] : [row2] });
    },
};
