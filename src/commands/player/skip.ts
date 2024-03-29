import { ChatInputCommandInteraction, ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { useMainPlayer } from "discord-player";
import config from "../../config";
import fs from "fs";
import path from "path";

export default {
    data: new SlashCommandBuilder().setName("skip").setDescription("Skips the current track.").setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour as ColorResolvable);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("There isn't currently any music playing.");
            return await interaction.reply({ embeds: [embed] });
        }

        queue.node.skip();

        const rawdata = fs.readFileSync(path.join(__dirname, "..", "..", "..", "data.json"), "utf8");
        const data = JSON.parse(rawdata);
        data["songs-skipped"] += 1;
        fs.writeFileSync(path.join(__dirname, "..", "..", "..", "data.json"), JSON.stringify(data));

        embed.setDescription(`The track **[${queue.currentTrack.title}](${queue.currentTrack.url})** was skipped.`);

        return await interaction.reply({ embeds: [embed] });
    },
};
