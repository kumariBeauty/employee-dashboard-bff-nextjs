/**
 * Central config for the BFF. Nothing else in the codebase should read
 * `process.env` directly — pointing at a different API is a change to the
 * `.env` values (or the defaults here) only.
 */

function readList(value: string | undefined, fallback: string[]): string[] {
  if (!value?.trim()) return fallback;
  return value.split(",").map((v) => v.trim()).filter(Boolean);
}

function readNumber(value: string | undefined, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

const config = {
  allowedOrigins: readList(process.env.ALLOWED_ORIGINS, [
    "http://localhost:3000",
    "http://localhost:5173",
  ]),
  services: {
    /** DummyJSON — employee-like user profiles. No auth required. */
    employeeService: {
      baseUrl: process.env.EMPLOYEE_SERVICE_BASE_URL ?? "https://dummyjson.com",
      timeoutMs: readNumber(process.env.EMPLOYEE_SERVICE_TIMEOUT_MS, 3000),
    },
    /** JSONPlaceholder — todos, used as per-employee tasks. No auth required. */
    taskService: {
      baseUrl:
        process.env.TASK_SERVICE_BASE_URL ?? "https://jsonplaceholder.typicode.com",
      timeoutMs: readNumber(process.env.TASK_SERVICE_TIMEOUT_MS, 3000),
    },
  },
};

export function getConfig() {
  return config;
}
