# Employee Dashboard (React)

Vite + React client for the `bff-nextjs` BFF. It only ever calls the BFF —
never DummyJSON or JSONPlaceholder directly.

## Run

```bash
cp .env.example .env.local   # VITE_BFF_URL=http://localhost:4000
npm install
npm run dev                  # http://localhost:5173
```

Start the BFF (`cd ../bff-nextjs && npm run dev`) first.

## Structure

```
src/
  api/client.ts      bffGet(): fetch + unwrap the BFF's {success,data} envelope
  api/*.ts           One function per BFF endpoint
  hooks/useAsync.ts  loading / error / data state for an async call
  components/        Dashboard, Employees (+ detail panel), Tasks views
  types.ts           Mirrors the BFF's DTOs
```
