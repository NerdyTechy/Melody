const { EmbedBuilder } = require('discord.js');
const config = require('../../../config.json');

module.exports = {
    name: 'error',
    async execute(queue, error, client){
        console.error(error);
    
        const errEmbed = new EmbedBuilder();
        errEmbed.setDescription(`An error occurred whilst attempting to perform this action. This media may not be supported.`);
        errEmbed.setColor(config.embedColour);
        
        queue.metadata.channel.send({embeds: [errEmbed]});
        
        const embed = new EmbedBuilder();
        embed.setTitle("Melody Player Error");
        embed.setDescription(`${error}`);
        
        const channel = client.channels.cache.find(channel => channel.id == '950014701901852722');
        channel.send({embeds: [embed]});
        return;
    }
};