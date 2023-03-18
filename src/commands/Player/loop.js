const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { Player, QueueRepeatMode } = require('discord-player');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Allows you to change the current loop mode, or enable autoplay.")
        .setDMPermission(false)
        .addStringOption((option) => option.setName("mode").setDescription("Loop mode").setRequired(true).addChoices({ name: "off", value: "off" }, { name: "queue", value: "queue" }, { name: "track", value: "track" }, { name: "autoplay", value: "autoplay" })),
    async execute(interaction) {
        const player = Player.singleton();
        const queue = player.nodes.get(interaction.guild.id);
        const mode = interaction.options.getString("mode");

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("There isn't currently any music to loop.");
        } else {
            if (mode == "off") {
                queue.setRepeatMode(QueueRepeatMode.OFF);
                embed.setDescription("Looping is now **disabled**.");
            } else if (mode == "queue") {
                queue.setRepeatMode(QueueRepeatMode.QUEUE);
                embed.setDescription("The **queue** will now repeat endlessly.");
            } else if (mode == "track") {
                queue.setRepeatMode(QueueRepeatMode.TRACK);
                embed.setDescription("The **track** will now repeat endlessly.");
            } else {
                const success = queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
                embed.setDescription("The queue will now **autoplay**.");
            }
        }

        return await interaction.reply({ embeds: [embed] });
    },
};
