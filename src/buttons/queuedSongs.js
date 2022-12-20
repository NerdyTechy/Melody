const { EmbedBuilder } = require("discord.js");
const config = require('../../config.json');

module.exports = {
    name: 'melody_queue',
    async execute(interaction, client){
        const queue = player.getQueue(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        if (!queue){
            embed.setDescription("There isn't currently any music playing.");
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
        
        if (!queue.tracks[0]){
            embed.setDescription("There aren't any other tracks in the queue. Use **/nowplaying** to show information about this track.");
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }  
        
        embed.setThumbnail(interaction.guild.iconURL({ size: 2048, dynamic: true }));
        embed.setAuthor({name: `Server Queue - ${interaction.guild.name}`});
        
        const tracks = queue.tracks.map((track, i) => `\`${i + 1}\` [${track.title}](${track.url}) by **${track.author}** (Requested by <@${track.requestedBy.id}>)`);
        const songs = queue.tracks.length;
        const nextSongs = songs > 5 ? `And **${songs - 5}** other ${songs - 5 == 1 ? "track" : "tracks"}` : `**${songs}** ${songs == 1 ? "track" : "tracks"} currently in queue.`;
        const progress = queue.createProgressBar();
        
        embed.setDescription(`**Current Track:** [${queue.current.title}](${queue.current.url}) by **${queue.current.author}**\n${progress}\n\n${tracks.slice(0, 5).join('\n')}\n\n${nextSongs}`);
        
        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`melody_back_song-${interaction.user.id}`)
                .setEmoji({ id: config.backEmoji.id })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`melody_pause_song-${interaction.user.id}`)
                .setEmoji({ id: config.pauseEmoji.id })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`melody_skip_song-${interaction.user.id}`)
                .setEmoji({ id: config.skipEmoji.id })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`melody_stop-${interaction.user.id}`)
                .setEmoji({ id: config.stopEmoji.id })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`melody_song_lyrics-${interaction.user.id}`)
                .setEmoji({ id: config.lyricsEmoji.id })
                .setStyle(ButtonStyle.Secondary),
        );
        
        return await interaction.reply({ embeds: [embed], components: [row] });
    }
};