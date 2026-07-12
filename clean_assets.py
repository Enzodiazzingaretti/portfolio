import os
import re

# Define the mapping of old filenames to new filenames
mapping = {
    # Web Projects
    "cdj.png": "cdj-press-kit.png",
    "IMG-20241128-WA0034.jpg": "portrait-enzo.jpg",
    "VID_20250916_111120_576.mp4": "rather-modular-video.mp4",
    "ChatGPT Image 24 jul 2025, 22_41_08.png": "portfolio-hero.png",
    "room.jpg": "room-render.jpg",
    "triptico.png": "flyer-triptych.png",
    
    # Visual Works
    "caras (1).png": "kexxy-identity-1.png",
    "caras (2).png": "kexxy-identity-2.png",
    "caras (3).png": "kexxy-identity-3.png",
    "caras (4).png": "kexxy-identity-4.png",
    "IMG_20240730_142351_423.jpg": "blender-render-2.jpg",
    "IMG_20240712_123444_483.webp": "blender-render-1.webp",
    "triptico1.png": "flyer-triptych-1.png",
    "under1.png": "underground-1.png",
    "under2.png": "underground-2.png",
    "wea metalica.png": "metallic-swarm-3.png",
    "plastic (1).png": "plastic-study-1.png",
    "plastic (2).png": "plastic-study-2.png",
    
    # TouchDesigner
    "rathermodular (1).mp4": "rather-modular-1.mp4",
    "rathermodular (1).webp": "rather-modular-1.webp",
    "Semaforo.mp4": "pulse-vandal.mp4",
    "goteoz.mp4": "goteoz.mp4",
    "prueba123.mp4": "ghost-tunnel.mp4",
    "prueba1234.mp4": "ghost-tunnel-2.mp4",
    "prueba1.png": "static-veil-1.png",
    "prueba2.png": "static-veil-2.png",
    "prueba12345.mp4": "void-engine.mp4",
    "rathermodular (2).mp4": "rather-modular-2.mp4",
    "rathermodular (2).png": "rather-modular-2.png",
    "rathermodular (3).png": "rather-modular-3.png",
    "prueba123456.mp4": "void-engine-2.mp4",
    "123 (2)-2.png": "void-engine-final.png",
    
    # Blender
    "golden (1).png": "golden-faces-1.png",
    "golden (2).png": "golden-faces-2.png",
    "golden (3).png": "golden-faces-3.png",
    "rathermodular (1).png": "rather-modular-1.png",
    "rathermodular (4).png": "rather-modular-4.png",
    "rathermodular (5).png": "rather-modular-5.png",
    "rathermodular (6).png": "rather-modular-6.png",
    "calvaria (1).webp": "calvaria-1.webp",
    "calvaria (1).jpg": "calvaria-1.jpg",
    "calvaria (2).jpg": "calvaria-2.jpg",
    "untitled (1).png": "metallic-swarm-1.png",
    "untitled.png": "metallic-swarm-2.png",
    "untitled2.png": "metallic-swarm-4.png",
}

def rename_files(directory, mapping):
    print(f"Renaming files in {directory}...")
    count = 0
    for old_name, new_name in mapping.items():
        old_path = os.path.join(directory, old_name)
        new_path = os.path.join(directory, new_name)
        if os.path.exists(old_path):
            os.rename(old_path, new_path)
            print(f"  [OK] {old_name} -> {new_name}")
            count += 1
        else:
            # Check if it's already renamed or if it's just missing
            if os.path.exists(new_path):
                print(f"  [SKIP] {old_name} already exists as {new_name}")
            else:
                print(f"  [NOT FOUND] {old_name}")
    print(f"Renamed {count} files.")

def update_content_file(file_path, mapping):
    print(f"Updating paths in {file_path}...")
    if not os.path.exists(file_path):
        print(f"  [ERROR] File {file_path} not found.")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    count = 0
    # We need to handle the paths carefully. The paths in the file look like '/images/portfolio/filename.ext'
    # We should replace the filename part.
    
    # Sort mapping by length descending to avoid partial replacements if any
    sorted_keys = sorted(mapping.keys(), key=len, reverse=True)

    for old_name in sorted_keys:
        new_name = mapping[old_name]
        # Use regex to match the filename in a path context (e.g., /images/portfolio/old_name.ext)
        # This avoids replacing parts of strings that aren't filenames
        pattern = r'(/images/portfolio/)' + re.escape(old_name)
        replacement = r'\1' + new_name
        
        new_content, n = re.subn(pattern, replacement, content)
        if n > 0:
            content = new_content
            count += n

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {count} path references.")

if __name__ == "__main__":
    image_dir = "public/images/portfolio"
    content_file = "src/siteContent.i18n.js"
    
    rename_files(image_dir, mapping)
    update_content_file(content_file, mapping)
