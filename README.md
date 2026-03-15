# Audio Player Monorepo

Cross-platform audio player monorepo built around a shared Solito-style app layer:

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
cp apps/next/.env.example apps/next/.env.local
cp apps/expo/.env.example apps/expo/.env.local
```

`pnpm install` also runs Husky via the repo `prepare` script, so Git hooks are installed automatically for this checkout.

## Environment Variables

### Shared frontend env

Use the app-local files when you want each app configured independently:

- `NEXT_PUBLIC_RESTDB_API_KEY`
- `NEXT_PUBLIC_RESTDB_BASE_URL`
- `NEXT_PUBLIC_RESTDB_COLLECTION`
- `EXPO_PUBLIC_RESTDB_API_KEY`
- `EXPO_PUBLIC_RESTDB_BASE_URL`
- `EXPO_PUBLIC_RESTDB_COLLECTION`

Files:

- `apps/next/.env.local` for the Next app
- `apps/expo/.env.local` for the Expo app
- `.env.local` for shared root values used by local tooling and fallback config

Examples:

- [apps/next/.env.example](apps/next/.env.example)
- [apps/expo/.env.example](apps/expo/.env.example)
- [.env.example](.env.example)

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

Web production build:

```bash
pnpm --filter @audio-player/next build
pnpm --filter @audio-player/next start
```

Native mobile runtime commands:

```bash
pnpm --filter @audio-player/expo ios
pnpm --filter @audio-player/expo android
```

Expo uses a monorepo-aware Metro config in [apps/expo/metro.config.js](apps/expo/metro.config.js), so if module resolution gets weird after dependency changes, restart with a cleared cache:

```bash
pnpm --filter @audio-player/expo dev -- --clear
```

## Quality

```bash
pnpm typecheck
pnpm lint
pnpm test
```

Git hooks:

- `pre-commit` runs `pnpm lint`
- `pre-push` runs `pnpm test`

## Deploy

### Next.js on Vercel

Recommended Vercel project settings for this monorepo:

- Root Directory: `apps/next`
- Install Command: `pnpm install`
- Build Command: `pnpm build`

Set these Vercel environment variables:

- `NEXT_PUBLIC_RESTDB_API_KEY`
- `NEXT_PUBLIC_RESTDB_BASE_URL`
- `NEXT_PUBLIC_RESTDB_COLLECTION`

## Expo Runtime QA

Use the checklist in [docs/expo-runtime-qa-checklist.md](docs/expo-runtime-qa-checklist.md)
for background playback, interruption handling, and remote control validation.

## Security Notes

- Never commit `.env.local` or other secret-bearing env files.
- If credentials were ever exposed, rotate those keys immediately.
