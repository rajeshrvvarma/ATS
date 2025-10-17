# List Modules by Status
# Usage: .\list-modules.ps1
# Usage: .\list-modules.ps1 -Status "hidden"
# Usage: .\list-modules.ps1 -Category "Programming Foundation"

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("active", "hidden", "archived", "all")]
    [string]$Status = "all",

    [Parameter(Mandatory=$false)]
    [string]$Category = ""
)

$modulesFile = Join-Path $PSScriptRoot ".." "modules.json"

if (-not (Test-Path $modulesFile)) {
    Write-Error "modules.json not found at: $modulesFile"
    exit 1
}

Write-Host "Loading modules.json..." -ForegroundColor Cyan
$modules = Get-Content $modulesFile -Raw | ConvertFrom-Json

# Filter by status
$filteredModules = $modules | ForEach-Object {
    $moduleStatus = if ($_.PSObject.Properties["status"]) { $_.status } else { "active" }

    if ($Status -eq "all" -or $moduleStatus -eq $Status) {
        $_ | Add-Member -MemberType NoteProperty -Name "computedStatus" -Value $moduleStatus -Force -PassThru
    }
}

# Filter by category if specified
if ($Category) {
    $filteredModules = $filteredModules | Where-Object { $_.category -eq $Category }
}

# Group by status
$grouped = $filteredModules | Group-Object computedStatus

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "MODULE STATUS REPORT" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Total Modules: $($modules.Count)" -ForegroundColor White
if ($Category) {
    Write-Host "Filtered by Category: $Category" -ForegroundColor Yellow
}
Write-Host ""

foreach ($group in $grouped | Sort-Object Name) {
    $color = switch ($group.Name) {
        "active"   { "Green" }
        "hidden"   { "Yellow" }
        "archived" { "Red" }
        default    { "White" }
    }

    Write-Host "$($group.Name.ToUpper()): $($group.Count) modules" -ForegroundColor $color
    Write-Host "----------------------------------------" -ForegroundColor DarkGray

    foreach ($module in $group.Group | Sort-Object title) {
        $priceStr = "₹$($module.price)"
        Write-Host "  [$priceStr]".PadRight(12) -NoNewline -ForegroundColor DarkGray
        Write-Host "$($module.title)" -ForegroundColor White
        Write-Host "        " -NoNewline
        Write-Host "ID: $($module.id)" -ForegroundColor DarkGray
        Write-Host "        " -NoNewline
        Write-Host "Category: $($module.category)" -ForegroundColor Gray
    }
    Write-Host ""
}

# Show summary
$activeCount = ($modules | Where-Object { -not $_.status -or $_.status -eq "active" }).Count
$hiddenCount = ($modules | Where-Object { $_.status -eq "hidden" }).Count
$archivedCount = ($modules | Where-Object { $_.status -eq "archived" }).Count

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "SUMMARY" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
Write-Host "  Active:   " -NoNewline -ForegroundColor White
Write-Host "$activeCount" -ForegroundColor Green
Write-Host "  Hidden:   " -NoNewline -ForegroundColor White
Write-Host "$hiddenCount" -ForegroundColor Yellow
Write-Host "  Archived: " -NoNewline -ForegroundColor White
Write-Host "$archivedCount" -ForegroundColor Red
Write-Host "  --------"
Write-Host "  Total:    " -NoNewline -ForegroundColor White
Write-Host "$($modules.Count)`n" -ForegroundColor Cyan

# Show categories
Write-Host "Categories:" -ForegroundColor Cyan
$categories = $modules | Group-Object category | Sort-Object Name
foreach ($cat in $categories) {
    Write-Host "  - $($cat.Name): $($cat.Count) modules" -ForegroundColor Gray
}

Write-Host ""
