const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { PlayerError } = require("discord-player");
const fs = require("node:fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("playshuffle")
        .setDescription("Plays the specified playlist with a random track order.")
        .addStringOption((option) => option.setName("playlist").setDescription("Enter a playlist URL here to playshuffle.").setRequired(true)),
    async execute(interaction, client) {
        await interaction.deferReply();

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        if (!interaction.member.voice.channelId) {
            embed.setDescription("You aren't currently in a voice channel.");
            return await interaction.editReply({ embeds: [embed] });
        }

        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            embed.setDescription("I can't play music in that voice channel.");
            return await interaction.editReply({ embeds: [embed] });
        }

        const query = interaction.options.getString("playlist");
        const queue = player.createQueue(interaction.guild, {
            leaveOnEnd: true,
            leaveOnStop: true,
            leaveOnEmpty: true,
            leaveOnEmptyCooldown: 300000,
            autoSelfDeaf: false,
            spotifyBridge: true,
            ytdlOptions: {
                filter: "audioonly",
                opusEncoded: true,
                quality: "highestaudio",
                highWaterMark: 1 << 30,
            },
            metadata: {
                channel: interaction.channel,
            },
        });

        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch (err) {
            await queue.destroy();
            embed.setDescription("I can't join that voice channel.");
            return await interaction.editReply({ embeds: [embed] });
        }

        const res = await player.search(query, {
            requestedBy: interaction.user,
        });

        if (!res) {
            embed.setDescription(`I couldn't find a playlist with the name **${query}**`);
            await queue.destroy();
            return await interaction.editReply({ embeds: [embed] });
        }

        if (!res.playlist) {
            embed.setDescription(`The query specified doesn't appear to be a playlist.`);
            await queue.destroy();
            return await interaction.editReply({ embeds: [embed] });
        }

        try {
            queue.addTracks(res.tracks);
            await queue.shuffle();
            if (!queue.playing) await queue.play();
        } catch (err) {
            if (err instanceof PlayerError) {
                if (err.statusCode == "InvalidTrack") {
                    embed.setDescription(`I couldn't find a playlist with the name **${query}**.`);
                    await queue.destroy();
                    return await interaction.editReply({ embeds: [embed] });
                }
            }

            console.error(err);

            await queue.destroy();
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
