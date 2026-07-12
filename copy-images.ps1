# Script para copiar imágenes de Melted-Faces a la carpeta images
$source = "public\images\Renders-3D\Melted-Faces"
$dest = "public\images"

for ($i = 1; $i -le 7; $i++) {
    $sourceFile = "$source\$i.png"
    $destFile = "$dest\melted-faces-$i.png"
    Copy-Item $sourceFile $destFile
    Write-Host "Copiado: $sourceFile -> $destFile"
}

Write-Host "¡Todas las imágenes copiadas!"
