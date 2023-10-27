import { ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { lyricsExtractor } from "@discord-player/extractor";
import config from "../../config";

const lyricsClient = lyricsExtractor(config.geniusApiKey);

export default {
    data: new SlashCommandBuilder()
        .setName("lyrics")
        .setDescription("View lyrics for the specified track.")
        .addStringOption((option) => option.setName("query").setDescription("Enter a track name, artist name, or URL.").setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour as ColorResolvable);

        await lyricsClient
            .search(interaction.options.getString("query"))
            .then((res) => {
                embed.setAuthor({
                    name: `${res.title} - ${res.artist.name}`,
                    url: res.url,
                });
                embed.setDescription(res.lyrics.length > 4096 ? `[Click here to view lyrics](${res.url})` : res.lyrics);
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
