const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("clear").setDescription("Removes all tracks from the queue.").setDMPermission(false),
    async execute(interaction) {
        const queue = global.player.getQueue(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(global.config.embedColour);

        if (!queue || !queue.playing) {
            embed.setDescription("There isn't currently any music playing.");
        } else if (!queue.tracks[0]) {
            embed.setDescription("There aren't any other tracks in the queue. Use **/stop** to stop the current track.");
        } else {
            await queue.clear();
            embed.setDescription("The server queue has been cleared.");
        }

        return await interaction.reply({ embeds: [embed] });
    },
};
