import { ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { useMainPlayer } from "discord-player";
import config from "../../config";

export default {
    data: new SlashCommandBuilder().setName("effects").setDescription("Lists all effects that are currently enabled.").setDMPermission(false),
    async execute(interaction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour as ColorResolvable);

        if (queue.filters.ffmpeg.filters.length === 0) {
            embed.setDescription("There aren't currently any effects enabled.");
        } else {
            embed.setDescription(`**The following effects are currently enabled:** ${queue.filters.ffmpeg.filters.join(", ").replace("surrounding", "surround")}`);
        }

        return await interaction.reply({ embeds: [embed] });
    },
};
