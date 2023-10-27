import { ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { useMainPlayer, QueueRepeatMode } from "discord-player";
import config from "../../config";

export default {
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Allows you to change the current loop mode, or enable autoplay.")
        .setDMPermission(false)
        .addStringOption((option) => option.setName("mode").setDescription("Loop mode").setRequired(true).addChoices({ name: "off", value: "off" }, { name: "queue", value: "queue" }, { name: "track", value: "track" }, { name: "autoplay", value: "autoplay" })),
    async execute(interaction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour as ColorResolvable);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("There isn't currently any music to loop.");
        } else {
            switch (String(interaction.options.getString("mode")).toLowerCase()) {
                case "off":
                    queue.setRepeatMode(QueueRepeatMode.OFF);
                    embed.setDescription("Looping is now **disabled**.");
                    break;
                case "queue":
                    queue.setRepeatMode(QueueRepeatMode.QUEUE);
                    embed.setDescription("The **queue** will now repeat endlessly.");
                    break;
                case "track":
                    queue.setRepeatMode(QueueRepeatMode.TRACK)
                    embed.setDescription("The **track** will now repeat endlessly.");
                    break;
                case "autoplay":
                    queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
                    embed.setDescription("The queue will now **autoplay**.");
                    break;
            }
        }

        return await interaction.reply({ embeds: [embed] });
    },
};
