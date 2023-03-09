const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

// TODO update this command to work with discord-player v6

module.exports = {
    data: new SlashCommandBuilder().setName("vaporwave").setDescription("Applies the vaporwave effect to the current music.").setDMPermission(false),
    async execute(interaction) {
        const queue = global.player.getQueue(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(global.config.embedColour);

        if (!queue || !queue.playing) {
            embed.setDescription("There isn't currently any music playing.");
        } else {
            queue.setFilters({
                vaporwave: !queue.getFiltersEnabled().includes("vaporwave"),
            });
            embed.setDescription(`The **vaporwave** filter is now ${queue.getFiltersEnabled().includes("vaporwave") ? "enabled." : "disabled."}`);
        }

        return await interaction.reply({ embeds: [embed] });
    },
};
