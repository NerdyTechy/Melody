const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const config = require('../../config');
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder().setName("stats").setDescription("Shows global Melody statistics."),
    async execute(interaction, client) {
        let rawdata = fs.readFileSync("src/data.json");
        var data = JSON.parse(rawdata);

        const embed = new EmbedBuilder();
        embed.setDescription(`Melody is currently in **${client.guilds.cache.size} servers**, has played **${data["songs-played"]} tracks**, skipped **${data["songs-skipped"]} tracks**, and shuffled **${data["queues-shuffled"]} queues**.`);
        embed.setColor(config.embedColour);

        return await interaction.reply({ embeds: [embed] });
    },
};
