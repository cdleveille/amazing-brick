import mongoose from "mongoose";

import { Config } from "@helpers";
import { log } from "@services";

export const connectToDatabase = () => {
	log.info(`Connecting to database on ${Config.MONGO_URI}...`);
	mongoose
		.connect(Config.MONGO_URI)
		.then(() => log.info("Connected to database successfully."))
		.catch(log.error);
};
