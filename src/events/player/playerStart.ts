import config from "../../config";
import { ColorResolvable, EmbedBuilder } from "discord.js";
import fs from "fs";
import path from "path";

export default {
    name: "playerStart",
    once: true,
    async execute(queue, track) {
        const embed = new EmbedBuilder();

        const data = fs.readFileSync(path.join(__dirname, "..", "..", "..", "data.json"), "utf8");
        const parsed = JSON.parse(data);

        parsed["songs-played"] += 1;

        fs.writeFileSync(path.join(__dirname, "..", "..", "..", "data.json"), JSON.stringify(parsed));

        embed.setDescription(`Now playing **[${track.title}](${track.url})** by **${track.author}**.`);
        embed.setColor(config.embedColour as ColorResolvable);
        queue.metadata.channel.send({ embeds: [embed] });
    },
};
