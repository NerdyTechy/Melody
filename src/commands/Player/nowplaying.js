const { SlashCommandBuilder, ButtonBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("nowplaying").setDescription("View information about the current track.").setDMPermission(false),
    async execute(interaction) {
        const queue = global.player.getQueue(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(global.config.embedColour);

        if (!queue) {
            embed.setDescription("There isn't currently any music playing.");
            return await interaction.reply({ embeds: [embed] });
        }

        const progress = queue.createProgressBar();
        embed.setDescription(`${progress}\n \n**[${queue.current.title}](${queue.current.url})** by **${queue.current.author}** is currently playing in **${interaction.guild.name}**. This track was requested by <@${queue.current.requestedBy.id}>.`);

        embed.setThumbnail(queue.current.thumbnail);

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`melody_back_song-${interaction.user.id}`)
                .setEmoji(global.config.backEmoji.length <= 3 ? { name: global.config.backEmoji.trim() } : { id: global.config.backEmoji.trim() })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`melody_pause_song-${interaction.user.id}`)
                .setEmoji(global.config.pauseEmoji.length <= 3 ? { name: global.config.pauseEmoji.trim() } : { id: global.config.pauseEmoji.trim() })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`melody_skip_song-${interaction.user.id}`)
                .setEmoji(global.config.pauseEmoji.length <= 3 ? { name: global.config.skipEmoji.trim() } : { id: global.config.skipEmoji.trim() })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`melody_stop-${interaction.user.id}`)
                .setEmoji(global.config.stopEmoji.length <= 3 ? { name: global.config.stopEmoji.trim() } : { id: global.config.stopEmoji.trim() })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`melody_song_lyrics-${interaction.user.id}`)
                .setEmoji(global.config.lyricsEmoji.length <= 3 ? { name: global.config.lyricsEmoji.trim() } : { id: global.config.lyricsEmoji.trim() })
                .setStyle(ButtonStyle.Secondary)
        );

        return await interaction.reply({ embeds: [embed], components: [row] });
    },
};
