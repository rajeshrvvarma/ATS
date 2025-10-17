# Module Analysis Script - Shows module categories and suggests modules to hide
# Usage: .\scripts\analyze-modules.ps1

param(
    [switch]$ShowAll,
    [switch]$ShowByCategory,
    [switch]$SuggestHidden
)

$ModulesJsonPath = Join-Path $PSScriptRoot "..\modules.json"

Write-Host "=== Module Analysis Tool ===" -ForegroundColor Cyan
Write-Host ""

# Check if modules.json exists
if (-not (Test-Path $ModulesJsonPath)) {
    Write-Error "modules.json not found at: $ModulesJsonPath"
    exit 1
}

try {
    # Read and parse JSON
    $jsonContent = Get-Content $ModulesJsonPath -Raw -Encoding UTF8
    $modules = $jsonContent | ConvertFrom-Json

    # Get current status counts
    $activeCount = ($modules | Where-Object { -not $_.status -or $_.status -eq "active" }).Count
    $hiddenCount = ($modules | Where-Object { $_.status -eq "hidden" }).Count
    $archivedCount = ($modules | Where-Object { $_.status -eq "archived" }).Count
    $totalCount = $modules.Count

    Write-Host "=== Current Status Summary ===" -ForegroundColor Green
    Write-Host "Total Modules: $totalCount" -ForegroundColor White
    Write-Host "Active: $activeCount" -ForegroundColor Green
    Write-Host "Hidden: $hiddenCount" -ForegroundColor Yellow
    Write-Host "Archived: $archivedCount" -ForegroundColor Red
    Write-Host ""

    if ($ShowByCategory -or $ShowAll) {
        # Group by category
        Write-Host "=== Modules by Category ===" -ForegroundColor Cyan
        $categories = $modules | Group-Object -Property category | Sort-Object Name

        foreach ($category in $categories) {
            $activeInCategory = ($category.Group | Where-Object { -not $_.status -or $_.status -eq "active" }).Count
            $hiddenInCategory = ($category.Group | Where-Object { $_.status -eq "hidden" }).Count

            Write-Host ""
            Write-Host "$($category.Name) ($($category.Count) total, $activeInCategory active, $hiddenInCategory hidden)" -ForegroundColor Yellow

            foreach ($module in $category.Group) {
                $statusDisplay = if ($module.status) { $module.status } else { "active" }
                $statusColor = switch ($statusDisplay) {
                    "active" { "Green" }
                    "hidden" { "Yellow" }
                    "archived" { "Red" }
                    default { "White" }
                }
                Write-Host "  [$statusDisplay] $($module.id) - $($module.title)" -ForegroundColor $statusColor
            }
        }
    }

    if ($SuggestHidden -or $ShowAll) {
        Write-Host ""
        Write-Host "=== Modules You Might Want to Hide ===" -ForegroundColor Magenta
        Write-Host ""

        # Suggest less common technologies
        $suggestionsMap = @{
            "Legacy/Niche Languages" = @("rust-programming", "go-programming", "perl-programming", "ruby-programming")
            "Older Frameworks" = @("angular-js", "jquery-framework", "backbone-js")
            "Less Popular Databases" = @("cassandra-database", "couchdb-database", "riak-database")
            "Specialized Tools" = @("erlang-programming", "haskell-programming", "scala-programming")
            "Enterprise-Heavy" = @("sap-integration", "oracle-database", "ibm-tools")
            "Hardware/Embedded" = @("arduino-programming", "raspberry-pi", "embedded-systems")
        }

        foreach ($suggestionCategory in $suggestionsMap.Keys) {
            $found = @()
            foreach ($moduleId in $suggestionsMap[$suggestionCategory]) {
                $module = $modules | Where-Object { $_.id -like "*$moduleId*" -and (-not $_.status -or $_.status -eq "active") }
                if ($module) {
                    $found += $module
                }
            }

            if ($found.Count -gt 0) {
                Write-Host "${suggestionCategory}:" -ForegroundColor Yellow
                foreach ($module in $found) {
                    Write-Host "  - $($module.id) ($($module.title))" -ForegroundColor Gray
                }
                Write-Host ""
            }
        }

        # Suggest based on naming patterns
        Write-Host "Advanced/Specialized Modules:" -ForegroundColor Yellow
        $advancedModules = $modules | Where-Object {
            ($_.title -like "*Advanced*" -or $_.title -like "*Mastery*" -or $_.title -like "*Expert*") -and
            (-not $_.status -or $_.status -eq "active")
        }
        foreach ($module in $advancedModules) {
            Write-Host "  - $($module.id) ($($module.title))" -ForegroundColor Gray
        }

        Write-Host ""
        Write-Host "💡 To hide modules, use:" -ForegroundColor Blue
        Write-Host "  .\scripts\update-module-status.ps1 -ModuleIds 'module1,module2' -Status 'hidden' -Reason 'Less popular'"
        Write-Host ""
    }

    if (-not $ShowByCategory -and -not $SuggestHidden -and -not $ShowAll) {
        Write-Host "Options:" -ForegroundColor Blue
        Write-Host "  -ShowByCategory  : Show all modules grouped by category"
        Write-Host "  -SuggestHidden   : Suggest modules you might want to hide"
        Write-Host "  -ShowAll         : Show everything"
        Write-Host ""
        Write-Host "Example: .\scripts\analyze-modules.ps1 -SuggestHidden"
    }
}
catch {
    Write-Error "Error analyzing modules: $($_.Exception.Message)"
    exit 1
}

Write-Host ""
Write-Host "Analysis completed!" -ForegroundColor Green