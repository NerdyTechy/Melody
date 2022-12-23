const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");

module.exports = {
    name: "channelEmpty",
    async execute(queue) {
        const embed = new EmbedBuilder();
        embed.setDescription(
            "The music was stopped due to 5 minutes of inactivity."
        );
        embed.setColor(config.embedColour);

        queue.metadata.channel.send({ embeds: [embed] });
    },
};
