import yaml from "js-yaml";
import fs from "fs";
import path from "path";
import logger from "./utils/logger";

interface IConfig {
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
}

let config: IConfig = {
    botToken: "",
    clientId: "",
    geniusApiKey: "",
    embedColour: "#2B2D31",
    enableAnalytics: true,
    enableAutocomplete: true,
    player: {
        leaveOnEndDelay: "5m",
        leaveOnStopDelay: "5m",
        leaveOnEmptyDelay: "5m",
        deafenBot: true,
    },
    emojis: {
        stop: "⏹",
        skip: "⏭",
        queue: "📜",
        pause: "⏯",
        lyrics: "📜",
        back: "⏮",
    },
    proxy: {
        enable: false,
        connectionUrl: "",
    },
    cookies: {
        useCustomCookie: false,
        youtubeCookie: "",
    },
    debug: false,
};

try {
    if (!fs.existsSync(path.join(__dirname, "..", "config.yml"))) {
        logger.error("Unable to find config.yml file. Please copy the default configuration into a file named config.yml in the root directory. (The same directory as package.json)");
        process.exit(1);
    }

    const configFile: any = yaml.load(fs.readFileSync(path.join(__dirname, "..", "config.yml"), "utf8"));

    config = {
        botToken: configFile.botToken ?? "",
        clientId: configFile.clientId ?? "",
        geniusApiKey: configFile.geniusApiKey ?? "",
        embedColour: configFile.embedColour ?? "#2B2D31",
        enableAnalytics: configFile.enableAnalytics ?? true,
        enableAutocomplete: configFile.enableAutocomplete ?? true,
        player: {
            leaveOnEndDelay: configFile.player.leaveOnEndDelay ?? "5m",
            leaveOnStopDelay: configFile.player.leaveOnStopDelay ?? "5m",
            leaveOnEmptyDelay: configFile.player.leaveOnEmptyDelay ?? "5m",
            deafenBot: configFile.player.deafenBot ?? true,
        },
        emojis: {
            stop: configFile.emojis.stop ?? "⏹",
            skip: configFile.emojis.skip ?? "⏭",
            queue: configFile.emojis.queue ?? "📜",
            pause: configFile.emojis.pause ?? "⏯",
            lyrics: configFile.emojis.lyrics ?? "📜",
            back: configFile.emojis.back ?? "⏮",
        },
        proxy: {
            enable: configFile.proxy.enable ?? false,
            connectionUrl: configFile.proxy.connectionUrl ?? "",
        },
        cookies: {
            useCustomCookie: configFile.cookies.useCustomCookie ?? false,
            youtubeCookie: configFile.cookies.youtubeCookie ?? "",
        },
        debug: configFile.debug ?? false,
    };
} catch (err) {
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
