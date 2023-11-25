import { ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { useMainPlayer } from "discord-player";
import config from "../../config";
import fs from "fs";
import path from "path";

export default {
    data: new SlashCommandBuilder().setName("shuffle").setDescription("Shuffles all tracks currently in the queue.").setDMPermission(false),
    async execute(interaction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour as ColorResolvable);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("There isn't currently any music playing.");
            return await interaction.reply({ embeds: [embed] });
        }

        if (!queue.tracks.toArray()[0]) {
            embed.setDescription("There aren't any other tracks in the queue. Use **/play** to add some more.");
            return await interaction.reply({ embeds: [embed] });
        }

        queue.tracks.shuffle();

        let rawdata = fs.readFileSync(path.join(__dirname, "..", "..", "..", "data.json"), "utf8");
        var data = JSON.parse(rawdata);
        data["queues-shuffled"] += 1;
        fs.writeFileSync("src/data.json", JSON.stringify(data));

        embed.setDescription(`Successfully shuffled **${queue.tracks.toArray().length} track${queue.tracks.size === 1 ? "" : "s"}**!`);
        return await interaction.reply({ embeds: [embed] });
    },
};
