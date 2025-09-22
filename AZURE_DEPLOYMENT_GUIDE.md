# Azure App Service Deployment Configuration

This document provides step-by-step instructions to configure your GitHub repository for automated deployment to Azure App Service.

## Prerequisites

- Azure App Service created in Azure Portal
- GitHub repository with Service Principal configured
- Azure CLI access (already completed via `az login`)

## Required GitHub Secrets

You need to configure the following secrets in your GitHub repository:

### Method 1: Using Publish Profile (Recommended for simplicity)

1. Go to your Azure Portal
2. Navigate to your App Service
3. Go to **Deployment Center** → **Settings**
4. Click **Download publish profile**
5. In GitHub, go to **Settings** → **Secrets and variables** → **Actions**
6. Add the following secret:
   - **Name**: `AZURE_WEBAPP_PUBLISH_PROFILE`
   - **Value**: Paste the entire content of the downloaded publish profile file

### Method 2: Using Service Principal (Alternative)

If you prefer using Service Principal (which you mentioned you already have), add this secret:

- **Name**: `AZURE_CREDENTIALS`
- **Value**: JSON object with your service principal details:

```json
{
  "clientId": "your-client-id",
  "clientSecret": "your-client-secret",
  "subscriptionId": "your-subscription-id",
  "tenantId": "your-tenant-id"
}
```

## Required Configuration Updates

### 1. Update Workflow File

In the file `.github/workflows/azure-app-service-deploy.yml`, update this line:

```yaml
AZURE_WEBAPP_NAME: "your-app-service-name" # Replace with your actual App Service name
```

### 2. App Service Configuration

Ensure your Azure App Service has the following settings:

- **Runtime stack**: Node 18 LTS
- **Startup command**: `npm start` (should be automatic)
- **Always On**: Enabled (recommended for production)

### 3. Next.js Configuration (Optional)

If you need environment variables, create a `.env.local` file and add corresponding App Settings in Azure:

In Azure Portal → Your App Service → **Settings** → **Configuration** → **Application settings**

## Deployment Flow

The workflow will:

1. **Trigger**: On push to `main` branch
2. **Build**: Install dependencies, run linting, build Next.js app
3. **Package**: Create optimized deployment package
4. **Deploy**: Deploy to Azure App Service
5. **Health Check**: Verify deployment success

## Getting Your App Service Name

Run this command to list your App Services:

```bash
az webapp list --query "[].{Name:name, ResourceGroup:resourceGroup, State:state}" --output table
```

## Troubleshooting

### Common Issues:

1. **Build fails**: Check Node.js version compatibility
2. **Deployment fails**: Verify App Service name and secrets
3. **App doesn't start**: Check startup command and App Settings
4. **403/404 errors**: Verify App Service configuration and routing

### Useful Azure CLI Commands:

```bash
# Check App Service details
az webapp show --name <app-name> --resource-group <resource-group-name>

# View App Service logs
az webapp log tail --name <app-name> --resource-group <resource-group-name>

# Download publish profile
az webapp deployment list-publishing-profiles --name <app-name> --resource-group <resource-group-name>
```

## Next Steps

1. Update the `AZURE_WEBAPP_NAME` in the workflow file
2. Configure GitHub secrets as described above
3. Commit and push changes to trigger deployment
4. Monitor the GitHub Actions tab for deployment progress

## File Structure

```
.github/
└── workflows/
    ├── azure-app-service-deploy.yml          # Simple deployment workflow
    └── azure-staging-production.yml          # Advanced multi-environment workflow
```

Choose the workflow that best fits your needs:

- Use `azure-app-service-deploy.yml` for simple single-environment deployment
- Use `azure-staging-production.yml` for staging and production environments
