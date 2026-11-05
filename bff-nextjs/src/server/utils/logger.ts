/** Minimal structured logger. Swap the transport here if this ever ships to a real log sink. */
export const logger = {
  error: (message: string, meta?: Record<string, unknown>) =>
    console.error(JSON.stringify({ level: "error", message, ...meta })),
};
