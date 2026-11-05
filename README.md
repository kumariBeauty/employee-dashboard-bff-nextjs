# employee-dashboard-bff-nextjs
Backend-for-Frontend (BFF) pattern demo.

- `bff-nextjs/` – Next.js BFF (port 4000) that combines and validates data from DummyJSON + JSONPlaceholder
- `employee-dashboard-react/` – React + Vite dashboard that talks only to the BFF

## Run
    cd bff-nextjs && cp .env.example .env.local && npm install && npm run dev
    cd employee-dashboard-react && cp .env.example .env.local && npm install && npm run dev
