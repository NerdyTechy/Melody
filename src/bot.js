const { Player } = require('discord-player');
const { Client, Collection } = require('discord.js');
const fs = require('node:fs');

if (!fs.existsSync("config.json")){
    return console.error("[Aborted] Unable to find config.json file. Please copy the default configuration into a file named config.json in the root directory. (The same directory as package.json)");
}

const data = {"songs-played":0,"queues-shuffled":0,"songs-skipped":0};
fs.writeFileSync("src/data.json", JSON.stringify(data));

const config = require('../config.json');

if (!config.botToken || config.botToken == "DISCORD-BOT-TOKEN"){ return console.error("[Aborted] Please set a bot token in the configuration file."); }
if (!config.clientId || config.clientId == "DISCORD-BOT-ID"){ return console.error("[Aborted] Please set the client ID of your bot in the configuration file."); }
if (!config.geniusApiKey || config.geniusApiKey == "GENIUS-API-KEY"){ return console.error("[Aborted] Please set a Genius API key in the configuration file."); }

const client = new Client({ intents: [32767] });
global.player = new Player(client);
client.commands = new Collection();
client.buttons = new Collection();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));

(async () => {
    for (file of functions){ require(`./functions/${file}`)(client); }
    client.handleCommands();
	client.handleEvents();
    client.login(config.botToken);
})();