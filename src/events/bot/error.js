const logger = require("../../utils/logger");

module.exports = {
    name: "shardError",
    once: false,
    async execute(error) {
        logger.error("An unhandled error occurred during runtime:");
        logger.error(error);
    },
};
