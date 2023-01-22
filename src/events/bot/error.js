module.exports = {
    name: "shardError",
    once: false,
    async execute(error) {
        return console.error(error);
    },
};
