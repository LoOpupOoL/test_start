
$ErrorActionPreference = "Stop"

$interval = 2
$quietPeriod = 4

Set-Location $PSScriptRoot

git rev-parse --is-inside-work-tree *> $null

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Git repository not found."
    exit 1
}

$branch = git branch --show-current

if (-not $branch) {
    Write-Host "ERROR: No active Git branch."
    exit 1
}

git remote get-url origin *> $null

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: GitHub remote not configured."
    exit 1
}

Write-Host "Auto-sync started on branch: $branch"
Write-Host "Press Ctrl+C to stop."

$lastSnapshot = ""
$lastChange = Get-Date
$pending = $false

while ($true) {

    $snapshot = [string]::Join(
        [Environment]::NewLine,
        @(git status --porcelain --untracked-files=normal)
    )

    if ($snapshot -ne $lastSnapshot) {
        $lastSnapshot = $snapshot
        $lastChange = Get-Date
        $pending = $true
    }

    $elapsed = ((Get-Date) - $lastChange).TotalSeconds

    if ($pending -and $snapshot -and $elapsed -ge $quietPeriod) {

        Write-Host "Changes detected. Syncing..."

        git add -A

        if ($LASTEXITCODE -eq 0) {

            git diff --cached --quiet

            if ($LASTEXITCODE -eq 1) {
                $message = "Auto-sync " + (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
                git commit -m $message
            }

            if ($LASTEXITCODE -eq 0) {

                git pull --rebase --autostash origin $branch

                if ($LASTEXITCODE -eq 0) {

                    git push origin $branch

                    if ($LASTEXITCODE -eq 0) {
                        Write-Host "SUCCESS: Pushed to GitHub."
                    }
                    else {
                        Write-Host "ERROR: Push failed."
                    }
                }
                else {
                    Write-Host "ERROR: Pull failed. Resolve conflicts."
                    break
                }
            }
        }

        $pending = $false
        $lastSnapshot = [string]::Join(
            [Environment]::NewLine,
            @(git status --porcelain --untracked-files=normal)
        )
    }

    Start-Sleep -Seconds $interval
}