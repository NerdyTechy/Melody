const { SlashCommandBuilder, ButtonBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('View information about the current track.'),
    async execute(interaction, client){
        const queue = player.getQueue(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);
        
        if (!queue){
            embed.setDescription("There isn't currently any music playing.");
            return await interaction.reply({ embeds: [embed] });
        }

        const progress = queue.createProgressBar();
        embed.setDescription(`${progress}\n \n**[${queue.current.title}](${queue.current.url})** by **${queue.current.author}** is currently playing in **${interaction.guild.name}**. This track was requested by <@${queue.current.requestedBy.id}>.`);
        
        embed.setThumbnail(queue.current.thumbnail);
        
        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`melody_back_song_${interaction.user.id}`)
                .setEmoji(config.backEmoji.length <= 3 ? { name: config.backEmoji.trim() } : { id: config.backEmoji.trim() })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`melody_pause_song_${interaction.user.id}`)
                .setEmoji(config.pauseEmoji.length <= 3 ? { name: config.pauseEmoji.trim() } : { id: config.pauseEmoji.trim() })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`melody_skip_song_${interaction.user.id}`)
                .setEmoji(config.pauseEmoji.length <= 3 ? { name: config.skipEmoji.trim() } : { id: config.skipEmoji.trim() })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`melody_stop_${interaction.user.id}`)
                .setEmoji(config.stopEmoji.length <= 3 ? { name: config.stopEmoji.trim() } : { id: config.stopEmoji.trim() })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`melody_song_lyrics_${interaction.user.id}`)
                .setEmoji(config.lyricEmoji.length <= 3 ? { name: config.lyricEmoji.trim() } : { id: config.lyricEmoji.trim() })
                .setStyle(ButtonStyle.Secondary),
        );
        
        return await interaction.reply({ embeds: [embed], components: [row] });
    },
};