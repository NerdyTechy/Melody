const { EmbedBuilder } = require("discord.js");
const config = require('../../../config.json');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;
            try { await command.execute(interaction, client);
            } catch (error) { console.error(error); }
        } else if (interaction.isButton()){
            if (interaction.customId.includes("-")){
                const dashIndex = interaction.customId.indexOf("-");
                const button = client.buttons.get(interaction.customId.substring(0, dashIndex));
                if (!button) return;
                try { await button.execute(interaction, client);
                } catch (error) { console.error(error); }
            } else {
                const button = client.buttons.get(interaction.customId);
                if (!button) return;
                try { await button.execute(interaction, client);
                } catch (error) { console.error(error); }
            }
        } else if (interaction.isSelectMenu()){
            const buttonOwner = interaction.customId.substring(interaction.customId.length - 18, interaction.customId.length);

            const embed = new EmbedBuilder();
            embed.setColor(config.embedColour);

            if (interaction.user.id != buttonOwner){
                embed.setDescription(`Only <@${buttonOwner}> can use this menu.`);
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            if (interaction.values[0] == "melody_help_category_general"){
                embed.setAuthor({ name: "Melody Help" });
                embed.setTitle("General Commands");
                embed.setDescription("**/help** - Shows all Melody commands available.\n**/stats** - View some Melody bot statistics.");
            } else if (interaction.values[0] == "melody_help_category_music"){
                embed.setAuthor({ name: "Melody Help" });
                embed.setTitle("Music Commands");
                embed.setDescription("**/play** - Adds a song to the end of the queue.\n**/playnext** - Adds a song to the next position in the queue.\n**/playshuffle** - Shuffles a playlist then adds all songs to the end of the queue.\n**/pause** - Pauses the current music.\n**/resume** - Unpauses the current music.\n**/stop** - Stops the current music.\n**/skip** - Skips the current music.\n**/back** - Returns to the previous music.\n**/seek** - Seeks the current song to a specified position.\n**/nowplaying** - Shows information about the current track.\n**/queue** - Shows all songs currently in the queue.\n**/clear** - Clears the queue.\n**/shuffle** - Shuffles all songs currently in the queue.\n**/loop** - Changes the loop mode for the current music.\n**/volume** - Adjusts the volume of the current music.\n**/lyrics** - Search for the lyrics to a specified song.\n**/save** - Saves the current song information to your messages.");
            } else if (interaction.values[0] == "melody_help_category_effects"){
                embed.setAuthor({ name: "Melody Help" });
                embed.setTitle("Effect Commands");
                embed.setDescription("**/8d** - Applies the 8D filter to the currrent song.\n**/bassboost** - Applies the bass boost filter to the currrent song.\n**/chorus** - Applies the chorus filter to the currrent song.\n**/compressor** - Applies the compressor filter to the currrent song.\n**/expander** - Applies the expander filter to the currrent song.\n**/flanger** - Applies the flanger filter to the currrent song.\n**/nightcore** - Applies the nightcore filter to the currrent song.\n**/normalizer** - Applies the normalizer filter to the currrent song.\n**/phaser** - Applies the phaser filter to the currrent song.\n**/reverse** - Applies the reverse filter to the currrent song.\n**/surround** - Applies the surround filter to the currrent song.\n**/vaporwave** - Applies the vaporwave filter to the currrent song.");
            }

            return await interaction.update({ embeds: [embed] });
        }
    },
};