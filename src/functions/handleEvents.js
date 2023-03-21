const fs = require("node:fs");
const path = require("node:path");
const { Player } = require("discord-player");

module.exports = (client) => {
    client.handleEvents = async () => {
        const botEventsPath = path.join(__dirname, "../events/bot");
        const botEventFiles = fs.readdirSync(botEventsPath).filter((file) => file.endsWith(".js"));

        for (const file of botEventFiles) {
            const filePath = path.join(botEventsPath, file);
            const event = require(filePath);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }

        const playerEventsPath = path.join(__dirname, "../events/player");
        const playerEventFiles = fs.readdirSync(playerEventsPath).filter((file) => file.endsWith(".js"));

        const player = Player.singleton();

        for (const file of playerEventFiles) {
            const filePath = path.join(playerEventsPath, file);
            const event = require(filePath);
            player.events.on(event.name, (...args) => event.execute(...args, client));
        }
    };
};
