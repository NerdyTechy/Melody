const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { Player } = require("discord-player");
const fs = require("node:fs");
const logger = require("../../utils/logger");
const config = require("../../config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("playshuffle")
        .setDescription("Plays the specified playlist with a random track order.")
        .setDMPermission(false)
        .addStringOption((option) => option.setName("playlist").setDescription("Enter a playlist URL here to playshuffle.").setRequired(true)),
    async execute(interaction, client) {
        await interaction.deferReply();

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        const channel = interaction.member.voice.channel;

        if (!channel) {
            embed.setDescription("You aren't currently in a voice channel.");
            return await interaction.editReply({ embeds: [embed] });
        }

        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            embed.setDescription("I can't play music in that voice channel.");
            return await interaction.editReply({ embeds: [embed] });
        }

        const query = interaction.options.getString("playlist");

        const player = Player.singleton(client);
        let queue = player.nodes.get(interaction.guild.id);

        if (!queue) {
            player.nodes.create(interaction.guild.id, {
                leaveOnEmptyCooldown: config.leaveOnEmptyDelay,
                leaveOnEndCooldown: config.leaveOnEndCooldown,
                leaveOnStopCooldown: config.leaveOnStopCooldown,
                selfDeaf: config.deafenBot,
                metadata: {
                    channel: interaction.channel,
                    client: interaction.guild.members.me,
                    requestedBy: interaction.user,
                },
            });
        }

        queue = player.nodes.get(interaction.guild.id);

        const res = await player.search(query, {
            requestedBy: interaction.user,
        });

        if (!res) {
            embed.setDescription(`I couldn't find a playlist with the name **${query}**`);
            await queue.delete();
            return await interaction.editReply({ embeds: [embed] });
        }

        if (!res.playlist) {
            embed.setDescription("The query specified doesn't appear to be a playlist.");
            await queue.delete();
            return await interaction.editReply({ embeds: [embed] });
        }

        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch (err) {
            if (queue) queue.delete();
            embed.setDescription("I can't join that voice channel.");
            return await interaction.editReply({ embeds: [embed] });
        }

        try {
            queue.addTrack(res.tracks);
            await queue.tracks.shuffle();
            if (!queue.isPlaying()) await queue.node.play(queue.tracks[0]);
        } catch (err) {
            logger.error("An error occurred whilst attempting to play this media:");
            logger.error(err);

            await queue.delete();

            embed.setDescription("This media doesn't seem to be working right now, please try again later.");
            return await interaction.followUp({ embeds: [embed] });
        }

        const data = fs.readFileSync("src/data.json");
        const parsed = JSON.parse(data);

        parsed["queues-shuffled"] += 1;

        fs.writeFileSync("src/data.json", JSON.stringify(parsed));

        embed.setDescription(`**${res.tracks.length} tracks** from the ${res.playlist.type} **[${res.playlist.title}](${res.playlist.url})** have been loaded into the server queue.`);

        return await interaction.editReply({ embeds: [embed] });
    },
};
