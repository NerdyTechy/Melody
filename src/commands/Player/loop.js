const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription(
            "Allows you to change the current loop mode, or enable autoplay."
        )
        .addStringOption((option) =>
            option
                .setName("mode")
                .setDescription("Loop mode")
                .setRequired(true)
                .addChoices(
                    { name: "off", value: "off" },
                    { name: "queue", value: "queue" },
                    { name: "track", value: "track" },
                    { name: "autoplay", value: "autoplay" }
                )
        ),
    async execute(interaction, client) {
        const queue = player.getQueue(interaction.guild.id);
        const mode = interaction.options.getString("mode");

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        if (!queue || !queue.playing) {
            embed.setDescription(`There isn't currently any music to loop.`);
        } else {
            if (mode == "off") {
                const success = queue.setRepeatMode(0);
                success
                    ? embed.setDescription("Looping is now **disabled**.")
                    : embed.setDescription("Looping is already **disabled**.");
            } else if (mode == "queue") {
                const success = queue.setRepeatMode(2);
                success
                    ? embed.setDescription(
                          "The **queue** will now repeat endlessly."
                      )
                    : embed.setDescription(
                          "Looping is already set to **queue** repeat."
                      );
            } else if (mode == "track") {
                const success = queue.setRepeatMode(1);
                success
                    ? embed.setDescription(
                          "The **track** will now repeat endlessly."
                      )
                    : embed.setDescription(
                          "Looping is already set to **track** repeat."
                      );
            } else {
                const success = queue.setRepeatMode(3);
                success
                    ? embed.setDescription("The queue will now **autoplay**.")
                    : embed.setDescription(
                          "The queue is already set to **autoplay**."
                      );
            }
        }

        return await interaction.reply({ embeds: [embed] });
    },
};
