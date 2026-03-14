# Audio Player Monorepo

Cross-platform radio player migration to a Solito-style monorepo:

- `apps/next`: web app (Next.js)
- `apps/expo`: mobile app (Expo)
- `packages/app`: shared domain, state, and UI
- `packages/config`: shared tokens/config
- `packages/scripts`: ingestion pipeline

## Requirements

- Node.js `>=20`
- pnpm `>=10`

## Setup

```bash
corepack enable
pnpm install
cp .env.example .env.local
cp apps/expo/.env.example apps/expo/.env.local
```

## Environment Variables

### Shared frontend env

Set both prefixes if you run both apps:

- `NEXT_PUBLIC_RESTDB_API_KEY`
- `NEXT_PUBLIC_RESTDB_BASE_URL`
- `NEXT_PUBLIC_RESTDB_COLLECTION`
- `EXPO_PUBLIC_RESTDB_API_KEY`
- `EXPO_PUBLIC_RESTDB_BASE_URL`
- `EXPO_PUBLIC_RESTDB_COLLECTION`

For Expo-only local setup, you can place the mobile values in `apps/expo/.env.local`.

### Ingestion env

- `FULL_ACCESS_RESTDB_API_KEY`
- `RESTDB_BASE_URL`
- `RESTDB_COLLECTION`
- `INGEST_SOURCE_BASE_URL`
- `INGEST_SOURCE_PAGE_PATH` (optional, defaults to `radio/live.php`)

## Run

```bash
pnpm dev                 # Next.js app
pnpm --filter @audio-player/expo dev
pnpm dev:all             # all workspaces
```

Native mobile runtime commands:

```bash
pnpm --filter @audio-player/expo ios
pnpm --filter @audio-player/expo android
```

## Quality

```bash
pnpm typecheck
pnpm lint
pnpm test
```

## Expo Runtime QA

Use the checklist in [docs/expo-runtime-qa-checklist.md](docs/expo-runtime-qa-checklist.md)
for background playback, interruption handling, and remote control validation.

## Security Notes

- Never commit `.env.local` or other secret-bearing env files.
- If credentials were ever exposed, rotate those keys immediately.
