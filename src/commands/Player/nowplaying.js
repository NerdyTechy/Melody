const { SlashCommandBuilder, ButtonBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const { Player } = require("discord-player");
const config = require("../../config");

module.exports = {
    data: new SlashCommandBuilder().setName("nowplaying").setDescription("View information about the current track.").setDMPermission(false),
    async execute(interaction) {
        const player = Player.singleton();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("There isn't currently any music playing.");
            return await interaction.reply({ embeds: [embed] });
        }

        const progress = queue.node.createProgressBar();
        embed.setDescription(`${progress}\n \n**[${queue.currentTrack.title}](${queue.currentTrack.url})** by **${queue.currentTrack.author}** is currently playing in **${interaction.guild.name}**. This track was requested by <@${queue.currentTrack.requestedBy.id}>.`);

        embed.setThumbnail(queue.currentTrack.thumbnail);

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`melody_back_song-${interaction.user.id}`)
                .setEmoji(config.backEmoji.length <= 3 ? { name: config.backEmoji.trim() } : { id: config.backEmoji.trim() })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`melody_pause_song-${interaction.user.id}`)
                .setEmoji(config.pauseEmoji.length <= 3 ? { name: config.pauseEmoji.trim() } : { id: config.pauseEmoji.trim() })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`melody_skip_song-${interaction.user.id}`)
                .setEmoji(config.pauseEmoji.length <= 3 ? { name: config.skipEmoji.trim() } : { id: config.skipEmoji.trim() })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`melody_stop-${interaction.user.id}`)
                .setEmoji(config.stopEmoji.length <= 3 ? { name: config.stopEmoji.trim() } : { id: config.stopEmoji.trim() })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`melody_song_lyrics-${interaction.user.id}`)
                .setEmoji(config.lyricsEmoji.length <= 3 ? { name: config.lyricsEmoji.trim() } : { id: config.lyricsEmoji.trim() })
                .setStyle(ButtonStyle.Secondary)
        );

        return await interaction.reply({ embeds: [embed], components: [row] });
    },
};
