# Deployment Instructions

## GitHub Actions Setup

To enable automatic deployment to Vercel via GitHub Actions, you need to set up the following secrets in your GitHub repository:

### Required Secrets

1. **VERCEL_TOKEN**: Your Vercel API token
   - Go to [Vercel Account Settings](https://vercel.com/account/tokens)
   - Create a new token
   - Add it as a secret named `VERCEL_TOKEN`

2. **VERCEL_ORG_ID**: Your Vercel organization ID
   - Go to your Vercel project settings
   - Find the Organization ID in the project settings
   - Add it as a secret named `VERCEL_ORG_ID`

3. **VERCEL_PROJECT_ID**: Your Vercel project ID
   - Go to your Vercel project settings
   - Find the Project ID in the project settings
   - Add it as a secret named `VERCEL_PROJECT_ID`

### How to Add Secrets

1. Go to your GitHub repository
2. Click on "Settings" tab
3. Click on "Secrets and variables" → "Actions"
4. Click "New repository secret"
5. Add each secret with the name and value

## Manual Deployment

You can also deploy manually using:

```bash
npm run deploy
```

Or using Vercel CLI directly:

```bash
vercel --prod
```

## Workflows

Two GitHub Actions workflows are set up:

1. **deploy.yml**: Uses the amondnet/vercel-action
2. **vercel-deploy.yml**: Uses Vercel CLI directly

Both will trigger on pushes to the main branch and deploy to production.
