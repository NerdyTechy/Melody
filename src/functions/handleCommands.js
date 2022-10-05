const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const fs = require('node:fs');
const config = require('../../config.json');

const commandFiles = fs.readdirSync('src/commands').filter(file => file.endsWith('.js'));

const token = config.botToken;
const clientId = config.clientId;
const guildId = '885224887835320330';

module.exports = (client) => {
	client.handleCommands = async() => {
		client.commandArray = [];

		for (const file of commandFiles) {
			const command = require(`../commands/${file}`);
			client.commands.set(command.data.name, command);
			client.commandArray.push(command.data.toJSON());
		}

		const rest = new REST({ version: '10' }).setToken(token);

		(async () => {
			try {
				console.log('Started refreshing application (/) commands.');

				await rest.put(
					Routes.applicationGuildCommands(clientId, guildId),
					{ body: [] },
				);

				await rest.put(
					Routes.applicationCommands(clientId),
					{ body: client.commandArray },
				);

				console.log('Successfully reloaded application (/) commands.');
			} catch (error) { console.error(error); }
		})();
	};
}