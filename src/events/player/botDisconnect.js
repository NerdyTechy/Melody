const { EmbedBuilder } = require("discord.js");

// TODO check event exists in discord-player v6

module.exports = {
    name: "botDisconnect",
    async execute(queue) {
        const embed = new EmbedBuilder();
        embed.setDescription("The music was stopped because I was disconnected from the channel.");
        embed.setColor(global.config.embedColour);

        queue.metadata.channel.send({ embeds: [embed] });
    },
};
