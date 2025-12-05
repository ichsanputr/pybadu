# Fix script - Add downloadAsset to all pages that have deleteAsset but not downloadAsset
$pagesPath = "c:\E\ichsan\startup\pybadu\pages"

# Get all .vue files
$files = Get-ChildItem -Path $pagesPath -Filter "*.vue" | Where-Object {
    $content = Get-Content $_.FullName -Raw
    # Has deleteAsset but not downloadAsset in composable
    $content -match 'deleteAsset,' -and $content -notmatch 'downloadAsset,'
}

Write-Host "Found $($files.Count) files to fix"

foreach ($file in $files) {
    Write-Host "Fixing: $($file.Name)"
    $content = Get-Content $file.FullName -Raw
    
    # Replace deleteAsset, with deleteAsset,\n  downloadAsset,
    $content = $content -replace '(\s+)deleteAsset,(\s+)', '$1deleteAsset,$2$1downloadAsset,$2'
    
    Set-Content -Path $file.FullName -Value $content -NoNewline
    Write-Host "  Done"
}

Write-Host ""
Write-Host "Done! Fixed $($files.Count) files."
Write-Host "Now all pages should have downloadAsset support!"
