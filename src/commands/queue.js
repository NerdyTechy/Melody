const { SlashCommandBuilder, ButtonBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Shows all songs currently in the server queue.'),
    async execute(interaction, client){
        const queue = player.getQueue(interaction.guild.id);
        
        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        if (!queue){
            embed.setDescription(`There isn't currently any music playing.`);
            return await interaction.reply({ embeds: [embed] });
        } 

        if (!queue.tracks[0]){
            embed.setDescription(`There aren't any other songs in the queue. Use **/nowplaying** to show information about this song.`);
            return await interaction.reply({ embeds: [embed] });
        }  

        embed.setThumbnail(interaction.guild.iconURL({ size: 2048, dynamic: true }));
        embed.setAuthor({name: `Server Queue - ${interaction.guild.name}`});

        const tracks = queue.tracks.map((track, i) => `\`${i + 1}\` [${track.title}](${track.url}) by **${track.author}** (Requested by <@${track.requestedBy.id}>)`);
        const songs = queue.tracks.length;
        const nextSongs = songs > 5 ? `And **${songs - 5}** other ${(songs - 5) > 1 ? "songs" : "song"} currently in queue.` : ``;
        const progress = queue.createProgressBar();

        embed.setDescription(`**Current Song:** [${queue.current.title}](${queue.current.url}) by **${queue.current.author}**\n${progress}\n\n${tracks.slice(0, 5).join('\n')}\n\n${nextSongs}`);
        
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

        )

        return await interaction.reply({ embeds: [embed], components: [row] });
    },
};