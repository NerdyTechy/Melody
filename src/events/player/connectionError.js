const { EmbedBuilder } = require("discord.js");
const logger = require("../../utils/logger");
const config = require("../../config");

module.exports = {
    name: "playerError",
    async execute(queue, error) {
        logger.error("A player error occurred whilst attempting to perform this action:");
        logger.error(error);

        try {
            queue.delete();
        } catch (err) {}

        const errEmbed = new EmbedBuilder();
        errEmbed.setDescription("A player error occurred whilst attempting to perform this action.");
        errEmbed.setColor(config.embedColour);

        queue.metadata.channel.send({ embeds: [errEmbed] });
        return;
    },
};
