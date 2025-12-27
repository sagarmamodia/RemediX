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

  // daily: {
  //   DAILY_ACCESS_TOKEN: process.env.DAILY_ACCESS_TOKEN,
  // },
  gmail: {
    user: process.env.GMAIL_USER ?? "test-user",
    password: process.env.GMAIL_APP_PASSWORD ?? "test-password",
  },

  videosdk: {
    api_key: process.env.VIDEOSDK_API_KEY,
    secret: process.env.VIDEOSDK_SECRET,
  },

  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },

  resend: {
    api_key: process.env.RESEND_API_KEY ?? "resend-key",
    domain: process.env.RESEND_DOMAIN ?? "outboarding@resend.dev",
  },
} as const;

export { config };
