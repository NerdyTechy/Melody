import logger from "../../utils/logger";

export default {
    name: "debug",
    async execute(_, message) {
        logger.debug(message);
    },
};
