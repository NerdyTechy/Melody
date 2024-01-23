import { Client } from "discord.js";
import fs from "fs";
import path from "path";

export default (client: Client) => {
    if (!fs.existsSync(path.join(__dirname, "..", "buttons"))) return;

    fs.readdirSync(path.join(__dirname, "..", "buttons"))
        .filter((file) => file.endsWith(".js") || file.endsWith(".ts"))
        .forEach((file) => {
            const button = require(`../buttons/${file}`).default;
            client.buttons.set(button.name, button);
        });
};
