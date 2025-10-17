# Enhanced Module Status Management Script
# Automatically syncs both modules.json files

param(
    [Parameter(Mandatory=$true)]
    [string]$ModuleIds,

    [Parameter(Mandatory=$true)]
    [ValidateSet("active", "hidden", "archived")]
    [string]$Status,

    [string]$Reason = ""
)

Write-Host "=== Enhanced Module Management ===" -ForegroundColor Cyan
Write-Host "Status: $Status" -ForegroundColor Yellow
Write-Host "Modules: $ModuleIds" -ForegroundColor Yellow
if ($Reason) {
    Write-Host "Reason: $Reason" -ForegroundColor Yellow
}
Write-Host ""

try {
    # Step 1: Update root modules.json
    Write-Host "Step 1: Updating modules.json..." -ForegroundColor Green
    $modules = Get-Content ".\modules.json" -Raw | ConvertFrom-Json
    $moduleIdArray = $ModuleIds -split ","
    $updatedCount = 0

    foreach ($moduleId in $moduleIdArray) {
        $moduleId = $moduleId.Trim()
        $module = $modules | Where-Object { $_.id -eq $moduleId }

        if ($module) {
            $oldStatus = if ($module.status) { $module.status } else { "active (default)" }
            $module.status = $Status

            # Add reason if provided
            if ($Reason -and $Status -ne "active") {
                $reasonField = if ($Status -eq "hidden") { "hiddenReason" } else { "archivedReason" }
                $module | Add-Member -NotePropertyName $reasonField -NotePropertyValue $Reason -Force
            }

            Write-Host "  ✓ $moduleId`: $oldStatus -> $Status" -ForegroundColor Cyan
            $updatedCount++
        } else {
            Write-Warning "  Module '$moduleId' not found"
        }
    }

    if ($updatedCount -eq 0) {
        Write-Warning "No modules were updated"
        exit 1
    }

    # Step 2: Save root modules.json
    Write-Host "Step 2: Saving modules.json..." -ForegroundColor Green
    $jsonOutput = $modules | ConvertTo-Json -Depth 10 -Compress:$false
    $jsonOutput | Out-File ".\modules.json" -Encoding UTF8 -Force

    # Step 3: Copy to public directory
    Write-Host "Step 3: Syncing to public/modules.json..." -ForegroundColor Green
    Copy-Item ".\modules.json" ".\public\modules.json" -Force

    # Step 4: Verify both files
    Write-Host "Step 4: Verifying sync..." -ForegroundColor Green
    $publicModules = Get-Content ".\public\modules.json" -Raw | ConvertFrom-Json

    $rootHidden = ($modules | Where-Object { $_.status -eq "hidden" }).Count
    $publicHidden = ($publicModules | Where-Object { $_.status -eq "hidden" }).Count

    if ($rootHidden -eq $publicHidden) {
        Write-Host "Files synced successfully!" -ForegroundColor Green
    } else {
        Write-Error "Sync failed! Root: $rootHidden hidden, Public: $publicHidden hidden"
        exit 1
    }

    # Summary
    $activeCount = ($modules | Where-Object { -not $_.status -or $_.status -eq "active" }).Count
    $hiddenCount = ($modules | Where-Object { $_.status -eq "hidden" }).Count
    $archivedCount = ($modules | Where-Object { $_.status -eq "archived" }).Count
    $totalCount = $modules.Count

    Write-Host ""
    Write-Host "=== Final Status ===" -ForegroundColor Cyan
    Write-Host "Updated $updatedCount module(s)" -ForegroundColor Green
    Write-Host "Active: $activeCount" -ForegroundColor Green
    Write-Host "Hidden: $hiddenCount" -ForegroundColor Yellow
    Write-Host "Archived: $archivedCount" -ForegroundColor Red
    Write-Host "Total: $totalCount" -ForegroundColor White

    Write-Host ""
    Write-Host "Next: Refresh browser to see changes!" -ForegroundColor Blue

} catch {
    Write-Error "Error: $($_.Exception.Message)"
    exit 1
}

Write-Host ""
Write-Host "Module management completed!" -ForegroundColor Green