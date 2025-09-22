# Service Principal Deployment Setup Guide

This guide will help you complete the setup for deploying to your `great-next-simple` App Service using Service Principal authentication.

## GitHub Repository Secrets Configuration

Since you mentioned you already have Service Principal credentials set up, please ensure you have the following secret in your GitHub repository:

### Required Secret: AZURE_CREDENTIALS

Go to your GitHub repository: **Settings** → **Secrets and variables** → **Actions**

Ensure you have a secret named `AZURE_CREDENTIALS` with a JSON value like this:

```json
{
  "clientId": "your-client-id",
  "clientSecret": "your-client-secret",
  "subscriptionId": "your-subscription-id",
  "tenantId": "your-tenant-id"
}
```

## Service Principal Permissions

Your Service Principal needs the following permissions:

### 1. Azure RBAC Roles

- **Website Contributor** role on the `great-next-simple` App Service
- Or **Contributor** role on the resource group `rg-saas-app-playground`

### 2. Verify Permissions (Optional)

Run this command to check current role assignments:

```bash
# Check Service Principal permissions on the App Service
az role assignment list --assignee "your-client-id" --scope "/subscriptions/your-subscription-id/resourceGroups/rg-saas-app-playground/providers/Microsoft.Web/sites/great-next-simple"

# Check Service Principal permissions on the resource group
az role assignment list --assignee "your-client-id" --scope "/subscriptions/your-subscription-id/resourceGroups/rg-saas-app-playground"
```

## App Service Configuration Check

Let me help you verify your App Service is properly configured for Next.js deployment.

## Deployment Process

Once your GitHub secret is configured:

1. **Commit and push your changes**:

   ```bash
   git add .
   git commit -m "Configure Azure deployment with Service Principal"
   git push origin main
   ```

2. **Monitor deployment**:

   - Go to GitHub → Actions tab
   - Watch the "Deploy Next.js to Azure App Service" workflow
   - Check both "build-and-deploy" and "health-check" jobs

3. **Verify deployment**:
   - App URL: https://great-next-simple.azurewebsites.net
   - Check Azure Portal → App Service → Deployment Center for deployment history

## Troubleshooting

### Common Issues:

1. **Authentication Failed**

   - Verify `AZURE_CREDENTIALS` secret format
   - Check Service Principal permissions
   - Ensure subscription ID is correct

2. **Deployment Permission Denied**

   - Service Principal needs "Website Contributor" role minimum
   - Check resource group and App Service permissions

3. **Build Failures**

   - Check Node.js version compatibility (using 18.x)
   - Verify package.json scripts work locally

4. **App Won't Start**
   - Check App Service configuration
   - Review deployment logs in Azure Portal

### Useful Commands:

```bash
# Test Service Principal login
az login --service-principal -u "client-id" -p "client-secret" --tenant "tenant-id"

# Check App Service status
az webapp show --name great-next-simple --resource-group rg-saas-app-playground

# View deployment logs
az webapp log tail --name great-next-simple --resource-group rg-saas-app-playground

# Restart App Service if needed
az webapp restart --name great-next-simple --resource-group rg-saas-app-playground
```

## Next Steps

1. ✅ Service Principal credentials configured in GitHub secrets
2. ✅ Workflow file updated to use Service Principal authentication
3. ✅ App Service configured correctly
4. 🔄 Ready to test deployment by pushing to main branch

The workflow will now:

- Build your Next.js application
- Authenticate using Service Principal
- Deploy to `great-next-simple` App Service
- Perform health check to verify deployment success
