const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { PlayerError } = require('discord-player');
const config = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Adds a song to the end of the server queue.')
        .addStringOption(option => option.setName("query").setDescription("Enter a song name, artist name, or URL.").setRequired(true)),
    async execute(interaction, client){
        await interaction.deferReply();
        
        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        if (!interaction.member.voice.channelId){
            embed.setDescription("You aren't currently in a voice channel.");
            return await interaction.editReply({ embeds: [embed] });
        }

        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId){
            embed.setDescription("I can't play music in that voice channel.");
            return await interaction.editReply({ embeds: [embed] });
        } 

        const query = interaction.options.getString('query');
        const queue = player.createQueue(interaction.guild, {
            leaveOnEnd: true,
            leaveOnStop: true,
            leaveOnEmpty: true,
            leaveOnEmptyCooldown: 300000,
            autoSelfDeaf: false,
            spotifyBridge: true,
            ytdlOptions: {
                filter: 'audioonly',
                opusEncoded: true,
                quality: 'highestaudio',
                highWaterMark: 1 << 30,
            },
            metadata: {
                channel: interaction.channel
            }
        });

        try{
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch(err){
            queue.destroy();
            embed.setDescription("I can't join that voice channel.")
            return await interaction.editReply({ embeds: [embed] });
        }

        const res = await player.search(query, { requestedBy: interaction.user });

        if (!res){
            await queue.destroy();
            embed.setDescription(`I couldn't find anything with the name **${query}**.`);
            return await interaction.editReply({ embeds: [embed] });
        }

        try{
            res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]);
            if (!queue.playing) await queue.play();
        } catch(err){
            if (err instanceof PlayerError){
                if (err.statusCode == "InvalidTrack"){
                    embed.setDescription(`I couldn't find anything with the name **${query}**.`);
                    await queue.destroy();
                    return await interaction.editReply({ embeds: [embed] });
                }
            }

            console.log(err);

            await queue.destroy();
            embed.setDescription("This media doesn't seem to be working right now, please try again later.");
            return await interaction.followUp({ embeds: [embed] });
        }

        if (!res.playlist){
            embed.setDescription(`Loaded **[${res.tracks[0].title}](${res.tracks[0].url})** by **${res.tracks[0].author}** into the server queue.`);
        } else{
            embed.setDescription(`**${res.tracks.length} tracks** from the ${res.playlist.type} **[${res.playlist.title}](${res.playlist.url})** have been loaded into the server queue.`);
        }

        return await interaction.editReply({ embeds: [embed] });
    },
};