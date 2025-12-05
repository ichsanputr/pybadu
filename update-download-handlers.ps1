# PowerShell script to add download handler to all compiler pages
$pagesPath = "c:\E\ichsan\startup\pybadu\pages"

# Get all .vue files that use useLibraryPlayground
$files = Get-ChildItem -Path $pagesPath -Filter "*.vue" | Where-Object {
    $content = Get-Content $_.FullName -Raw
    $content -match "useLibraryPlayground" -and $content -match "@deleteAsset"
}

Write-Host "Found $($files.Count) files to update"

foreach ($file in $files) {
    Write-Host "Processing: $($file.Name)"
    $content = Get-Content $file.FullName -Raw
    
    # 1. Add @downloadAsset handler in template (after @deleteAsset)
    if ($content -match '@deleteAsset="deleteAsset"' -and $content -notmatch '@downloadAsset') {
        $content = $content -replace '@deleteAsset="deleteAsset"', '@deleteAsset="deleteAsset" @downloadAsset="downloadAsset"'
        Write-Host "  ✓ Added @downloadAsset handler"
    }
    
    # 2. Add downloadAsset to composable destructure (after deleteAsset,)
    if ($content -match 'deleteAsset,\s*\n' -and $content -notmatch 'downloadAsset,') {
        $content = $content -replace '(deleteAsset,)(\s*\n)', "$1`n    downloadAsset,$2"
        Write-Host "  ✓ Added downloadAsset to destructure"
    }
    
    # Save the file
    Set-Content -Path $file.FullName -Value $content -NoNewline
}

Write-Host "`nDone! Updated $($files.Count) files."
