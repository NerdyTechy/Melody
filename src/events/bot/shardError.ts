import logger from "../../utils/logger";

export default {
    name: "shardError",
    once: false,
    async execute(error) {
        logger.error("An unhandled error occurred during runtime:");
        logger.error(error);
    },
};
