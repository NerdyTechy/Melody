const { EmbedBuilder } = require("discord.js");
const { Lyrics } = require('@discord-player/extractor');
const fs = require('node:fs');
const config = require('../../../config.json');

const lyricsClient = Lyrics.init(config.geniusApiKey);

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            try { await command.execute(interaction, client);
            } catch (error) { console.error(error); }
        } else if (interaction.isButton()){

            const queue = player.getQueue(interaction.guild.id);

            const embed = new EmbedBuilder();
            embed.setColor(config.embedColour);

            if (!queue || !queue.playing){
                embed.setDescription("There isn't currently any music playing.");
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            /*console.log(interaction.guild.voiceStates);

            if (interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id){
                embed.setDescription("You must be in the same channel as me to use these controls.");
                return await interaction.reply({ embeds: [embed] });
            }*/
                
            if (interaction.customId.startsWith("melody_back_song_")){

                if (!queue || !queue.playing) {
                    embed.setDescription(`There isn't currently any music playing.`);
                    return await interaction.reply({ embeds: [embed], ephemeral: true });
                } else if (!queue.previousTracks[1]){
                    embed.setDescription(`There was no music played before this track.`);
                    return await interaction.reply({ embeds: [embed], ephemeral: true });
                } else {
                    await queue.back();
                    embed.setDescription(`<@${interaction.user.id}>: Returning to the previous track in queue.`);
                }
                
                return await interaction.reply({ embeds: [embed] });

            } else if (interaction.customId.startsWith("melody_pause_song_")){

                if (!queue){
                    embed.setDescription("There isn't currently any music playing.")
                    return await interaction.reply({ embeds: [embed], ephemeral: true });
                }
        
                queue.setPaused(!queue.connection.paused);
        
                embed.setDescription(`<@${interaction.user.id}>: Successfully ${queue.connection.paused ? "paused" : "unpaused"} **[${queue.current.title}](${queue.current.url})**.`);
        
                return await interaction.reply({ embeds: [embed] });

            } else if (interaction.customId.startsWith("melody_skip_song_")){

                if (!queue || !queue.playing) {
                    embed.setDescription(`There isn't currently any music playing.`);
                    return await interaction.reply({ embeds: [embed], ephemeral: true });
                }

                queue.skip();
                
                let rawdata = fs.readFileSync('src/data.json');
                var data = JSON.parse(rawdata);

                data["songs-skipped"] += 1;
                
                embed.setDescription(`<@${interaction.user.id}>: The track **[${queue.current.title}](${queue.current.url})** was skipped.`);

                let newdata = JSON.stringify(data);
                fs.writeFileSync('src/data.json', newdata);
                
                return await interaction.reply({ embeds: [embed] });

            } else if (interaction.customId.startsWith("melody_queue_")){

                if (!queue){
                    embed.setDescription(`There isn't currently any music playing.`);
                    return await interaction.reply({ embeds: [embed], ephemeral: true });
                } 
        
                if (!queue.tracks[0]){
                    embed.setDescription(`There aren't any other songs in the queue. Use **/nowplaying** to show information about this song.`)
                    return await interaction.reply({ embeds: [embed], ephemeral: true });
                }  
        
                embed.setThumbnail(interaction.guild.iconURL({ size: 2048, dynamic: true }));
                embed.setAuthor({name: `Server Queue - ${interaction.guild.name}`});
        
                const tracks = queue.tracks.map((track, i) => `\`${i + 1}\` [${track.title}](${track.url}) by **${track.author}** (Requested by <@${track.requestedBy.id}>)`);
                const songs = queue.tracks.length;
                const nextSongs = songs > 5 ? `And **${songs - 5}** other song(s)` : `**${songs}** song(s) currently in queue.`;
                const progress = queue.createProgressBar();
        
                embed.setDescription(`**Current Song:** [${queue.current.title}](${queue.current.url}) by **${queue.current.author}**\n${progress}\n\n${tracks.slice(0, 5).join('\n')}\n\n${nextSongs}`);
                
                const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`melody_back_song_${interaction.user.id}`)
                        .setEmoji({ id: config.backEmoji.id })
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId(`melody_pause_song_${interaction.user.id}`)
                        .setEmoji({ id: config.pauseEmoji.id })
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId(`melody_skip_song_${interaction.user.id}`)
                        .setEmoji({ id: config.skipEmoji.id })
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId(`melody_stop_${interaction.user.id}`)
                        .setEmoji({ id: config.stopEmoji.id })
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId(`melody_song_lyrics_${interaction.user.id}`)
                        .setEmoji({ id: config.lyricsEmoji.id })
                        .setStyle(ButtonStyle.Secondary),
                )
        
                return await interaction.reply({ embeds: [embed], components: [row] });

            } else if (interaction.customId.startsWith("melody_stop_")){

                if (!queue || !queue.playing) {
                    embed.setDescription(`There isn't currently any music playing.`);
                    return await interaction.reply({ embeds: [embed], ephemeral: true });
                } else{
                    queue.destroy();
                    embed.setDescription(`<@${interaction.user.id}>: The music has been stopped.`);
                }
        
                return await interaction.reply({ embeds: [embed] });

            } else if (interaction.customId.startsWith("melody_song_lyrics_")){

                await interaction.deferReply({ ephemeral: true });

                await lyricsClient.search(`${queue.current.title} ${queue.current.author}`).then(x => {
                    embed.setAuthor({ name: `${x.title} - ${x.artist.name}`, url: x.url });
                    embed.setDescription(x.lyrics);
                    embed.setFooter({ text: "Courtesy of Genius" })
                }).catch(err => {
                    embed.setDescription(`I couldn't find any lyrics for this song.`);
                });

                return await interaction.editReply({ embeds: [embed] });

            }
        } else if (interaction.isSelectMenu()){

            const buttonOwner = interaction.customId.substring(interaction.customId.length - 18, interaction.customId.length);

            const embed = new EmbedBuilder();
            embed.setColor(config.embedColour);

            if (interaction.user.id != buttonOwner){
                embed.setDescription(`Only <@${buttonOwner}> can use this menu.`);
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }


            if (interaction.values[0] == "melody_help_category_general"){
                embed.setAuthor({ name: "Melody Help" });
                embed.setTitle("General Commands");
                embed.setDescription("**/help** - Shows all Melody commands available.\n**/stats** - View some Melody bot statistics.");
            } else if (interaction.values[0] == "melody_help_category_music"){
                embed.setAuthor({ name: "Melody Help" });
                embed.setTitle("Music Commands");
                embed.setDescription("**/play** - Adds a song to the end of the queue.\n**/playnext** - Adds a song to the next position in the queue.\n**/playshuffle** - Shuffles a playlist then adds all songs to the end of the queue.\n**/pause** - Pauses the current music.\n**/resume** - Unpauses the current music.\n**/stop** - Stops the current music.\n**/skip** - Skips the current music.\n**/back** - Returns to the previous music.\n**/seek** - Seeks the current song to a specified position.\n**/nowplaying** - Shows information about the current track.\n**/queue** - Shows all songs currently in the queue.\n**/clear** - Clears the queue.\n**/shuffle** - Shuffles all songs currently in the queue.\n**/loop** - Changes the loop mode for the current music.\n**/volume** - Adjusts the volume of the current music.\n**/lyrics** - Search for the lyrics to a specified song.\n**/save** - Saves the current song information to your messages.");
            } else if (interaction.values[0] == "melody_help_category_effects"){
                embed.setAuthor({ name: "Melody Help" });
                embed.setTitle("Effect Commands");
                embed.setDescription("**/8d** - Applies the 8D filter to the currrent song.\n**/bassboost** - Applies the bass boost filter to the currrent song.\n**/chorus** - Applies the chorus filter to the currrent song.\n**/compressor** - Applies the compressor filter to the currrent song.\n**/expander** - Applies the expander filter to the currrent song.\n**/flanger** - Applies the flanger filter to the currrent song.\n**/nightcore** - Applies the nightcore filter to the currrent song.\n**/normalizer** - Applies the normalizer filter to the currrent song.\n**/phaser** - Applies the phaser filter to the currrent song.\n**/reverse** - Applies the reverse filter to the currrent song.\n**/surround** - Applies the surround filter to the currrent song.\n**/vaporwave** - Applies the vaporwave filter to the currrent song.");
            }

            return await interaction.update({ embeds: [embed] });
        }
    },
};