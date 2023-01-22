const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "channelEmpty",
    async execute(queue) {
        const embed = new EmbedBuilder();
        embed.setDescription("The music was stopped due to 5 minutes of inactivity.");
        embed.setColor(global.config.embedColour);

        queue.metadata.channel.send({ embeds: [embed] });
    },
};
