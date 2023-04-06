process.env['DP_FORCE_YTDL_MOD'] = "play-dl";

const { Player } = require("discord-player");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("node:fs");
const logger = require("./utils/logger");
const { YouTubeExtractor, SpotifyExtractor, SoundCloudExtractor, AppleMusicExtractor, VimeoExtractor, AttachmentExtractor, ReverbnationExtractor } = require("@discord-player/extractor");
const config = require("./config");

process.on("unhandledRejection", (reason) => {
    logger.error("An unhandled rejection occurred in the main process:");
    logger.error(reason.stack ? `${reason.stack}` : `${reason}`);
});

process.on("uncaughtException", (err) => {
    logger.error("An uncaught exception occurred in the main process:");
    logger.error(err.stack ? `${err.stack}` : `${err}`);
});

process.on("uncaughtExceptionMonitor", (err) => {
    logger.error("An uncaught exception monitor occurred in the main process:");
    logger.error(err.stack ? `${err.stack}` : `${err}`);
});

process.on("beforeExit", (code) => {
    logger.error("The process is about to exit with code: " + code);
});

process.on("exit", (code) => {
    logger.error("The process exited with code: " + code);
});

if (!fs.existsSync("config.yml")) {
    logger.error("Unable to find config.yml file. Please copy the default configuration into a file named config.yml in the root directory. (The same directory as package.json)");
    process.exit(1);
}

if (!fs.existsSync("src/data.json")) {
    logger.warn("Unable to find data.json file. Creating a new one with default values.");
    fs.writeFileSync("src/data.json", JSON.stringify({ "songs-played": 0, "queues-shuffled": 0, "songs-skipped": 0 }));
}

const client = new Client({ intents: [GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.Guilds] });
const player = new Player(client, { autoRegisterExtractor: false });
player.extractors.register(YouTubeExtractor);
player.extractors.register(SpotifyExtractor);
player.extractors.register(SoundCloudExtractor);
player.extractors.register(AppleMusicExtractor);
player.extractors.register(VimeoExtractor);
player.extractors.register(ReverbnationExtractor);
player.extractors.register(AttachmentExtractor);

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
    await client.login(config.token);
    logger.success(`Logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
})();
