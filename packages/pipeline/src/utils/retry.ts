import { createLogger } from './logger.js';

const logger = createLogger('retry');

/** Options for the retry utility */
export interface RetryOptions {
  /** Maximum number of attempts (default: 3) */
  readonly maxAttempts?: number;
  /** Base delay in milliseconds for exponential backoff (default: 1000) */
  readonly baseDelayMs?: number;
  /** Optional callback invoked on each retry */
  readonly onRetry?: (error: unknown, attempt: number) => void;
}

/**
 * Execute a function with exponential backoff retries.
 * Returns the result of the first successful invocation.
 * Throws the last error if all attempts are exhausted.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const maxAttempts = options.maxAttempts ?? 3;
  const baseDelayMs = options.baseDelayMs ?? 1000;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      lastError = error;

      if (attempt === maxAttempts) {
        logger.error({ error, attempt, maxAttempts }, 'All retry attempts exhausted');
        break;
      }

      const delayMs = baseDelayMs * Math.pow(2, attempt - 1);
      logger.warn({ error, attempt, maxAttempts, delayMs }, 'Attempt failed, retrying');

      options.onRetry?.(error, attempt);
      await sleep(delayMs);
    }
  }

  throw lastError;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
