#!/bin/bash

# Script para convertir imágenes PNG a JPEG usando FFmpeg
# FFmpeg suele estar más disponible que ImageMagick

SOURCE_DIR="public/images/Renders-3D/Melted-Faces"
DEST_DIR="public/images/previews"

echo "🔄 Convirtiendo imágenes PNG a JPEG con FFmpeg..."

# Verificar si FFmpeg está instalado
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ Error: FFmpeg no está instalado."
    echo "💡 Descargalo desde: https://ffmpeg.org/download.html"
    exit 1
fi

# Crear directorio de destino si no existe
mkdir -p "$DEST_DIR"

# Convertir cada archivo PNG a JPEG
for i in {1..7}; do
    input_file="$SOURCE_DIR/$i.png"
    output_file="$DEST_DIR/melted-faces-$i.jpg"
    
    if [ -f "$input_file" ]; then
        echo "📸 Convirtiendo: $input_file -> $output_file"
        ffmpeg -i "$input_file" -q:v 2 "$output_file" -y 2>/dev/null
        
        if [ -f "$output_file" ]; then
            echo "✅ Convertido: melted-faces-$i.jpg"
        else
            echo "❌ Error al convertir: $input_file"
        fi
    else
        echo "⚠️  No se encontró: $input_file"
    fi
done

echo "🎉 Conversión completada!"
echo "📁 Las imágenes convertidas están en: $DEST_DIR"
