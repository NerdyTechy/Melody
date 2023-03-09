const { EmbedBuilder } = require("discord.js");
const logger = require("../../utils/logger");

// TODO check event exists in discord-player v6

module.exports = {
    name: "error",
    async execute(queue, error) {
        logger.error("An unhandled player error occurred during runtime:");
        logger.error(error);

        const errEmbed = new EmbedBuilder();
        errEmbed.setDescription("An error occurred whilst attempting to perform this action. This media may not be supported.");
        errEmbed.setColor(global.config.embedColour);

        queue.metadata.channel.send({ embeds: [errEmbed] });
        return;
    },
};
