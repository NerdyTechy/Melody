const fs = require("node:fs");

module.exports = (client) => {
    client.handleButtons = async () => {
        const buttonFiles = fs.readdirSync("src/buttons").filter((file) => file.endsWith(".js"));

        for (var file of buttonFiles) {
            const button = require(`../buttons/${file}`);
            client.buttons.set(button.name, button);
        }
    };
};
