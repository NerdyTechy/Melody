const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { Lyrics } = require('@discord-player/extractor');
const config = require('../../config.json');

const lyricsClient = Lyrics.init(config.geniusApiKey);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lyrics')
        .setDescription('View lyrics for the specified song.')
        .addStringOption(option => option.setName("query").setDescription("Enter a song name, artist name, or URL.").setRequired(true)),
    async execute(interaction, client){
        await interaction.deferReply();
        
        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour);

        await lyricsClient.search(interaction.options.getString("query")).then(x => {
            embed.setAuthor({ name: `${x.title} - ${x.artist.name}`, url: x.url });
            embed.setDescription(x.lyrics);
            embed.setFooter({ text: "Courtesy of Genius" })
        }).catch(err => {
            embed.setDescription(`I couldn't find a track with the name **${interaction.options.getString("query")}**.`);
        });

        return await interaction.editReply({ embeds: [embed], ephemeral: true });
    },
};