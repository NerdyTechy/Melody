const { EmbedBuilder } = require("discord.js");
const logger = require("../../utils/logger");

module.exports = {
    name: "playerError",
    async execute(queue, error) {
        logger.error("A player error occurred whilst attempting to perform this action:");
        logger.error(error);

        if (queue) queue.delete();

        const errEmbed = new EmbedBuilder();
        errEmbed.setDescription("A player error occurred whilst attempting to perform this action.");
        errEmbed.setColor(global.config.embedColour);

        queue.metadata.channel.send({ embeds: [errEmbed] });
        return;
    },
};
