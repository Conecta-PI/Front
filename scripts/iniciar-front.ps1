$ErrorActionPreference = "Stop"

$frontPath = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$packageJson = Join-Path $frontPath "package.json"
$packageLock = Join-Path $frontPath "package-lock.json"

if (-not (Test-Path $packageJson)) {
    throw "package.json nao encontrado em '$frontPath'."
}
Write-Host ""
Write-Host "=== Inicializacao guiada do front-end Conecta ===" -ForegroundColor Cyan
Write-Host "  1 - Primeira vez neste computador: verificar o Node.js e preparar dependencias"
Write-Host "  2 - Ja configurei: continuar o trabalho e iniciar o Expo"
$mode = Read-Host "Escolha 1 ou 2 (Q para sair)"
if ($mode -notin @("1", "2")) {
    Write-Host "Inicializacao cancelada."
    exit 0
}

$nodeModules = Join-Path $frontPath "node_modules"
if (-not (Get-Command npm.cmd -ErrorAction SilentlyContinue)) {
    if ($mode -eq "1") {
        Write-Host "O Node.js LTS nao esta instalado. Ele inclui o npm, necessario para o front." -ForegroundColor Yellow
        Write-Host "Download oficial: https://nodejs.org/en/download"
        try {
            Start-Process "https://nodejs.org/en/download"
        }
        catch {
            Write-Host "Nao foi possivel abrir o navegador automaticamente; copie o endereco informado."
        }
        Write-Host "Instale o Node.js LTS, feche e reabra o PowerShell e execute este assistente novamente."
    }
    else {
        throw "Node.js/npm nao encontrado. Instale o Node.js LTS em https://nodejs.org/en/download, reabra o PowerShell e tente novamente."
    }
    exit 0
}

if ($mode -eq "1") {
    $nodeVersion = (& node.exe --version 2>&1 | Out-String).Trim()
    Write-Host "Node.js $nodeVersion encontrado. O Node.js inclui o npm." -ForegroundColor Green
    Write-Host "Instale o Expo Go no celular pela loja de aplicativos."
}

if (-not (Test-Path $nodeModules)) {
    if (-not (Test-Path $packageLock)) {
        throw "package-lock.json nao encontrado; nao posso instalar dependencias de forma reproduzivel."
    }

    if ($mode -eq "1") {
        $instalar = "s"
        Write-Host ""
        Write-Host "Preparando as dependencias do front com npm ci..."
    }
    else {
        Write-Host ""
        Write-Host "As dependencias do front nao estao instaladas."
        $instalar = Read-Host "Deseja restaura-las agora com npm ci? (S/N)"
    }

    if ($instalar -match "^(s|sim)$") {
        Push-Location $frontPath
        try {
            npm.cmd ci
            if ($LASTEXITCODE -ne 0) {
                throw "A instalacao das dependencias falhou (codigo $LASTEXITCODE). Confira as mensagens acima."
            }
        }
        finally {
            Pop-Location
        }
    }
    else {
        Write-Host "Instale as dependencias com npm ci e execute este assistente novamente."
        exit 1
    }
}

Write-Host ""
Write-Host "Proximos passos:"
Write-Host "  1. Aguarde o QR code e a mensagem de que o Expo esta pronto."
Write-Host "  2. Abra o Expo Go no celular e escaneie o QR code."
Write-Host "  3. O back deve estar ativo na porta 8080."
Write-Host "  4. O celular e o computador precisam estar na mesma rede Wi-Fi."
Write-Host "  5. Entre com o e-mail e a senha da conta do responsavel ja cadastrada."
Write-Host "  6. Para parar o front, pressione Ctrl+C nesta janela."
Write-Host ""

Push-Location $frontPath
try {
    npm.cmd start -- --lan
    if ($LASTEXITCODE -ne 0) {
        throw "O Expo encerrou com codigo $LASTEXITCODE. Confira as mensagens acima."
    }
}
finally {
    Pop-Location
}
