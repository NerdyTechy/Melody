const { EmbedBuilder } = require('discord.js');
const config = require('../../../config.json');

module.exports = {
    name: 'connectionError',
    async execute(queue, error, client){
        console.log(error);
    
        const errEmbed = new EmbedBuilder();
        errEmbed.setDescription(`A connection error occurred whilst attempting to perform this action.`);
        errEmbed.setColor(config.embedColour);
        
        queue.metadata.channel.send({embeds: [errEmbed]});
        
        const embed = new EmbedBuilder();
        embed.setTitle("Melody Connection Error");
        embed.setDescription(`${error}`);
        embed.addFields({ name: "Song", value: `[${queue.current.title}](${queue.current.url})` });
        
        const channel = client.channels.cache.find(channel => channel.id == '950014701901852722');
        channel.send({embeds: [embed]});
        return;
    }
};