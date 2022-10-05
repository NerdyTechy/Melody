const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows all Melody commands available.'),
    async execute(interaction, client){
        const embed = new EmbedBuilder();
        embed.setTitle("Melody Help");
        embed.setDescription("Thank you for using **Melody**! To view all available commands, choose a category from the select menu below.");
        embed.setColor(config.embedColour);

        const row = new ActionRowBuilder()
        .addComponents(
            new SelectMenuBuilder()
                .setCustomId(`melody_help_category_select_${interaction.user.id}`)
                .setPlaceholder(`Select a category to view commands.`)
                .addOptions(
                    {
                        label: 'General',
                        description: 'Commands available in Melody that do not relate to music.',
                        value: 'melody_help_category_general'
                    },
                    {
                        label: 'Music Controls',
                        description: 'Commands that are used to control the music being played.',
                        value: 'melody_help_category_music'
                    },
                    {
                        label: 'Effects',
                        description: 'Commands that control the effects currently applied to music.',
                        value: 'melody_help_category_effects'
                    }
                )
        )
        
        //embed.addFields(
        //   { name: "General", value: "**/help** - Shows all Melody commands available.\n**/stats** - View some Melody bot statistics." },
        //   { name: "Music", value: "**/play** - Adds a song to the queue.\n**/pause** - Pauses the current music.\n**/resume** - Unpauses the current music.\n**/stop** - Stops the current music.\n**/skip** - Skips the current music.\n**/back** - Returns to the previous music.\n**/nowplaying** - Shows information about the current track.\n**/trackinfo** - Shows additional information about the current track.\n**/queue** - Shows all songs currently in the queue.\n**/clear** - Clears the queue.\n**/shuffle** - Shuffles all songs currently in the queue.\n**/loop** - Loops the current music.\n**/volume** - Adjusts the volume of the current music." },
        //   { name: "Effects", value: "**/bassboost** - Applies a bass boost filter to the currrent song." }
        //);

        interaction.reply({ embeds: [embed], components: [row] });
    },
};