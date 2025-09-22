# 🔐 GitHub Secrets Setup Guide

Your deployment failed because the required secrets are not configured in GitHub. Here's how to fix it:

## 📋 Required Information

You need to add **ONE** secret to your GitHub repository:

### Secret Name: `AZURE_CREDENTIALS`

**Format**: JSON object with your Service Principal details

```json
{
  "clientId": "your-service-principal-client-id",
  "clientSecret": "your-service-principal-client-secret",
  "subscriptionId": "23c26355-2ae1-48ee-9887-96afebd34a99",
  "tenantId": "8c56bf2f-5d15-4c9d-bd82-3fadf274494c"
}
```

## 🔍 How to Find Your Service Principal Details

Since you mentioned you already have a Service Principal, you need to locate these values:

### Option 1: If you have the Service Principal details

Replace the placeholders in the JSON above with your actual values:

- `clientId`: Your Service Principal's Application (client) ID
- `clientSecret`: Your Service Principal's client secret
- `subscriptionId`: Already filled (23c26355-2ae1-48ee-9887-96afebd34a99)
- `tenantId`: Already filled (8c56bf2f-5d15-4c9d-bd82-3fadf274494c)

### Option 2: Create a new Service Principal (if needed)

If you need to create a new Service Principal, run these commands:

```bash
# Create a new Service Principal for your App Service
az ad sp create-for-rbac --name "github-actions-great-next-simple" --role "Website Contributor" --scopes "/subscriptions/23c26355-2ae1-48ee-9887-96afebd34a99/resourceGroups/rg-saas-app-playground/providers/Microsoft.Web/sites/great-next-simple" --json-auth

# This will output JSON in the format you need for AZURE_CREDENTIALS secret
```

## 🚀 Add Secret to GitHub

1. **Go to your GitHub repository**: https://github.com/Faheem-Ahmad/ActiveNextJS

2. **Navigate to**: Settings → Secrets and variables → Actions

3. **Click**: "New repository secret"

4. **Add the secret**:

   - **Name**: `AZURE_CREDENTIALS`
   - **Value**: The complete JSON object (replace with your actual values):

   ```json
   {
     "clientId": "your-actual-client-id-here",
     "clientSecret": "your-actual-client-secret-here",
     "subscriptionId": "23c26355-2ae1-48ee-9887-96afebd34a99",
     "tenantId": "8c56bf2f-5d15-4c9d-bd82-3fadf274494c"
   }
   ```

5. **Click**: "Add secret"

## ✅ Test the Deployment

After adding the secret:

1. **Trigger a new deployment**:

   ```bash
   # Make a small change and push
   git commit --allow-empty -m "Trigger deployment with configured secrets"
   git push origin main
   ```

2. **Monitor progress**: Go to GitHub Actions tab to watch the deployment

3. **Check your app**: https://great-next-simple.azurewebsites.net

## 🔧 Troubleshooting

### If you don't have Service Principal details:

- Check your Azure Portal → Azure Active Directory → App registrations
- Look for any app registrations you created for this project
- Or run the `az ad sp create-for-rbac` command above to create a new one

### If deployment still fails:

- Verify the JSON format is exact (no extra spaces/commas)
- Ensure the Service Principal has "Website Contributor" role on your App Service
- Check that all values are correct (no placeholder text remaining)

## 📝 Current Status

- ✅ Azure subscription and tenant IDs identified
- ✅ Workflow file ready (`azure-app-service-deploy.yml`)
- ✅ Azure-generated workflow disabled to avoid conflicts
- 🔄 Waiting for `AZURE_CREDENTIALS` secret configuration

Once you add the secret, your deployment will work automatically! 🎉
