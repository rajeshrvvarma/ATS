# PowerShell script to remove AnimatedBackground from all remaining files
# Run this from: d:\my website\AT-CS

$files = @(
    "src/pages/DefensiveBootcampLandingPage.jsx",
    "src/pages/DefensiveMasteryLandingPage.jsx",
    "src/pages/OffensiveBootcampLandingPage.jsx",
    "src/pages/OffensiveMasteryLandingPage.jsx",
    "src/pages/SpecializedCoursesLandingPage.jsx",
    "src/pages/TechnologyTrainingLandingPage.jsx",
    "src/pages/CollegeTrainingLandingPage.jsx"
)

foreach ($file in $files) {
    Write-Host "Processing $file..." -ForegroundColor Cyan
    
    $content = Get-Content $file -Raw
    
    # Remove import
    $content = $content -replace "import AnimatedBackground from [^;]+;`r?`n", ""
    
    # Replace AnimatedBackground tags with specific gradient mappings
    $content = $content -replace '<AnimatedBackground\s+variant="bootcamp"\s+className="([^"]*)">', '<div className="bg-gradient-purple $1">'
    $content = $content -replace '<AnimatedBackground\s+variant="premium"\s+className="([^"]*)">', '<div className="bg-gradient-violet $1">'
    $content = $content -replace '<AnimatedBackground\s+variant="offensive"\s+className="([^"]*)">', '<div className="bg-gradient-indigo $1">'
    $content = $content -replace '<AnimatedBackground\s+variant="specialized"\s+className="([^"]*)">', '<div className="bg-gradient-cyan $1">'
    $content = $content -replace '<AnimatedBackground\s+variant="contact"\s+className="([^"]*)">', '<div className="bg-gradient-teal $1">'
    $content = $content -replace '<AnimatedBackground\s+variant="programs"\s+className="([^"]*)">', '<div className="bg-gradient-blue $1">'
    $content = $content -replace '<AnimatedBackground\s+variant="success"\s+className="([^"]*)">', '<div className="bg-gradient-teal $1">'
    
    # Replace closing tags
    $content = $content -replace "</AnimatedBackground>", "</div>"
    
    # Fix text colors
    $content = $content -replace 'text-gradient-purple"', 'text-white"'
    $content = $content -replace 'text-gradient-orange"', 'text-white"'
    $content = $content -replace 'text-orange-(\d+)', 'text-indigo-$1'
    $content = $content -replace 'text-pink-(\d+)', 'text-purple-$1'
    
    # Save file
    Set-Content $file -Value $content -NoNewline
    
    Write-Host "Completed $file" -ForegroundColor Green
}

Write-Host "All files processed" -ForegroundColor Green
