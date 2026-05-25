#!/usr/bin/env bash
set -euo pipefail

SERVICE_NAME="hr-easy"
REGION="asia-southeast1"
IMAGE_URL="ghcr.io/OWNER/hr-easy:latest"
DATABASE_URL_PLACEHOLDER="postgresql://USER:PASSWORD@HOST:5432/hr_easy?schema=public"

# Deploy the production image from GHCR to Cloud Run.
gcloud run deploy "$SERVICE_NAME" \
  --image "$IMAGE_URL" \
  --region "$REGION" \
  --platform managed \
  --port 3000 \
  --allow-unauthenticated \
  --set-env-vars "DATABASE_URL=$DATABASE_URL_PLACEHOLDER,NODE_ENV=production,PORT=3000,HOSTNAME=0.0.0.0"
