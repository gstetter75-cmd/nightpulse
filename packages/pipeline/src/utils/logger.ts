import pino, { type Logger } from 'pino';

/** Root logger instance for the pipeline service */
const rootLogger: Logger = pino({
  level: process.env['LOG_LEVEL'] ?? 'info',
  transport:
    process.env['NODE_ENV'] === 'development'
      ? { target: 'pino/file', options: { destination: 1 } }
      : undefined,
  base: { service: 'nightpulse-pipeline' },
  timestamp: pino.stdTimeFunctions.isoTime,
});

/**
 * Create a child logger with the given context name.
 * Use this in every module to get structured, contextual logs.
 */
export function createLogger(context: string): Logger {
  return rootLogger.child({ context });
}
