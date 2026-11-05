import { HttpError } from "./HttpError";

interface RequestOptions {
  baseUrl: string;
  path: string;
  timeoutMs: number;
  searchParams?: Record<string, string | number | boolean | undefined>;
}

function buildUrl(
  baseUrl: string,
  path: string,
  searchParams?: RequestOptions["searchParams"]
): string {
  // `new URL(path, baseUrl)` would drop any path already on `baseUrl`,
  // so join them as plain strings instead.
  const url = new URL(`${baseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`);
  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }
  return url.toString();
}

/**
 * Thin fetch wrapper shared by every downstream service client.
 * Maps any failure (network error, timeout, non-2xx) into `HttpError`.
 */
export async function httpGet<T>({
  baseUrl,
  path,
  timeoutMs,
  searchParams,
}: RequestOptions): Promise<T> {
  const url = buildUrl(baseUrl, path, searchParams);

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(timeoutMs),
      // BFF data must stay fresh per request; downstream services own caching.
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (response.status === 404) {
      throw HttpError.notFound(`Resource not found at ${path}`);
    }

    if (!response.ok) {
      const body = await response.text().catch(() => undefined);
      throw HttpError.upstream(
        `Downstream request to ${url} failed with status ${response.status}`,
        body
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof HttpError) throw error;
    if (error instanceof Error && error.name === "TimeoutError") {
      throw HttpError.timeout(`Downstream request to ${url} timed out`);
    }
    throw HttpError.upstream(
      `Downstream request to ${url} failed: ${(error as Error).message}`
    );
  }
}
