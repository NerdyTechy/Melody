module.exports = {
    name: "ready",
    once: true,
    async execute() {
        if (global.config.analytics) {
            const fetch = require("node-fetch");
            const crypto = require("node:crypto");

            let options = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: `{"identifier":"${crypto.createHash("sha256").update(global.config.clientId).digest("hex")}"}`,
            };

            fetch("https://analytics.techy.lol/melody", options).catch(() => {});
        }

        console.log("The bot is now ready.");
    },
};
