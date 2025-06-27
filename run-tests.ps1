$testFiles = Get-ChildItem -Path ".\test" -Filter *.json

foreach ($file in $testFiles) {
    Write-Host "`n====================="
    Write-Host "Testing: $($file.Name)"
    Write-Host "====================="

    $response = curl.exe -s -X POST http://localhost:3000/api/identify `
        -H "Content-Type: application/json" `
        -d "@test\$($file.Name)"
    
    Write-Host $response
}
