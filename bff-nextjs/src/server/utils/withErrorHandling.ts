import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { HttpError } from "../http/HttpError";
import { fail } from "./apiResponse";
import { logger } from "./logger";

type RouteHandler<Context> = (
  request: NextRequest,
  context: Context
) => Promise<NextResponse>;

/**
 * Wraps a Next.js route handler so every controller/service error is caught
 * in one place and turned into the shared `ApiFailure` envelope, instead of
 * every route re-implementing try/catch.
 */
export function withErrorHandling<Context>(
  handler: RouteHandler<Context>
): RouteHandler<Context> {
  return async (request: NextRequest, context: Context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      if (error instanceof HttpError) {
        logger.error(error.message, { code: error.code, status: error.status });
        return fail(error.status, error.code, error.message, error.details);
      }

      if (error instanceof ZodError) {
        logger.error("Request validation failed", { issues: error.issues });
        return fail(
          400,
          "VALIDATION_ERROR",
          "Request failed validation",
          error.issues
        );
      }

      const message = error instanceof Error ? error.message : "Unknown error";
      logger.error("Unhandled error in route handler", { message });
      return fail(500, "INTERNAL_ERROR", "Something went wrong");
    }
  };
}
