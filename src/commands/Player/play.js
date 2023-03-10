const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { Player } = require("discord-player");
const logger = require("../../utils/logger");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Adds a track to the end of the server queue.")
        .setDMPermission(false)
        .addStringOption((option) => option.setName("query").setDescription("Enter a track name, artist name, or URL.").setRequired(true)),
    async execute(interaction, client) {
        await interaction.deferReply();

        const embed = new EmbedBuilder();
        embed.setColor(global.config.embedColour);

        const channel = interaction.member.voice.channel;

        if (!channel) {
            embed.setDescription("You aren't currently in a voice channel.");
            return await interaction.editReply({ embeds: [embed] });
        }

        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            embed.setDescription("I can't play music in that voice channel.");
            return await interaction.editReply({ embeds: [embed] });
        }

        const query = interaction.options.getString("query");

        const player = Player.singleton(client);
        let queue = player.nodes.get(interaction.guild.id);

        if (!queue) {
            player.nodes.create(interaction.guild.id, {
                leaveOnEnd: true,
                leaveOnStop: true,
                leaveOnEmpty: true,
                leaveOnEmptyCooldown: 30000,
                leaveOnEndCooldown: 30000,
                leaveOnStopCooldown: 30000,
                selfDeaf: false,
                metadata: {
                    channel: interaction.channel,
                    client: interaction.guild.members.me,
                    requestedBy: interaction.user
                }
            });
        }

        queue = player.nodes.get(interaction.guild.id);

        try {
            const res = await player.search(query, {
                requestedBy: interaction.user,
            });

            if (!res || !res.tracks || res.tracks.length === 0) {
                if (queue) queue.delete();
                embed.setDescription(`I couldn't find anything with the name **${query}**.`);
                return await interaction.editReply({ embeds: [embed] });
            }

            try {
                if (!queue.connection) await queue.connect(interaction.member.voice.channel);
            } catch (err) {
                console.log(err);
                if (queue) queue.delete();
                embed.setDescription("I can't join that voice channel.");
                return await interaction.editReply({ embeds: [embed] });
            }

            try {
                res.playlist ? queue.addTrack(res.tracks) : queue.addTrack(res.tracks[0]);
                if (!queue.isPlaying()) await queue.node.play(queue.tracks[0]);
            } catch (err) {
                logger.error("An error occurred whilst attempting to play this media:");
                logger.error(err);

                await queue.delete();

                embed.setDescription("This media doesn't seem to be working right now, please try again later.");
                return await interaction.followUp({ embeds: [embed] });
            }

            if (!res.playlist) {
                embed.setDescription(`Loaded **[${res.tracks[0].title}](${res.tracks[0].url})** by **${res.tracks[0].author}** into the server queue.`);
            } else {
                embed.setDescription(`**${res.tracks.length} tracks** from the ${res.playlist.type} **[${res.playlist.title}](${res.playlist.url})** have been loaded into the server queue.`);
            }
        } catch (err) {
            logger.error(err);
            return interaction.editReply({ content: `An error occurred whilst attempting to play this media.` });
        }

        return await interaction.editReply({ embeds: [embed] });
    },
};
