# PowerShell script to download publish profile for Azure App Service
# Usage: .\get-publish-profile.ps1 -AppName "your-app-name" -ResourceGroup "your-resource-group"

param(
    [Parameter(Mandatory=$true)]
    [string]$AppName,
    
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroup,
    
    [string]$OutputFile = "publish-profile.xml"
)

Write-Host "Downloading publish profile for App Service: $AppName" -ForegroundColor Green

try {
    # Download publish profile
    az webapp deployment list-publishing-profiles --name $AppName --resource-group $ResourceGroup --xml > $OutputFile
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Publish profile downloaded successfully to: $OutputFile" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Yellow
        Write-Host "1. Copy the content of $OutputFile" -ForegroundColor White
        Write-Host "2. Go to GitHub → Your Repository → Settings → Secrets and variables → Actions" -ForegroundColor White
        Write-Host "3. Click 'New repository secret'" -ForegroundColor White
        Write-Host "4. Name: AZURE_WEBAPP_PUBLISH_PROFILE" -ForegroundColor White
        Write-Host "5. Value: Paste the entire content of $OutputFile" -ForegroundColor White
        Write-Host ""
        Write-Host "Content preview:" -ForegroundColor Cyan
        Get-Content $OutputFile | Select-Object -First 5
        Write-Host "..." -ForegroundColor Gray
    } else {
        Write-Host "❌ Failed to download publish profile" -ForegroundColor Red
        Write-Host "Please check your App Service name and resource group" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Clean up temporary file option
$cleanup = Read-Host "Do you want to delete the local publish profile file? (y/N)"
if ($cleanup -eq 'y' -or $cleanup -eq 'Y') {
    Remove-Item $OutputFile -ErrorAction SilentlyContinue
    Write-Host "Local file deleted." -ForegroundColor Green
}