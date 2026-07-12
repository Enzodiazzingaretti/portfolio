# Script para solucionar problemas de permisos de PowerShell
Write-Host "🔧 Configurando permisos de PowerShell..." -ForegroundColor Yellow

# Mostrar política actual
$currentPolicy = Get-ExecutionPolicy
Write-Host "📋 Política actual: $currentPolicy" -ForegroundColor Cyan

# Cambiar a RemoteSigned para permitir scripts locales
try {
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
    Write-Host "✅ Política cambiada a RemoteSigned para el usuario actual" -ForegroundColor Green
}
catch {
    Write-Host "❌ Error al cambiar la política: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Ejecuta PowerShell como Administrador y corre:" -ForegroundColor Yellow
    Write-Host "   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine -Force" -ForegroundColor Gray
}

# Verificar nueva política
$newPolicy = Get-ExecutionPolicy
Write-Host "📋 Nueva política: $newPolicy" -ForegroundColor Cyan

Write-Host ""
Write-Host "🎉 Ahora podés ejecutar scripts locales!" -ForegroundColor Green
Write-Host "💡 Para ejecutar el script de conversión:" -ForegroundColor White
Write-Host "   .\convert-images.ps1" -ForegroundColor Gray
