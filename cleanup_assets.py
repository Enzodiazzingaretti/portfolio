import os
import re

# Mapping of old filenames to new filenames in public/images/portfolio/
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

def cleanup_assets():
    portfolio_dir = "public/images/portfolio"
    content_file = "src/siteContent.i18n.js"

    # 1. Rename files in portfolio directory
    if not os.path.exists(portfolio_dir):
        print(f"Error: Directory {portfolio_dir} not found.")
        return

    print(f"Starting renaming in {portfolio_dir}...")
    renamed_count = 0
    for old_name, new_name in mapping.items():
        old_path = os.path.join(portfolio_dir, old_name)
        new_path = os.path.join(portfolio_dir, new_name)
        
        if os.path.exists(old_path):
            try:
                os.rename(old_path, new_path)
                print(f"Renamed: {old_name} -> {new_name}")
                renamed_count += 1
            except Exception as e:
                print(f"Failed to rename {old_name}: {e}")
        else:
            # It might have been already renamed if the script is re-run
            if not os.path.exists(new_path):
                print(f"Warning: File {old_name} not found and {new_name} doesn't exist either.")
            else:
                print(f"Skipped: {old_name} already renamed to {new_name}")

    print(f"Finished renaming. {renamed_count} files renamed.")

    # 2. Update siteContent.i18n.js
    if not os.path.exists(content_file):
        print(f"Error: Content file {content_file} not found.")
        return

    print(f"Updating {content_file}...")
    with open(content_file, 'r', encoding='utf-8') as f:
        content = f.read()

    updated_count = 0
    # We need to be careful with replacements to avoid partial matches.
    # Since these are paths, we can replace the whole segment.
    for old_name, new_name in mapping.items():
        # Search for the pattern /images/portfolio/filename
        pattern = re.escape(f"/images/portfolio/{old_name}")
        replacement = f"/images/portfolio/{new_name}"
        
        if re.search(pattern, content):
            content = re.sub(pattern, replacement, content)
            updated_count += 1
            print(f"Updated path: {old_name} -> {new_name}")

    if updated_count > 0:
        with open(content_file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Successfully updated {updated_count} paths in {content_file}.")
    else:
        print("No paths were updated in the content file.")

if __name__ == "__main__":
    cleanup_assets()
