const { Player } = require('discord-player');
const { Client, Collection } = require('discord.js');
const fs = require('node:fs');
const config = require('../config.json');

const client = new Client({ intents: [32767] });
global.player = new Player(client);
client.commands = new Collection();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));

(async () => {
    for (file of functions){ require(`./functions/${file}`)(client); }
    client.handleCommands();
	client.handleEvents();
    client.login(config.botToken);
})();