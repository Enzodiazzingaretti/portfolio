# Script simple para convertir PNG a JPEG sin permisos especiales
# Usa el método más básico posible

Write-Host "🔄 Iniciando conversión de imágenes..." -ForegroundColor Green

# Rutas
$sourceDir = "public\images\Renders-3D\Melted-Faces"
$destDir = "public\images\previews"

# Verificar que exista el directorio origen
if (!(Test-Path $sourceDir)) {
    Write-Host "❌ No existe el directorio: $sourceDir" -ForegroundColor Red
    exit 1
}

# Crear directorio destino
if (!(Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir | Out-Null
    Write-Host "📁 Creado directorio: $destDir" -ForegroundColor Cyan
}

# Lista de archivos a convertir
$files = @("1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png")

foreach ($file in $files) {
    $sourceFile = Join-Path $sourceDir $file
    $destFile = Join-Path $destDir ($file.Replace(".png", ".jpg"))
    
    if (Test-Path $sourceFile) {
        Write-Host "📸 Procesando: $file" -ForegroundColor Yellow
        
        # Intentar cargar y convertir la imagen
        try {
            Add-Type -AssemblyName System.Windows.Forms
            $image = [System.Drawing.Image]::FromFile($sourceFile)
            
            # Guardar como JPEG
            $image.Save($destFile, [System.Drawing.Imaging.ImageFormat]::Jpeg)
            $image.Dispose()
            
            Write-Host "✅ Convertido: $($file.Replace('.png', '.jpg'))" -ForegroundColor Green
        }
        catch {
            Write-Host "❌ Error con $file : $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    else {
        Write-Host "⚠️  No encontrado: $file" -ForegroundColor Yellow
    }
}

Write-Host "🎉 Proceso completado!" -ForegroundColor Green
Write-Host "📁 Revisá los archivos en: $destDir" -ForegroundColor Cyan
