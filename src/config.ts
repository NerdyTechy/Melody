import yaml from "js-yaml";
import fs from "fs";
import path from "path";
import logger from "./utils/logger";

let config: Partial<{
    botToken: string;
    clientId: string;
    geniusApiKey: string;
    embedColour: string;
    enableAnalytics: boolean;
    enableAutocomplete: boolean;
    player: {
        leaveOnEndDelay: string;
        leaveOnStopDelay: string;
        leaveOnEmptyDelay: string;
        deafenBot: boolean;
        defaultVolume: number;
    };
    emojis: {
        stop: string;
        skip: string;
        queue: string;
        pause: string;
        lyrics: string;
        back: string;
    };
    proxy: {
        enable: boolean;
        connectionUrl: string;
    };
    cookies: {
        useCustomCookie: boolean;
        youtubeCookie: string;
    };
    debug: boolean;
}> = {};

try {
    if (!fs.existsSync(path.join(__dirname, "..", "config.yml"))) {
        logger.error("Unable to find config.yml file. Please copy the default configuration into a file named config.yml in the root directory. (The same directory as package.json)");
        process.exit(1);
    }

    config = yaml.load(fs.readFileSync(path.join(__dirname, "..", "config.yml"), "utf8"));
} catch (err) {
    logger.debug(err);
    logger.error("Unable to parse config.yml. Please make sure it is valid YAML.");
    process.exit(1);
}

if (!config.botToken || config.botToken === "") {
    logger.error("Please supply a bot token in your configuration file.");
    process.exit(1);
}

if (!config.clientId || config.clientId === "") {
    logger.error("Please supply a client ID in your configuration file.");
    process.exit(1);
}

export default config;
