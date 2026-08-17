# Script to download and setup Maven
$mavenVersion = "3.9.6"
$mavenUrl = "https://archive.apache.org/dist/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip"
$downloadPath = ".\apache-maven-$mavenVersion-bin.zip"
$extractPath = ".\maven"

Write-Host "=== Maven Setup Script ===" -ForegroundColor Cyan
Write-Host ""

# Check if Maven is already installed
if (Test-Path "$extractPath\apache-maven-$mavenVersion\bin\mvn.cmd") {
    Write-Host "Maven is already installed!" -ForegroundColor Green
    Write-Host "Location: $extractPath\apache-maven-$mavenVersion" -ForegroundColor Yellow
    exit 0
}

# Download Maven
Write-Host "Downloading Maven $mavenVersion..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri $mavenUrl -OutFile $downloadPath -UseBasicParsing
    Write-Host "Download complete!" -ForegroundColor Green
} catch {
    Write-Host "Download failed!" -ForegroundColor Red
    exit 1
}

# Extract Maven
Write-Host "Extracting Maven..." -ForegroundColor Yellow
try {
    Expand-Archive -Path $downloadPath -DestinationPath $extractPath -Force
    Write-Host "Extraction complete!" -ForegroundColor Green
} catch {
    Write-Host "Extraction failed!" -ForegroundColor Red
    exit 1
}

# Clean up
Remove-Item $downloadPath -Force
Write-Host "Cleanup complete!" -ForegroundColor Green

Write-Host ""
Write-Host "=== Maven installed successfully! ===" -ForegroundColor Green
Write-Host "Location: $extractPath\apache-maven-$mavenVersion" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next: Run the backend with start-backend.bat" -ForegroundColor Cyan
