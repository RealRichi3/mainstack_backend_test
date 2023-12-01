import { NodeEnvironment } from "./interfaces/config";
import dotenv from "dotenv";

const NODE_ENV = process.env.NODE_ENV as NodeEnvironment;
const PORT = process.env.PORT || 3000;

const path = NODE_ENV === "TEST" ? __dirname + "/../.env.test" : __dirname + "/../.env";
dotenv.config({ path });

import { initializeExpressServer } from "./app";
import logger from "./middlewares/logger";
import initializeDatabaseConnection from "./database";

async function startServer(): Promise<void> {
    await initializeDatabaseConnection();
    const app = initializeExpressServer();

    app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT} in ${NODE_ENV} mode`);
    });
}

startServer();
