const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

// TODO update this command to work with discord-player v6

module.exports = {
    data: new SlashCommandBuilder().setName("expander").setDescription("Applies the expander effect to the current music.").setDMPermission(false),
    async execute(interaction) {
        const queue = global.player.getQueue(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(global.config.embedColour);

        if (!queue || !queue.playing) {
            embed.setDescription("There isn't currently any music playing.");
        } else {
            queue.setFilters({
                expander: !queue.getFiltersEnabled().includes("expander"),
            });
            embed.setDescription(`The **expander** filter is now ${queue.getFiltersEnabled().includes("expander") ? "enabled." : "disabled."}`);
        }

        return await interaction.reply({ embeds: [embed] });
    },
};
