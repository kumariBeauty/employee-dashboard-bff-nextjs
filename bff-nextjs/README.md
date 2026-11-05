# BFF Service (Next.js)

Backend-for-Frontend layer for a separate React application. This app has
no user-facing UI of its own — it exposes a JSON API that:

- Talks to downstream services (two free public APIs) instead of letting the
  React app call them directly.
- Shapes/renames raw downstream responses into stable DTOs the React app can
  rely on, regardless of what the underlying API looks like.
- Aggregates multiple downstream calls into one endpoint where a screen
  needs data from more than one source (`/api/dashboard`).
- Centralizes cross-cutting concerns (CORS, error format, timeouts, request
  validation) in one place instead of duplicating them in the React app.

## Architecture

```
React app  ──HTTP──>  Next.js BFF (/api/*)  ──HTTP──>  Downstream services
                                                        (DummyJSON, JSONPlaceholder —
                                                         no auth required)
```

```
src/
  app/
    api/                     Route handlers — thin, no business logic
      employees/route.ts
      employees/[id]/route.ts
      tasks/route.ts
      dashboard/route.ts     Aggregates employees + tasks
      health/route.ts        BFF + downstream health check
    page.tsx                 Status page listing available endpoints
  proxy.ts                   CORS for the React app's origin (Next 16 "proxy",
                              formerly "middleware")
  server/
    config/env.ts            All env vars resolved here (one place to point
                              at a different API later)
    types/external/          Raw shapes returned by each downstream API
    dto/                     Stable shapes returned to the React app
    services/                One file per downstream dependency — only these
                              files know which free API is in use
    controllers/             Shape raw data into DTOs, aggregate, validate
    http/                    Shared fetch wrapper (timeouts, error normalization)
    utils/                   Response envelope, error-handling wrapper, logger
```

**Layering rule:** route handler → controller → service → http client.
Route handlers never call `fetch` directly, and services never know about
`NextResponse` — that keeps the downstream integration swappable without
touching the API surface the React app depends on.

## Downstream services

| Domain    | Source (free, no auth)                          | Used as          |
|-----------|--------------------------------------------------|-------------------|
| Employees | [DummyJSON](https://dummyjson.com) `/users`       | Employee directory |
| Tasks     | [JSONPlaceholder](https://jsonplaceholder.typicode.com) `/todos` | Per-employee tasks |

Neither API requires authentication, so there's no token/auth handling in
this BFF. To point at different APIs later, change only
`EMPLOYEE_SERVICE_BASE_URL` / `TASK_SERVICE_BASE_URL` in `.env.local`, the
raw types in `src/server/types/external/*.ts`, and the mapping functions in
the relevant controller — the route handlers and DTOs the React app depends
on don't need to change.

Note: DummyJSON and JSONPlaceholder are unrelated APIs — matching an
employee's `id` to a task's `employeeId` (JSONPlaceholder's `userId`, which
only goes 1–10) is a demo convenience for the aggregation example, not a
real relationship.

## Getting started

```bash
npm install
cp .env.example .env.local   # already done — edit ALLOWED_ORIGINS / base URLs as needed
npm run dev                  # runs on http://localhost:4000
```

Visit `http://localhost:4000` for a list of available endpoints.

## API

All responses use one envelope:

```jsonc
// success
{ "success": true, "data": /* ... */, "meta": { /* optional */ } }

// error
{ "success": false, "error": { "code": "NOT_FOUND", "message": "..." } }
```

| Method | Path                 | Description                                              |
|--------|----------------------|-----------------------------------------------------------|
| GET    | `/api/health`        | BFF + downstream service health check                     |
| GET    | `/api/employees`     | List employees — supports `?limit&skip&search`            |
| GET    | `/api/employees/:id` | Employee detail, aggregated with their task counts         |
| GET    | `/api/tasks`         | List tasks — supports `?employeeId&completed`              |
| GET    | `/api/dashboard`     | Aggregated view: totals + a "busiest employees" leaderboard |

## Consuming this from the React app

The React app should call this BFF instead of any downstream API directly —
e.g. via an env var like `REACT_APP_BFF_URL=http://localhost:4000` (or the
Vite equivalent) — and treat `data`/`error` from the envelope above as the
entire contract. No auth header is needed.

Set `ALLOWED_ORIGINS` in this project's `.env.local` to the React app's dev
and production origins so CORS (`src/proxy.ts`) allows the requests.

## Scripts

- `npm run dev` — start the BFF on port 4000 (Turbopack)
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — ESLint
