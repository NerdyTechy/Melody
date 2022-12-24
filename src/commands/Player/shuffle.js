const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("Shuffles all tracks currently in the queue."),
    async execute(interaction, client) {
        const queue = player.getQueue(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        if (!queue || !queue.playing) {
            embed.setDescription("There isn't currently any music playing.");
            return await interaction.reply({ embeds: [embed] });
        }

        if (!queue.tracks[0]) {
            embed.setDescription(
                `There aren't any other tracks in the queue. Use **/play** to add some more.`
            );
            return await interaction.reply({ embeds: [embed] });
        }

        await queue.shuffle();

        let rawdata = fs.readFileSync("src/data.json");
        var data = JSON.parse(rawdata);

        data["queues-shuffled"] += 1;

        let newdata = JSON.stringify(data);
        fs.writeFileSync("src/data.json", newdata);

        embed.setDescription(
            queue.tracks.length > 1
                ? `Successfully shuffled **${queue.tracks.length} tracks**!`
                : `Successfully shuffled **${queue.tracks.length} track**!`
        );
        return await interaction.reply({ embeds: [embed] });
    },
};
