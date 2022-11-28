const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const fs = require('node:fs');
const config = require('../../config.json');

const token = config.botToken;
const clientId = config.clientId;

module.exports = (client) => {
	client.handleCommands = async() => {
		client.commandArray = [];

		const commandFolders = fs.readdirSync('src/commands');

		for (folder of commandFolders){
			const commandFiles = fs.readdirSync(`src/commands/${folder}`);
			for (const file of commandFiles) {
				const command = require(`../commands/${folder}/${file}`);
				client.commands.set(command.data.name, command);
				client.commandArray.push(command.data.toJSON());
			}
		}

		const rest = new REST({ version: '10' }).setToken(token);

		(async () => {
			try {
				console.log('Started refreshing application (/) commands.');
				await rest.put(Routes.applicationCommands(clientId), { body: client.commandArray });
				console.log('Successfully reloaded application (/) commands.');
			} catch (error) { console.error(error); }
		})();
	};
}
