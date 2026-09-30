# Quartz CNA Mock

A Quartz-style / CNA-feature news site (mock) — static SPA frontend + serverless API backed by Supabase Postgres.

## Stack

- **Frontend**: static HTML + React, bundled to `assets/js/app.js` by `npm run build`
- **API**: serverless function (`api/[...path].mjs`) backed by Supabase Postgres (via `pg`)
- **Local dev**: Node static server (`server.mjs`) backed by SQLite (auto-seeded on first run)

## Setup

```bash
npm install
npm run build      # bundles React + copies static files into public/
npm run serve      # local dev server on http://127.0.0.1:4173 (SQLite)
```

## Production (Vercel + Supabase)

- `vercel.json` sets the build command and static output directory (`public/`).
- Set the `DATABASE_URL` environment variable in Vercel to a Supabase Postgres connection string (transaction pooler recommended for serverless).
- `lib/api-supabase.mjs` reads `DATABASE_URL` and serves all `/api/*` routes.

## Tests

```bash
npm test
```
