const { EmbedBuilder } = require("discord.js");
const logger = require("../../utils/logger");

module.exports = {
    name: "connectionError",
    async execute(queue, error) {
        logger.error("A connection error occurred whilst attempting to perform this action:");
        logger.error(error);

        const errEmbed = new EmbedBuilder();
        errEmbed.setDescription("A connection error occurred whilst attempting to perform this action.");
        errEmbed.setColor(global.config.embedColour);

        queue.metadata.channel.send({ embeds: [errEmbed] });
        return;
    },
};
