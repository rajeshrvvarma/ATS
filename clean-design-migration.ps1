# Clean Professional Design Migration Script
# Replaces all gradient backgrounds with clean solid colors

$files = @(
    "src\pages\HomePage.jsx",
    "src\pages\WorkshopPage.jsx",
    "src\pages\ContactUsPage.jsx",
    "src\pages\CancellationRefundPage.jsx",
    "src\pages\UpcomingBatchesPage.jsx",
    "src\pages\CollegeTrainingLandingPage.jsx",
    "src\pages\DefensiveBootcampLandingPage.jsx",
    "src\pages\DefensiveMasteryLandingPage.jsx",
    "src\pages\OffensiveBootcampLandingPage.jsx",
    "src\pages\OffensiveMasteryLandingPage.jsx",
    "src\pages\SpecializedCoursesLandingPage.jsx",
    "src\pages\TechnologyTrainingLandingPage.jsx",
    "src\components\DashboardLayout.jsx"
)

$replacements = @{
    'bg-gradient-blue' = 'bg-slate-900'
    'bg-gradient-sky' = 'bg-slate-900'
    'bg-gradient-cyan' = 'bg-slate-900'
    'bg-gradient-teal' = 'bg-slate-900'
    'bg-gradient-purple' = 'bg-slate-900'
    'bg-gradient-indigo' = 'bg-slate-900'
    'bg-gradient-violet' = 'bg-slate-900'
    'bg-gradient-slate' = 'bg-slate-900'
    'bg-gradient-dark' = 'bg-slate-900'
    'bg-gradient-navy' = 'bg-slate-900'
}

foreach ($file in $files) {
    $filePath = "d:\my website\AT-CS\$file"
    if (Test-Path $filePath) {
        Write-Host "Processing: $file"
        $content = Get-Content $filePath -Raw
        
        foreach ($old in $replacements.Keys) {
            $new = $replacements[$old]
            $content = $content -replace $old, $new
        }
        
        Set-Content $filePath $content -NoNewline
        Write-Host "Completed"
    }
}

Write-Host "Done"
