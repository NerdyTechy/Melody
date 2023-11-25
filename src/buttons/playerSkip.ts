import { ColorResolvable, EmbedBuilder } from "discord.js";
import { useMainPlayer } from "discord-player";
import fs from "fs";
import path from "path";
import config from "../config";

export default {
    name: "playerSkip",
    async execute(interaction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour as ColorResolvable);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("There isn't currently any music playing.");
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        queue.node.skip();

        let rawdata = fs.readFileSync(path.join(__dirname, "..", "..", "data.json"), "utf8");
        var data = JSON.parse(rawdata);
        data["songs-skipped"] += 1;
        fs.writeFileSync("src/data.json", JSON.stringify(data));

        embed.setDescription(`<@${interaction.user.id}>: The track **[${queue.currentTrack.title}](${queue.currentTrack.url})** was skipped.`);
        return await interaction.reply({ embeds: [embed] });
    },
};
