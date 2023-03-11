const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { Player } = require('discord-player');
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder().setName("skip").setDescription("Skips the current track.").setDMPermission(false),
    async execute(interaction) {
        const player = Player.singleton();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(global.config.embedColour);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("There isn't currently any music playing.");
            return await interaction.reply({ embeds: [embed] });
        }

        queue.node.skip();

        let rawdata = fs.readFileSync("src/data.json");
        var data = JSON.parse(rawdata);

        data["songs-skipped"] += 1;

        embed.setDescription(`The track **[${queue.currentTrack.title}](${queue.currentTrack.url})** was skipped.`);

        let newdata = JSON.stringify(data);
        fs.writeFileSync("src/data.json", newdata);

        return await interaction.reply({ embeds: [embed] });
    },
};
