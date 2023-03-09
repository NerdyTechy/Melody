const { EmbedBuilder } = require("discord.js");

// TODO check event exists in discord-player v6

module.exports = {
    name: "channelEmpty",
    async execute(queue) {
        const embed = new EmbedBuilder();
        embed.setDescription("The music was stopped due to 5 minutes of inactivity.");
        embed.setColor(global.config.embedColour);

        queue.metadata.channel.send({ embeds: [embed] });
    },
};
