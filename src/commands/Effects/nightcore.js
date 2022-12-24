const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("nightcore").setDescription("Applies the nightcore effect to the current music."),
    async execute(interaction, client) {
        const queue = player.getQueue(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        if (!queue || !queue.playing) {
            embed.setDescription("There isn't currently any music playing.");
        } else {
            queue.setFilters({
                nightcore: !queue.getFiltersEnabled().includes("nightcore"),
            });
            embed.setDescription(`The **nightcore** filter is now ${queue.getFiltersEnabled().includes("nightcore") ? "enabled." : "disabled."}`);
        }

        return await interaction.reply({ embeds: [embed] });
    },
};
