import { ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import config from "../../config";
import fs from "fs";
import path from "path";

export default {
    data: new SlashCommandBuilder().setName("stats").setDescription("Shows global Melody statistics."),
    async execute(interaction, client) {
        let rawdata = fs.readFileSync(path.join(__dirname, '..', '..', '..', 'data.json'), 'utf8');
        var data = JSON.parse(rawdata);

        const embed = new EmbedBuilder();
        embed.setDescription(`Melody is currently in **${client.guilds.cache.size} servers**, has played **${data["songs-played"]} tracks**, skipped **${data["songs-skipped"]} tracks**, and shuffled **${data["queues-shuffled"]} queues**.`);
        embed.setColor(config.embedColour as ColorResolvable);

        return await interaction.reply({ embeds: [embed] });
    },
};
