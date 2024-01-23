import { Client } from "discord.js";
import fs from "fs";
import path from "path";

export default (client: Client) => {
    if (!fs.existsSync(path.join(__dirname, "..", "menus"))) return;

    fs.readdirSync(path.join(__dirname, "..", "menus"))
        .filter((file) => file.endsWith(".js") || file.endsWith(".ts"))
        .forEach((file) => {
            const menu = require(`../menus/${file}`).default;
            client.menus.set(menu.name, menu);
        });
};
