const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { Lyrics } = require("@discord-player/extractor");

const lyricsClient = Lyrics.init(global.config.geniusKey);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lyrics")
        .setDescription("View lyrics for the specified track.")
        .addStringOption((option) => option.setName("query").setDescription("Enter a track name, artist name, or URL.").setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();

        const embed = new EmbedBuilder();
        embed.setColor(global.config.embedColour);

        await lyricsClient
            .search(interaction.options.getString("query"))
            .then((x) => {
                embed.setAuthor({
                    name: `${x.title} - ${x.artist.name}`,
                    url: x.url,
                });
                embed.setDescription(x.lyrics);
                embed.setFooter({ text: "Courtesy of Genius" });
            })
            .catch(() => {
                embed.setDescription(`I couldn't find a track with the name **${interaction.options.getString("query")}**.`);
            });

        return await interaction.editReply({
            embeds: [embed],
            ephemeral: true,
        });
    },
};
