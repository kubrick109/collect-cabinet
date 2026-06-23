param(
  [Parameter(Position = 0)]
  [string]$Message
)

$ErrorActionPreference = 'Stop'
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $ProjectRoot

function Stop-WithMessage {
  param([string]$Text)
  Write-Host ""
  Write-Host $Text -ForegroundColor Red
  exit 1
}

function Find-Git {
  $desktopGit = Get-ChildItem `
    -Path "$env:LOCALAPPDATA\GitHubDesktop\app-*\resources\app\git\mingw64\bin\git.exe" `
    -ErrorAction SilentlyContinue |
    Sort-Object FullName -Descending |
    Select-Object -First 1

  if ($desktopGit) {
    $desktopBin = Split-Path -Parent $desktopGit.FullName
    $env:GIT_EXEC_PATH = $desktopBin
    $env:PATH = "$desktopBin;$env:PATH"
    return $desktopGit.FullName
  }

  $systemGit = Get-Command git.exe -ErrorAction SilentlyContinue
  if ($systemGit) {
    return $systemGit.Source
  }

  Stop-WithMessage "Git was not found. Install or open GitHub Desktop, then try again."
}

function Run-Step {
  param(
    [string]$Title,
    [scriptblock]$Action
  )

  Write-Host ""
  Write-Host "==> $Title" -ForegroundColor Cyan
  & $Action
  if ($LASTEXITCODE -ne 0) {
    Stop-WithMessage "$Title failed. Nothing was uploaded."
  }
}

$Git = Find-Git
$Npm = Join-Path $env:ProgramFiles 'nodejs\npm.cmd'
if (-not (Test-Path -LiteralPath $Npm)) {
  $npmCommand = Get-Command npm.cmd -ErrorAction SilentlyContinue
  if (-not $npmCommand) {
    Stop-WithMessage "npm was not found. Install Node.js, then try again."
  }
  $Npm = $npmCommand.Source
}

Write-Host "Collect Cabinet - Publish Update" -ForegroundColor Yellow
Write-Host "This checks the site, creates a Git commit, pushes it to GitHub, and starts deployment."

Run-Step "Checking code quality" { & $Npm run lint }
Run-Step "Building the production website" { & $Npm run build }

$changes = & $Git status --porcelain
if ($LASTEXITCODE -ne 0) {
  Stop-WithMessage "Could not read the Git repository."
}

if (-not $changes) {
  Write-Host ""
  Write-Host "There are no new changes to publish." -ForegroundColor Green
  exit 0
}

if (-not $Message.Trim()) {
  $Message = Read-Host "Describe this update (example: Improve room colors)"
}

if (-not $Message.Trim()) {
  Stop-WithMessage "A short update description is required."
}

Run-Step "Staging changed files" { & $Git add --all }

Write-Host ""
Write-Host "Files included in this update:" -ForegroundColor Yellow
& $Git diff --cached --name-status

$confirmation = Read-Host "Publish these changes? Type Y to continue"
if ($confirmation -notmatch '^(y|yes)$') {
  & $Git restore --staged .
  Write-Host ""
  Write-Host "Publishing cancelled. Your files were not changed." -ForegroundColor Yellow
  exit 0
}

Run-Step "Creating Git commit" { & $Git commit -m $Message.Trim() }

Write-Host ""
Write-Host "==> Uploading to GitHub" -ForegroundColor Cyan
& $Git push origin main
if ($LASTEXITCODE -eq 0) {
  Write-Host ""
  Write-Host "Published successfully." -ForegroundColor Green
  Write-Host "GitHub Actions will now check and deploy the website automatically."
  Write-Host "Website: https://kubrick109.github.io/collect-cabinet/"
  exit 0
}

Write-Host ""
Write-Host "The commit is safe, but automatic upload could not sign in." -ForegroundColor Yellow
$desktop = Join-Path $env:LOCALAPPDATA 'GitHubDesktop\GitHubDesktop.exe'
if (Test-Path -LiteralPath $desktop) {
  Start-Process -FilePath $desktop -ArgumentList "`"$ProjectRoot`""
  Write-Host "GitHub Desktop has been opened. Click Push origin once."
} else {
  Write-Host "Open GitHub Desktop, select Collect Cabinet, and click Push origin."
}
exit 1
