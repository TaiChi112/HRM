# Deployment Guide

This document describes the production deployment path for HR Easy and the supporting infrastructure required to run it in the cloud.

## Deployment Strategy

The current continuous deployment path is intentionally staged:

1. The CI job validates the application with TypeScript, build verification, and Playwright smoke tests.
2. The `build-and-push` job builds the Docker image and publishes it to GitHub Container Registry (GHCR).
3. The optional `deploy-to-cloud` job can publish that GHCR image to Google Cloud Run when `ENABLE_CLOUD_DEPLOY=true` is set.

This structure keeps deployment gated behind successful validation while still allowing the image artifact to be promoted into cloud runtime environments in a controlled way.

## Manual Cloud Run Deployment

The repository includes [infra/scripts/deploy-gcp.sh](../infra/scripts/deploy-gcp.sh) as a manual deployment helper. It contains the Cloud Run command needed to deploy the current GHCR image.

Before running it, update the placeholder values at the top of the script:

- `IMAGE_URL` should point to the tagged GHCR image, such as `ghcr.io/<owner>/hr-easy:latest`.
- `REGION` should match the target Google Cloud region.
- `DATABASE_URL_PLACEHOLDER` should be replaced with the runtime database connection string or a secure secret-backed value.

Then run:

```bash
./infra/scripts/deploy-gcp.sh
```

The script uses `gcloud run deploy` with port `3000`, a managed deployment target, and environment variables for runtime configuration.

## Managed PostgreSQL Provisioning

Production should not rely on the prototype database used during local development. Instead, provision a managed PostgreSQL service and inject its connection string into Cloud Run securely.

### Option 1: Google Cloud SQL

1. Create a Cloud SQL PostgreSQL instance in the same region as Cloud Run.
2. Create a database and user for HR Easy.
3. Store the generated connection string in Secret Manager.
4. Attach the secret to the Cloud Run service as `DATABASE_URL`.

### Option 2: Neon or Supabase

1. Provision a managed PostgreSQL database in the provider of your choice.
2. Create a dedicated database and limited-privilege user.
3. Copy the provider connection string into a secret manager or GitHub Secret for deployment automation.
4. Inject the final `DATABASE_URL` into Cloud Run as a runtime environment variable or secret reference.

### Secure `DATABASE_URL` Handling

- Do not commit the production connection string to the repository.
- Prefer Cloud Secret Manager or an equivalent secret store.
- Use GitHub Secrets only for deployment-time credentials and cloud provider authentication.
- Keep local `.env` values separate from production secrets.

For Cloud Run, the deployed service should receive the final `DATABASE_URL` at runtime so the Prisma repository can connect to the managed database without code changes.

## Operational Notes

- The container image is built from the repository root and published to GHCR.
- Cloud Run deployments should use the same image tag that passed CI.
- The service listens on port `3000`, which must match the container and Cloud Run configuration.
- The application expects the Prisma schema to be migrated before the first production deployment.