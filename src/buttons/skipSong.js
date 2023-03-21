const { EmbedBuilder } = require("discord.js");
const fs = require("node:fs");
const { Player } = require("discord-player");
const config = require("../config");

module.exports = {
    name: "melody_skip_song",
    async execute(interaction) {
        const player = Player.singleton();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("There isn't currently any music playing.");
            return await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        }

        queue.node.skip();

        let rawdata = fs.readFileSync("src/data.json");
        var data = JSON.parse(rawdata);

        data["songs-skipped"] += 1;

        embed.setDescription(`<@${interaction.user.id}>: The track **[${queue.currentTrack.title}](${queue.currentTrack.url})** was skipped.`);

        let newdata = JSON.stringify(data);
        fs.writeFileSync("src/data.json", newdata);

        return await interaction.reply({ embeds: [embed] });
    },
};
