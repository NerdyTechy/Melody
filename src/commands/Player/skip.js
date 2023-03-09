const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");

// TODO update this command to work with discord-player v6

module.exports = {
    data: new SlashCommandBuilder().setName("skip").setDescription("Skips the current track.").setDMPermission(false),
    async execute(interaction) {
        const queue = global.player.getQueue(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(global.config.embedColour);

        if (!queue || !queue.playing) {
            embed.setDescription("There isn't currently any music playing.");
            return await interaction.reply({ embeds: [embed] });
        }

        queue.skip();

        let rawdata = fs.readFileSync("src/data.json");
        var data = JSON.parse(rawdata);

        data["songs-skipped"] += 1;

        embed.setDescription(`The track **[${queue.current.title}](${queue.current.url})** was skipped.`);

        let newdata = JSON.stringify(data);
        fs.writeFileSync("src/data.json", newdata);

        return await interaction.reply({ embeds: [embed] });
    },
};
