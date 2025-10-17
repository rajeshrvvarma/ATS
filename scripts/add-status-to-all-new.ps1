# PowerShell Script to Add Status Field to All Modules
# This script adds "status": "active" to every module that doesn't already have a status field

param(
    [switch]$WhatIf
)

$ModulesJsonPath = ".\modules.json"

Write-Host "=== Add Status Field to All Modules ===" -ForegroundColor Cyan
Write-Host ""

# Check if modules.json exists
if (-not (Test-Path $ModulesJsonPath)) {
    Write-Error "modules.json not found at: $ModulesJsonPath"
    exit 1
}

try {
    # Read and parse JSON
    Write-Host "Reading modules.json..." -ForegroundColor Green
    $jsonContent = Get-Content $ModulesJsonPath -Raw -Encoding UTF8
    $modules = $jsonContent | ConvertFrom-Json

    $totalCount = $modules.Count
    $updatedCount = 0
    $alreadyHadStatus = 0

    Write-Host "Processing $totalCount modules..." -ForegroundColor Green
    Write-Host ""

    foreach ($module in $modules) {
        if (-not $module.PSObject.Properties["status"]) {
            # Add status field
            $module | Add-Member -MemberType NoteProperty -Name "status" -Value "active" -Force
            Write-Host "  Added status to: $($module.id)" -ForegroundColor Green
            $updatedCount++
        } else {
            Write-Host "  Already has status: $($module.id) [$($module.status)]" -ForegroundColor Gray
            $alreadyHadStatus++
        }
    }

    Write-Host ""
    Write-Host "=== Summary ===" -ForegroundColor Cyan
    Write-Host "Total modules: $totalCount" -ForegroundColor White
    Write-Host "Updated (added status): $updatedCount" -ForegroundColor Green
    Write-Host "Already had status: $alreadyHadStatus" -ForegroundColor Yellow

    if ($WhatIf) {
        Write-Host ""
        Write-Host "WhatIf mode - no changes saved" -ForegroundColor Yellow
    } elseif ($updatedCount -gt 0) {
        # Save the updated JSON
        Write-Host ""
        Write-Host "Saving changes to modules.json..." -ForegroundColor Green

        $jsonOutput = $modules | ConvertTo-Json -Depth 10 -Compress:$false
        $jsonOutput | Out-File $ModulesJsonPath -Encoding UTF8 -Force

        Write-Host "Successfully updated modules.json!" -ForegroundColor Green

        # Verify the changes
        Write-Host ""
        Write-Host "Verification:" -ForegroundColor Cyan
        $activeCount = ($modules | Where-Object { $_.status -eq "active" }).Count
        $hiddenCount = ($modules | Where-Object { $_.status -eq "hidden" }).Count
        $archivedCount = ($modules | Where-Object { $_.status -eq "archived" }).Count

        Write-Host "Active modules: $activeCount" -ForegroundColor Green
        Write-Host "Hidden modules: $hiddenCount" -ForegroundColor Yellow
        Write-Host "Archived modules: $archivedCount" -ForegroundColor Red

        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Blue
        Write-Host "  1. All modules now have status field set to active" -ForegroundColor Gray
        Write-Host "  2. Use update-module-status.ps1 to hide specific modules" -ForegroundColor Gray
        Write-Host "  3. Test the module catalog to ensure it still works" -ForegroundColor Gray
    } else {
        Write-Host ""
        Write-Host "No modules needed updating - all already have status field" -ForegroundColor Yellow
    }
} catch {
    Write-Error "Error processing modules: $($_.Exception.Message)"
    exit 1
}

Write-Host ""
Write-Host "Script completed!" -ForegroundColor Green