# Module Status Management Script
# Usage: .\update-module-status.ps1 -ModuleIds "module-id-1,module-id-2" -Status "hidden"
# Example: .\update-module-status.ps1 -ModuleIds "ruby-on-rails,perl-programming" -Status "archived"

param(
    [Parameter(Mandatory=$true)]
    [string]$ModuleIds,

    [Parameter(Mandatory=$true)]
    [ValidateSet("active", "hidden", "archived")]
    [string]$Status
)

$modulesFile = Join-Path $PSScriptRoot ".." "modules.json"

if (-not (Test-Path $modulesFile)) {
    Write-Error "modules.json not found at: $modulesFile"
    exit 1
}

Write-Host "Loading modules.json..." -ForegroundColor Cyan
$modules = Get-Content $modulesFile -Raw | ConvertFrom-Json

$moduleIdArray = $ModuleIds -split ","
$updatedCount = 0

foreach ($moduleId in $moduleIdArray) {
    $moduleId = $moduleId.Trim()
    $module = $modules | Where-Object { $_.id -eq $moduleId }

    if ($module) {
        # Update or add status field
        if ($module.PSObject.Properties["status"]) {
            $oldStatus = $module.status
            $module.status = $Status
            Write-Host "  Updated '$($module.title)' from '$oldStatus' to '$Status'" -ForegroundColor Green
        } else {
            $module | Add-Member -MemberType NoteProperty -Name "status" -Value $Status
            Write-Host "  Set '$($module.title)' status to '$Status'" -ForegroundColor Green
        }
        $updatedCount++
    } else {
        Write-Warning "  Module ID '$moduleId' not found"
    }
}

if ($updatedCount -gt 0) {
    Write-Host "`nSaving changes to modules.json..." -ForegroundColor Cyan
    $modules | ConvertTo-Json -Depth 10 | Set-Content $modulesFile -Encoding UTF8
    Write-Host "Successfully updated $updatedCount module(s)" -ForegroundColor Green
    Write-Host "`nSummary:" -ForegroundColor Yellow
    Write-Host "  - Status set to: $Status"
    Write-Host "  - Modules updated: $updatedCount"
    Write-Host "`nTip: Clear browser cache to see changes immediately" -ForegroundColor Cyan
} else {
    Write-Host "`nNo modules were updated" -ForegroundColor Yellow
}
