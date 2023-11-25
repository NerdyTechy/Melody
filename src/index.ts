process.env["DP_FORCE_YTDL_MOD"] = "play-dl";

import { Client, Collection, GatewayIntentBits } from "discord.js";
import { Player } from "discord-player";
import { YouTubeExtractor, SpotifyExtractor, SoundCloudExtractor, AppleMusicExtractor, VimeoExtractor, AttachmentExtractor, ReverbnationExtractor } from "@discord-player/extractor";
import { HttpsProxyAgent } from "https-proxy-agent";
import fs from "fs";
import path from "path";
import logger from "./utils/logger";
import config from "./config";
import registerProcessEvents from "./utils/processEvents";
import handleButtons from "./functions/handleButtons";
import handleCommands from "./functions/handleCommands";
import handleEvents from "./functions/handleEvents";
import handleMenus from "./functions/handleMenus";

registerProcessEvents();

if (!fs.existsSync(path.join(__dirname, "..", "data.json"))) {
    logger.warn("Unable to find data.json file. Creating a new one with default values.");
    fs.writeFileSync(path.join(__dirname, "..", "data.json"), JSON.stringify({ "songs-played": 0, "queues-shuffled": 0, "songs-skipped": 0 }));
}

let proxy: string = "";
let agent: any = null;

if (config.proxy.enable) {
    proxy = config.proxy.connectionUrl;
    agent = new HttpsProxyAgent(proxy);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates] });
const player = new Player(client, { ytdlOptions: { requestOptions: { agent, headers: { cookie: config.cookies.useCustomCookie ? config.cookies.youtubeCookie : null } } } });
player.extractors.unregisterAll();
player.extractors.register(YouTubeExtractor, {});
player.extractors.register(SpotifyExtractor, {});
player.extractors.register(SoundCloudExtractor, {});
player.extractors.register(AppleMusicExtractor, {});
player.extractors.register(VimeoExtractor, {});
player.extractors.register(ReverbnationExtractor, {});
player.extractors.register(AttachmentExtractor, {});

// @ts-expect-error - Type declarations not defined for this object
client.commands = new Collection();
// @ts-expect-error - Type declarations not defined for this object
client.buttons = new Collection();
// @ts-expect-error - Type declarations not defined for this object
client.menus = new Collection();

(async () => {
    logger.info("Initialising Melody...");

    handleButtons(client);
    handleCommands(client);
    handleEvents(client);
    handleMenus(client);

    logger.info("Logging into Discord client...");
    client
        .login(config.botToken)
        .then(() => {
            if (client && client.user) logger.success(`Logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
        })
        .catch((error) => {
            if (error.code === "DisallowedIntents") {
                logger.error("Please enable the correct intents in your Discord developer portal.");
            } else {
                logger.error("An error occurred whilst attempting to log into the Discord client:");
                logger.error(String(error));
            }

            process.exit(1);
        });
})();
