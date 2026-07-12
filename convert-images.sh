#!/bin/bash

# Script para convertir imágenes PNG a JPEG usando ImageMagick
# Requiere: ImageMagick instalado (sudo apt-get install imagemagick en Linux, brew install imagemagick en Mac)

SOURCE_DIR="public/images/Renders-3D/Melted-Faces"
DEST_DIR="public/images/previews"

echo "🔄 Convirtiendo imágenes PNG a JPEG..."

# Verificar si ImageMagick está instalado
if ! command -v convert &> /dev/null; then
    echo "❌ Error: ImageMagick no está instalado."
    echo "💡 Instalalo con:"
    echo "   - Linux: sudo apt-get install imagemagick"
    echo "   - Mac: brew install imagemagick"
    echo "   - Windows: Descarga desde https://imagemagick.org/script/download.php"
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
        convert "$input_file" -quality 90 "$output_file"
        
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
echo ""
echo "📝 Ahora actualiza las rutas en siteContent.i18n.js:"
echo "meltedFaces: {"
echo "  slides: ["
echo "    \"/images/previews/melted-faces-1.jpg\","
echo "    \"/images/previews/melted-faces-2.jpg\","
echo "    \"/images/previews/melted-faces-3.jpg\","
echo "    \"/images/previews/melted-faces-4.jpg\","
echo "    \"/images/previews/melted-faces-5.jpg\","
echo "    \"/images/previews/melted-faces-6.jpg\","
echo "    \"/images/previews/melted-faces-7.jpg\","
echo "  ],"
echo "},"
