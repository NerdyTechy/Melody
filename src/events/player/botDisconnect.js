const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "botDisconnect",
    async execute(queue) {
        const embed = new EmbedBuilder();
        embed.setDescription("The music was stopped because I was disconnected from the channel.");
        embed.setColor(global.config.embedColour);

        queue.metadata.channel.send({ embeds: [embed] });
    },
};
