import config from "config";
import app from "./app";
import logger from "./config/logger";
import initDB from "./config/db";
import { createMessageProducerBroker } from "./common/factories/brokerFactory";
import { MessageProducerBroker } from "./common/constants/brokerType";

const startServer = async () => {
    const PORT: number = config.get("server.port") || 5001;
    let broker: MessageProducerBroker | null = null;

    try {
        await initDB();
        broker = createMessageProducerBroker();
        await broker.connect();

        logger.info("Database connected successfully");
        app.listen(PORT, () => logger.info(`Listening on port ${PORT}`));
    } catch (err: unknown) {
        if (err instanceof Error) {
            if (broker) {
                await broker.disconnect();
            }
            logger.error(err.message);
            logger.on("finish", () => {
                process.exit(1);
            });
        }
    }
};

void startServer();
