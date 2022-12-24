const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("phaser").setDescription("Applies the phaser effect to the current music."),
    async execute(interaction, client) {
        const queue = player.getQueue(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        if (!queue || !queue.playing) {
            embed.setDescription("There isn't currently any music playing.");
        } else {
            queue.setFilters({
                phaser: !queue.getFiltersEnabled().includes("phaser"),
            });
            embed.setDescription(`The **phaser** filter is now ${queue.getFiltersEnabled().includes("phaser") ? "enabled." : "disabled."}`);
        }

        return await interaction.reply({ embeds: [embed] });
    },
};
