# Script PowerShell para convertir PNG a JPEG usando .NET
Add-Type -AssemblyName System.Drawing

$sourceDir = "public\images\Renders-3D\Melted-Faces"
$destDir = "public\images\previews"

Write-Host "🔄 Convirtiendo imágenes PNG a JPEG..." -ForegroundColor Green

# Crear directorio de destino si no existe
if (!(Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir | Out-Null
}

# Convertir cada archivo PNG a JPEG
for ($i = 1; $i -le 7; $i++) {
    $inputFile = "$sourceDir\$i.png"
    $outputFile = "$destDir\melted-faces-$i.jpg"
    
    if (Test-Path $inputFile) {
        Write-Host "📸 Convirtiendo: $inputFile -> $outputFile" -ForegroundColor Yellow
        
        try {
            # Cargar imagen PNG
            $image = [System.Drawing.Image]::FromFile((Resolve-Path $inputFile))
            
            # Guardar como JPEG con calidad 90%
            $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
            $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
            $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 90L)
            
            $image.Save($outputFile, $jpegCodec, $encoderParams)
            $image.Dispose()
            
            Write-Host "✅ Convertido: melted-faces-$i.jpg" -ForegroundColor Green
        }
        catch {
            Write-Host "❌ Error al convertir: $inputFile - $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    else {
        Write-Host "⚠️  No se encontró: $inputFile" -ForegroundColor Yellow
    }
}

Write-Host "🎉 Conversión completada!" -ForegroundColor Green
Write-Host "📁 Las imágenes convertidas están en: $destDir" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Ahora actualiza las rutas en siteContent.i18n.js:" -ForegroundColor White
Write-Host "meltedFaces: {" -ForegroundColor Gray
Write-Host "  slides: [" -ForegroundColor Gray
Write-Host '    "/images/previews/melted-faces-1.jpg",' -ForegroundColor Gray
Write-Host '    "/images/previews/melted-faces-2.jpg",' -ForegroundColor Gray
Write-Host '    "/images/previews/melted-faces-3.jpg",' -ForegroundColor Gray
Write-Host '    "/images/previews/melted-faces-4.jpg",' -ForegroundColor Gray
Write-Host '    "/images/previews/melted-faces-5.jpg",' -ForegroundColor Gray
Write-Host '    "/images/previews/melted-faces-6.jpg",' -ForegroundColor Gray
Write-Host '    "/images/previews/melted-faces-7.jpg",' -ForegroundColor Gray
Write-Host "  ]," -ForegroundColor Gray
Write-Host "}," -ForegroundColor Gray
