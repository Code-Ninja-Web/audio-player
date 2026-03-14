# Audio Player

Simple React + Vite web app for playing live radio channels.

The app reads channel metadata from RestDB and plays audio streams (HLS) in a lightweight UI.

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Grommet + styled-components
- HLS.js
- Vitest + Testing Library

## Project Structure

- `src/`: frontend app
- `scripts/`: ingest pipeline (scrape source + write to RestDB)
- `.github/workflows/deploy-pages.yml`: build and GitHub Pages deploy
- `.github/workflows/channel-ingest.yml`: scheduled ingest job

## Requirements

- Node.js `>=20`
- Yarn `4.x` (via Corepack)

## Local Development

1. Install dependencies:

```bash
corepack enable
yarn install
```

2. Create env file:

```bash
cp .env.example .env.local
```

3. Fill required values in `.env.local`.

4. Start the app:

```bash
yarn dev
```

## Useful Scripts

- `yarn dev`: run Vite dev server
- `yarn build`: production build
- `yarn preview`: preview production build
- `yarn test`: run tests in watch mode
- `yarn test:no-watch`: run tests once
- `yarn lint`: run ESLint on `src` and `scripts`
- `yarn format`: run Prettier write
- `yarn validate`: typecheck + format check + lint + tests
- `yarn ingest`: compile and run ingest pipeline

## Environment Variables

### Frontend

- `VITE_RESTDB_API_KEY`
- `VITE_RESTDB_BASE_URL`
- `VITE_RESTDB_COLLECTION`

### Ingester

- `FULL_ACCESS_RESTDB_API_KEY` (required)
- `RESTDB_BASE_URL` (required)
- `RESTDB_COLLECTION` (required)
- `INGEST_SOURCE_BASE_URL` (required)
- `INGEST_SOURCE_PAGE_PATH` (optional, default: `radio/live.php`)

## Ingester Cron Setup

The ingest pipeline is configured in `.github/workflows/channel-ingest.yml`.

### Current Schedule

```yaml
on:
    schedule:
        - cron: '0 0/12 * * *'
```

This runs every 12 hours at minute `00` (UTC).

### GitHub Secrets and Variables

Set these in your repository settings:

- Secret: `FULL_ACCESS_RESTDB_API_KEY`
- Variable: `RESTDB_BASE_URL`
- Variable: `RESTDB_COLLECTION`
- Variable: `INGEST_SOURCE_BASE_URL`

The workflow writes them to `.env` in CI, then runs:

```bash
yarn ingest
```

### Local Ingest Run

To test ingest locally:

```bash
yarn ingest
```

Make sure your local env file (`.env.local` or `.env`) includes all required ingester variables.
