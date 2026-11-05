/**
 * Normalized error shape for any failure talking to a downstream service.
 * Route handlers only ever need to catch this one type.
 */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: unknown
  ) {
    super(message);
    this.name = "HttpError";
  }

  static notFound(message: string) {
    return new HttpError(404, "NOT_FOUND", message);
  }

  static badRequest(message: string) {
    return new HttpError(400, "BAD_REQUEST", message);
  }

  static upstream(message: string, details?: unknown) {
    return new HttpError(502, "UPSTREAM_ERROR", message, details);
  }

  static timeout(message: string) {
    return new HttpError(504, "UPSTREAM_TIMEOUT", message);
  }
}
