import dotenv from "dotenv";
dotenv.config();

const config = {
    nodeEnv: process.env.NODE_ENV ?? "development",
    isProd: process.env.NODE_ENV === "production",
    isDev: process.env.NODE_ENV !== "production",

    port: Number(process.env.PORT ?? 3001),
    cors: {
        origin: process.env.CORS_ORIGIN ?? "*",
        credentials: process.env.CORS_CREDENTIALS === "true",
    },

    mongo: {
        uri: process.env.MONGO_URI ?? "mongodb://localhost:27017"
    }
    
} as const;

export { config };