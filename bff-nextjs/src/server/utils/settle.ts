import { logger } from "./logger";

/**
 * Unwraps one result of `Promise.allSettled`. A failed (or timed-out)
 * downstream call becomes `null` plus a warning, so the caller can still
 * return the data from the services that did respond.
 */
export function settle<T>(
  result: PromiseSettledResult<T>,
  serviceName: string,
  warnings: string[]
): T | null {
  if (result.status === "fulfilled") return result.value;

  const reason = result.reason instanceof Error ? result.reason.message : String(result.reason);
  logger.error(`${serviceName} failed, returning partial data`, { reason });
  warnings.push(`${serviceName} is unavailable right now — showing partial data.`);
  return null;
}
