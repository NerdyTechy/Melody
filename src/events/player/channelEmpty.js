const { EmbedBuilder } = require("discord.js");

// TODO make the embed description update with the config value

module.exports = {
    name: "emptyChannel",
    async execute(queue) {
        try { queue.delete(); } catch(err) {}
        const embed = new EmbedBuilder();
        embed.setDescription("The music was stopped due to 5 minutes of inactivity.");
        embed.setColor(global.config.embedColour);

        queue.metadata.channel.send({ embeds: [embed] });
    },
};
