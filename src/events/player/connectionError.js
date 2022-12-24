const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "connectionError",
    async execute(queue, error, client) {
        console.log(error);

        const errEmbed = new EmbedBuilder();
        errEmbed.setDescription(`A connection error occurred whilst attempting to perform this action.`);
        errEmbed.setColor(config.embedColour);

        queue.metadata.channel.send({ embeds: [errEmbed] });
        return;
    },
};
