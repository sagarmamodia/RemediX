import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, json, printf, colorize, align } = winston.format;

// Custom format for local development (looks like: [INFO] 2025-01-01 10:00:00: message)
const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  align(),
  printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
);

// Standard JSON format for production servers
const prodFormat = combine(
  timestamp(),
  json() // Produces { "level": "info", "message": "...", "timestamp": "..." }
);

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: process.env.NODE_ENV === 'development' ? devFormat : prodFormat,
  transports: [
    // 1. Always log to console
    new winston.transports.Console(),

    // 2. Write all logs with level 'error' and below to 'error-%DATE%.log'
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m', // Rotate if file size exceeds 20MB
      maxFiles: '14d', // Delete logs older than 14 days
      zippedArchive: true, // Compress old logs to save space
    }),

    // 3. Write all logs with level 'info' and below to 'combined-%DATE%.log'
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      zippedArchive: true,
    }),
  ],
});

export default logger;