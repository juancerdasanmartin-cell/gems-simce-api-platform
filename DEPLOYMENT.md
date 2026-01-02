# Deployment Guide

## Production Deployment - Google Cloud Run

This guide covers deploying Gems SIMCE API Platform to Google Cloud Run in production.

## Prerequisites

- Google Cloud Project with billing enabled
- gcloud CLI installed and authenticated
- Docker installed (for building container images)
- GitHub account with repository access

## Architecture Overview

```
Domain (gems-simce.dev)
    |
    v
Cloud Load Balancer
    |
    v
Cloud Run Service (gems-simce-backend)
    |
    +---> Firestore (database)
    +---> Cloud Storage (PDFs)
    +---> Secret Manager (API keys)
    +---> Pub/Sub (async tasks)
```

## Step 1: Setup GCP Project

### 1.1 Create Project

```bash
gcloud projects create gems-simce-prod --name="Gems SIMCE Production"
gcloud config set project gems-simce-prod
```

### 1.2 Enable Required APIs

```bash
gcloud services enable \
  run.googleapis.com \
  firestore.googleapis.com \
  storage-api.googleapis.com \
  secretmanager.googleapis.com \
  cloudtrace.googleapis.com \
  logging.googleapis.com
```

### 1.3 Create Service Account

```bash
gcloud iam service-accounts create gems-simce-sa \
  --display-name="Gems SIMCE Service Account"

SA_EMAIL="gems-simce-sa@gems-simce-prod.iam.gserviceaccount.com"

# Grant roles
gcloud projects add-iam-policy-binding gems-simce-prod \
  --member=serviceAccount:$SA_EMAIL \
  --role=roles/datastore.user

gcloud projects add-iam-policy-binding gems-simce-prod \
  --member=serviceAccount:$SA_EMAIL \
  --role=roles/storage.objectAdmin
```

## Step 2: Store Secrets

### 2.1 Create Secret Manager Entries

```bash
echo -n "your-gcp-project-id" | \
  gcloud secrets create GCP_PROJECT_ID --data-file=-

echo -n "your-stripe-secret-key" | \
  gcloud secrets create STRIPE_SECRET_KEY --data-file=-

echo -n "your-sendgrid-api-key" | \
  gcloud secrets create SENDGRID_API_KEY --data-file=-

echo -n "your-jumpseller-api-key" | \
  gcloud secrets create JUMPSELLER_API_KEY --data-file=-
```

### 2.2 Grant Secret Access

```bash
for SECRET in GCP_PROJECT_ID STRIPE_SECRET_KEY SENDGRID_API_KEY JUMPSELLER_API_KEY; do
  gcloud secrets add-iam-policy-binding $SECRET \
    --member=serviceAccount:$SA_EMAIL \
    --role=roles/secretmanager.secretAccessor
done
```

## Step 3: Build and Push Container

### 3.1 Create Dockerfile

```dockerfile
# Use Node.js 18 as base
FROM node:18-slim

WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY backend/src ./src
COPY backend/tsconfig.json ./

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "dist/index.js"]
```

### 3.2 Build and Push to Artifact Registry

```bash
# Create Artifact Registry repository
gcloud artifacts repositories create gems-simce \
  --repository-format=docker \
  --location=us-central1

# Build image
gcloud builds submit \
  --tag us-central1-docker.pkg.dev/gems-simce-prod/gems-simce/api:latest
```

## Step 4: Deploy to Cloud Run

### 4.1 Deploy Service

```bash
gcloud run deploy gems-simce-backend \
  --image us-central1-docker.pkg.dev/gems-simce-prod/gems-simce/api:latest \
  --platform managed \
  --region us-central1 \
  --memory 1Gi \
  --cpu 1 \
  --timeout 3600 \
  --concurrency 100 \
  --min-instances 1 \
  --max-instances 50 \
  --allow-unauthenticated
```

### 4.2 Configure Environment Variables

```bash
# Set environment variables via Secret Manager
gcloud run services update gems-simce-backend \
  --set-env-vars=GCP_PROJECT_ID=gems-simce-prod \
  --region=us-central1

# Or via .env file mapping
for SECRET in GCP_PROJECT_ID STRIPE_SECRET_KEY SENDGRID_API_KEY; do
  gcloud run services update gems-simce-backend \
    --update-secrets=$SECRET=/gems-simce-prod/versions/latest \
    --region=us-central1
done
```

### 4.3 Set Service Account

```bash
gcloud run services update gems-simce-backend \
  --service-account=gems-simce-sa@gems-simce-prod.iam.gserviceaccount.com \
  --region=us-central1
```

## Step 5: Setup Custom Domain

### 5.1 Add Custom Domain

```bash
gcloud run domain-mappings create \
  --service=gems-simce-backend \
  --domain=api.gems-simce.dev \
  --region=us-central1
```

### 5.2 Update DNS Records

Add CNAME record to your DNS provider:

```
api.gems-simce.dev CNAME grun.app
```

Or use the generated Google Managed Certificate CNAME.

## Step 6: Setup CI/CD Pipeline

### 6.1 Cloud Build Configuration

Create `cloudbuild.yaml`:

```yaml
steps:
  # Build container image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'us-central1-docker.pkg.dev/$PROJECT_ID/gems-simce/api:$COMMIT_SHA', '.']
  
  # Push to Artifact Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'us-central1-docker.pkg.dev/$PROJECT_ID/gems-simce/api:$COMMIT_SHA']
  
  # Deploy to Cloud Run
  - name: 'gcr.io/cloud-builders/run'
    args:
      - 'deploy'
      - 'gems-simce-backend'
      - '--image=us-central1-docker.pkg.dev/$PROJECT_ID/gems-simce/api:$COMMIT_SHA'
      - '--region=us-central1'
      - '--platform=managed'

images:
  - 'us-central1-docker.pkg.dev/$PROJECT_ID/gems-simce/api:$COMMIT_SHA'
```

### 6.2 GitHub Actions (Alternative)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloud Run

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v1
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}
      
      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v1
      
      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy gems-simce-backend \
            --image gcr.io/$PROJECT_ID/gems-simce-api:$GITHUB_SHA \
            --region us-central1 \
            --platform managed
```

## Step 7: Monitoring and Logging

### 7.1 View Logs

```bash
# Stream logs
gcloud run logs read gems-simce-backend --region us-central1 --follow

# View specific error
gcloud logging read "severity=ERROR AND resource.service_name=gems-simce-backend" \
  --limit 10 \
  --format json
```

### 7.2 Set Up Alerts

```bash
# Create alert for high error rate
gcloud alpha monitoring policies create \
  --notification-channels=<CHANNEL_ID> \
  --display-name="High error rate" \
  --condition-display-name="Error rate > 5%"
```

### 7.3 Cloud Trace

```bash
# View traces
gcloud trace list
gcloud trace describe <TRACE_ID>
```

## Step 8: Database Backup

### 8.1 Enable Automatic Backups

```bash
gcloud firestore backups create \
  --collection-filter='__all__' \
  --retention-days=30
```

### 8.2 Manual Export

```bash
gcloud firestore export gs://gems-simce-backups/backup-$(date +%Y%m%d)
```

## Scaling and Performance

### 8.1 Auto-Scaling Configuration

Cloud Run automatically scales based on requests. Configuration:

- **Min instances**: 1 (keeps service warm)
- **Max instances**: 50 (prevents cost explosion)
- **CPU**: 1 (shared)
- **Memory**: 1 GB
- **Timeout**: 3600 seconds (60 minutes for long-running Gem generation)

### 8.2 Performance Tips

1. **Connection pooling**: Reuse Firestore connections
2. **Caching**: Use Cloud CDN for static responses
3. **Async tasks**: Use Cloud Tasks or Pub/Sub for long operations
4. **Compression**: Enable gzip compression for responses

## Cost Estimation

**Monthly costs (estimated)**:

- Cloud Run: ~$20 (1GB, 100 concurrent requests)
- Firestore: ~$30 (operations + storage)
- Cloud Storage: ~$5
- Cloud Build: ~$10 (10 builds/month)
- **Total**: ~$65/month

## Rollback Procedure

```bash
# View previous revisions
gcloud run revisions list --service=gems-simce-backend --region=us-central1

# Traffic to previous revision
gcloud run services update-traffic gems-simce-backend \
  --to-revisions REVISION=100 \
  --region=us-central1
```

## Troubleshooting

### Service not starting

```bash
# Check logs
gcloud run logs read gems-simce-backend --limit 50

# Test locally with same environment
docker run --env-file .env <IMAGE>
```

### High latency

```bash
# Check trace
gcloud trace list --filter='latency > 2000'

# Check Firestore indexes
gcloud firestore indexes describe <INDEX_ID>
```

### High costs

```bash
# Check pricing breakdown
gcloud billing accounts list

# Reduce max instances
gcloud run services update gems-simce-backend --max-instances=20
```

## Next Steps

1. Setup monitoring alerts
2. Configure automated backups
3. Implement CI/CD pipeline
4. Load test the service
5. Document runbooks for common issues
