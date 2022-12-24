const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("8d")
        .setDescription("Applies the 8D effect to the current music."),
    async execute(interaction, client) {
        const queue = player.getQueue(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        if (!queue || !queue.playing) {
            embed.setDescription("There isn't currently any music playing.");
        } else {
            queue.setFilters({
                "8D": !queue.getFiltersEnabled().includes("8D"),
            });
            embed.setDescription(
                `The **8D** filter is now ${
                    queue.getFiltersEnabled().includes("8D")
                        ? "enabled."
                        : "disabled."
                }`
            );
        }

        return await interaction.reply({ embeds: [embed] });
    },
};
