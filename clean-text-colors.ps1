# Clean text gradient classes - replace with simple colors

$files = Get-ChildItem -Path "d:\my website\AT-CS\src" -Recurse -Filter "*.jsx"

$replacements = @{
    'text-gradient-cyan' = 'text-cyan-400'
    'text-gradient-blue' = 'text-blue-400'
    'text-gradient-green' = 'text-green-400'
    'text-gradient-purple' = 'text-purple-400'
    'text-gradient-violet' = 'text-violet-400'
    'text-gradient-orange' = 'text-orange-400'
    'bg-gradient-orange' = 'bg-slate-900'
}

foreach ($file in $files) {
    Write-Host "Processing: $($file.Name)"
    $content = Get-Content $file.FullName -Raw
    
    $modified = $false
    foreach ($old in $replacements.Keys) {
        if ($content -match $old) {
            $new = $replacements[$old]
            $content = $content -replace $old, $new
            $modified = $true
        }
    }
    
    if ($modified) {
        Set-Content $file.FullName $content -NoNewline
        Write-Host "  Updated"
    }
}

Write-Host "Done"
