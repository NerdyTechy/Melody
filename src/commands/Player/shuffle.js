const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { Player } = require("discord-player");
const config = require("../../config");
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder().setName("shuffle").setDescription("Shuffles all tracks currently in the queue.").setDMPermission(false),
    async execute(interaction) {
        const player = Player.singleton();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("There isn't currently any music playing.");
            return await interaction.reply({ embeds: [embed] });
        }

        if (!queue.tracks.toArray()[0]) {
            embed.setDescription("There aren't any other tracks in the queue. Use **/play** to add some more.");
            return await interaction.reply({ embeds: [embed] });
        }

        queue.tracks.shuffle();

        let rawdata = fs.readFileSync("src/data.json");
        var data = JSON.parse(rawdata);

        data["queues-shuffled"] += 1;

        let newdata = JSON.stringify(data);
        fs.writeFileSync("src/data.json", newdata);

        embed.setDescription(queue.tracks.length === 1 ? `Successfully shuffled **${queue.tracks.toArray().length} track**!` : `Successfully shuffled **${queue.tracks.toArray().length} tracks**!`);
        return await interaction.reply({ embeds: [embed] });
    },
};
