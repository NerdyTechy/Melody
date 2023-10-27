import { ColorResolvable, EmbedBuilder } from "discord.js";
import { useMainPlayer } from "discord-player";
import { lyricsExtractor } from "@discord-player/extractor";
import config from "../config";

const lyricsClient = lyricsExtractor(config.geniusApiKey);

export default {
    name: "lyrics",
    async execute(interaction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour as ColorResolvable);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("There isn't currently any music playing.");
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: true });

        await lyricsClient
            .search(`${queue.currentTrack.title} ${queue.currentTrack.author}`)
            .then((res) => {
                embed.setAuthor({
                    name: `${res.title} - ${res.artist.name}`,
                    url: res.url,
                });
                embed.setDescription(res.lyrics.length > 4000 ? `[Click here to view lyrics](${res.url})` : res.lyrics);
                embed.setFooter({ text: "Courtesy of Genius" });
            })
            .catch(() => {
                embed.setDescription("I couldn't find any lyrics for this track.");
            });

        return await interaction.editReply({ embeds: [embed] });
    },
};
