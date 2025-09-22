const PORT = Number(process.env.PORT) || 3000;

const MONGO_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017/amazing-brick";

export const Config = { PORT, MONGO_URI };
