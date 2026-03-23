import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, printf, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  return JSON.stringify({
    level,
    message,
    timestamp,
    ...(stack && { stack }),
    ...meta
  });
});

const transports = [
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error"
  }),

  new winston.transports.File({
    filename: "logs/combined.log"
  }),

  new DailyRotateFile({
    filename: "logs/app-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    maxSize: "10m",
    maxFiles: "7d"
  })
];

// Only add console in development
if (process.env.NODE_ENV !== "production") {
  transports.push(new winston.transports.Console());
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    timestamp(),
    errors({ stack: true }),
    logFormat
  ),
  transports
});

export default logger;