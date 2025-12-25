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
    uri: process.env.MONGO_URI ?? "mongodb://localhost:27017",
  },

  jwt: {
    secret: process.env.JWT_SECRET ?? "secret-key",
    expiresIn: process.env.JWT_EXPIRES_IN ?? "30d",
  },

  square: {
    access_token: process.env.SQUARE_ACCESS_TOKEN,
  },

  daily: {
    DAILY_ACCESS_TOKEN: process.env.DAILY_ACCESS_TOKEN,
    DAILY_ROOM_API:
      process.env.DAILY_ROOM_API ?? " https://api.daily.co/v1/rooms/",
  },
} as const;

export { config };
