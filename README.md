# HR Easy

HR Easy is a hybrid HR dashboard built with Next.js, Elysia, Prisma v7, and PostgreSQL. The frontend renders the UI shell, the Elysia API serves typed HR data, and Prisma provides the data access layer for both local development and production container builds.

## Project Overview

- Next.js App Router UI for the HR dashboard experience.
- Elysia API bridge for typed employee, attendance, and payroll endpoints.
- Prisma v7 with PostgreSQL for the repository layer and formal migration history.
- Docker-based full-stack development and production builds.

The request flow is documented in [docs/architecture.md](docs/architecture.md).

## Prerequisites

- Bun 1.3 or newer.
- Docker Desktop on Windows, with WSL integration enabled for container commands.
- PostgreSQL runs through Docker Compose; no separate local database install is required.

## Local Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd hr-easy
```

### 2. Install dependencies

```bash
bun install
```

### 3. Start PostgreSQL and the web app with Docker Compose

```bash
docker compose up -d --build
```

The `web` service is configured to talk to the `postgres` service over the internal Docker network.

### 4. Apply Prisma migrations

```bash
bunx prisma migrate dev
```

Use `bunx prisma migrate dev --name <migration-name>` when making schema changes.

### 5. Seed the database

```bash
bun run prisma/seed.ts
```

The seed script inserts sample employees, attendance rows, and payroll rows.

### 6. Run the development server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Development Notes

- The Next.js app is configured with standalone output for production container builds.
- The Prisma client is generated into `generated/prisma`.
- The UI uses the Eden client to consume typed Elysia routes.
- Date values are formatted before rendering so Prisma `Date` objects do not crash React.

## Architecture

See [docs/architecture.md](docs/architecture.md) for a boundary-oriented overview of the frontend shell, Elysia API layer, and Prisma repository implementation.

## CI/CD Pipeline

The GitHub Actions workflow in [.github/workflows/ci.yml](.github/workflows/ci.yml) currently performs the following:

- Installs Bun dependencies.
- Generates the Prisma client.
- Runs strict TypeScript checking with `bunx tsc --noEmit`.
- Runs the Playwright smoke suite against the local dev server.
- Uploads the Playwright report artifact when E2E tests fail.
- Builds and pushes the production Docker image to GitHub Container Registry on pushes to `main`.

## Useful Commands

```bash
bun run dev
bun run build
bunx prisma migrate dev --name init
bunx prisma db seed
bunx playwright test
docker compose up -d --build
docker compose down -v
```

## License

No license has been specified for this repository.
