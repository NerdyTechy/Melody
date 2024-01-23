import logger from "./logger";

export default function registerProcessEvents() {
    process.on("unhandledRejection", (reason: any) => {
        logger.error("An unhandled rejection occurred in the main process:");
        logger.error(reason.stack ? `${reason.stack}` : `${reason}`);
    });

    process.on("uncaughtException", (err) => {
        logger.error("An uncaught exception occurred in the main process:");
        logger.error(err.stack ? `${err.stack}` : `${err}`);
    });

    process.on("uncaughtExceptionMonitor", (err) => {
        logger.error("An uncaught exception monitor occurred in the main process:");
        logger.error(err.stack ? `${err.stack}` : `${err}`);
    });

    process.on("beforeExit", (code) => {
        logger.error("The process is about to exit with code: " + code);
        process.exit(code);
    });

    process.on("exit", (code) => {
        logger.error("The process exited with code: " + code);
    });
}
