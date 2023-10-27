import { EmbedBuilder, ButtonStyle, SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ColorResolvable } from "discord.js";
import config from "../../config";

export default {
    data: new SlashCommandBuilder().setName("botinfo").setDescription("Shows information about the Melody bot."),
    async execute(interaction) {
        const embed = new EmbedBuilder();
        embed.setDescription("Melody is an open source Discord music bot that can be self-hosted to allow users to listen to music, videos, and livestreams in a voice channel together.");
        embed.setColor(config.embedColour as ColorResolvable);

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel("GitHub")
                    .setURL("https://github.com/NerdyTechy/Melody"),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel("Contributors")
                    .setURL("https://github.com/NerdyTechy/Melody/graphs/contributors"),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel("Support")
                    .setURL("https://github.com/NerdyTechy/Melody/discussions"),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel("Report Issue")
                    .setURL("https://github.com/NerdyTechy/Melody/issues/new/choose")
            );

        return await interaction.reply({ embeds: [embed], components: [row] });
    },
};
