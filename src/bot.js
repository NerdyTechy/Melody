const { Player } = require("discord-player");
const { Client, Collection } = require("discord.js");
const fs = require("node:fs");
const yaml = require("js-yaml");
const logger = require("./utils/logger");

process.on('unhandledRejection', (reason) => {
    logger.error("An unhandled rejection occurred in the main process:");
    logger.error(reason.stack ? `${reason.stack}` : `${reason}`);
});

process.on("uncaughtException", (err) => {
    logger.error("An uncaught exception occurred in the main process:");
    logger.error(err.stack ? `${err.stack}` : `${err}`);
});

process.on('uncaughtExceptionMonitor', (err) => {
    logger.error("An uncaught exception monitor occurred in the main process:");
    logger.error(err.stack ? `${err.stack}` : `${err}`);
});

process.on('beforeExit', (code) => {
    logger.error("The process is about to exit with code: " + code);
});

process.on('exit', (code) => {
    logger.error("The process is about to exit with code: " + code);
});

if (!fs.existsSync("config.yml")) {
    return logger.error("Unable to find config.yml file. Please copy the default configuration into a file named config.yml in the root directory. (The same directory as package.json)");
}

if (!fs.existsSync("src/data.json")) {
    logger.warn("Unable to find data.json file. Creating a new one with default values.");
    fs.writeFileSync("src/data.json", JSON.stringify({ "songs-played": 0, "queues-shuffled": 0, "songs-skipped": 0 }));
}

const configFile = yaml.load(fs.readFileSync("./config.yml"));

global.config = {
    token: configFile.botToken ?? "",
    clientId: configFile.clientId ?? "",
    geniusKey: configFile.geniusApiKey ?? undefined,
    embedColour: configFile.embedColour ?? "#2F3136",
    analytics: configFile.enableAnalytics ?? true,
    stopEmoji: configFile.emojis.stop ?? "⏹",
    skipEmoji: configFile.emojis.skip ?? "⏭",
    queueEmoji: configFile.emojis.queue ?? "📜",
    pauseEmoji: configFile.emojis.pause ?? "⏯",
    lyricsEmoji: configFile.emojis.lyrics ?? "📜",
    backEmoji: configFile.emojis.back ?? "⏮",
    leaveUponSongEnd: configFile.player.leaveUponSongEnd ?? true,
    leaveUponSongStop: configFile.player.leaveUponSongStop ?? true,
    leaveOnEmptyDelay: configFile.player.leaveOnEmptyDelay ?? 300000,
    deafenBot: configFile.player.deafenBot ?? false,
};

if (!global.config.token || global.config.token === "") return logger.error("Please supply a bot token in your configuration file.");
if (!global.config.clientId || global.config.clientId === "") return logger.error("Please supply a client ID in your configuration file.");
if (global.config.geniusKey === "") global.config.geniusKey = undefined;

if (typeof global.config.geniusKey === "undefined"){
    logger.warn("No Genius API key was provided. The lyrics functions will not be as reliable.");
}

const client = new Client({ intents: [32767] });
global.player = new Player(client);
client.commands = new Collection();
client.buttons = new Collection();

const functions = fs.readdirSync("./src/functions").filter((file) => file.endsWith(".js"));

(async () => {
    logger.info("Initialising Melody...");
    for (var file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleCommands();
    client.handleEvents();
    client.handleButtons();
    logger.info("Logging into Discord client...");
    await client.login(global.config.token);
    logger.success(`Logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
})();
