const { EmbedBuilder } = require("discord.js");
const { Lyrics } = require("@discord-player/extractor");
const lyricsClient = Lyrics.init(config.geniusKey);

module.exports = {
    name: "melody_song_lyrics",
    async execute(interaction, client) {
        const queue = player.getQueue(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        if (!queue || !queue.playing) {
            embed.setDescription("There isn't currently any music playing.");
            return await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        }

        await interaction.deferReply({ ephemeral: true });

        await lyricsClient
            .search(`${queue.current.title} ${queue.current.author}`)
            .then((x) => {
                embed.setAuthor({
                    name: `${x.title} - ${x.artist.name}`,
                    url: x.url,
                });
                embed.setDescription(x.lyrics);
                embed.setFooter({ text: "Courtesy of Genius" });
            })
            .catch((err) => {
                embed.setDescription(`I couldn't find any lyrics for this track.`);
            });

        return await interaction.editReply({ embeds: [embed] });
    },
};
