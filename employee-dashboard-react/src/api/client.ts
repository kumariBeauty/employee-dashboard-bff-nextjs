/**
 * The only place in this app that knows the BFF's response envelope
 * ({success,data} / {success,error}). Every api/*.ts file calls `bffGet`
 * instead of `fetch` directly.
 */

const BFF_URL = import.meta.env.VITE_BFF_URL ?? "http://localhost:4000";

type ApiEnvelope<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };

type QueryParams = Record<string, string | number | boolean | undefined>;

/** GETs a BFF endpoint and unwraps its envelope, throwing on failure. */
export async function bffGet<T>(path: string, params: QueryParams = {}): Promise<T> {
  const url = new URL(path, BFF_URL);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  const response = await fetch(url);
  const body = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!body) {
    throw new Error(`BFF response at ${path} wasn't valid JSON (status ${response.status})`);
  }
  if (!body.success) {
    throw new Error(body.error.message);
  }
  return body.data;
}
