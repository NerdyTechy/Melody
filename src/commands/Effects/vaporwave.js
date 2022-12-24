const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("vaporwave")
        .setDescription("Applies the vaporwave effect to the current music."),
    async execute(interaction, client) {
        const queue = player.getQueue(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        if (!queue || !queue.playing) {
            embed.setDescription("There isn't currently any music playing.");
        } else {
            queue.setFilters({
                vaporwave: !queue.getFiltersEnabled().includes("vaporwave"),
            });
            embed.setDescription(
                `The **vaporwave** filter is now ${
                    queue.getFiltersEnabled().includes("vaporwave")
                        ? "enabled."
                        : "disabled."
                }`
            );
        }

        return await interaction.reply({ embeds: [embed] });
    },
};
