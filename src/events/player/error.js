const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "error",
    async execute(queue, error) {
        console.error(error);

        const errEmbed = new EmbedBuilder();
        errEmbed.setDescription("An error occurred whilst attempting to perform this action. This media may not be supported.");
        errEmbed.setColor(global.config.embedColour);

        queue.metadata.channel.send({ embeds: [errEmbed] });
        return;
    },
};
