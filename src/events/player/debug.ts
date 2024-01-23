import config from "../../config";
import logger from "../../utils/logger";

export default {
    name: "debug",
    async execute(queue, message) {
        if (config.debug) {
            logger.debug(message);
        }
    },
};
