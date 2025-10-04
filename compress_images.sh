#!/bin/bash

# Script to compress all images for GitHub upload
# This will reduce file sizes by 80-90% while maintaining good quality

echo "🖼️  Starting image compression..."

# Create backup directory
mkdir -p img_backup
cp -r img/* img_backup/
echo "✅ Backup created in img_backup/"

# Function to compress images
compress_images() {
    local dir=$1
    local max_width=$2
    local quality=$3
    
    echo "📁 Processing $dir with max width: ${max_width}px, quality: ${quality}%"
    
    find "$dir" -name "*.jpg" -o -name "*.jpeg" | while read file; do
        echo "  🔄 Compressing: $(basename "$file")"
        
        # Get original size
        original_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        
        # Compress with sips
        sips -Z "$max_width" -s formatOptions "$quality" "$file" > /dev/null 2>&1
        
        # Get new size
        new_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        
        # Calculate compression ratio
        if [ "$original_size" -gt 0 ]; then
            ratio=$(( (original_size - new_size) * 100 / original_size ))
            echo "    ✅ $(basename "$file"): ${original_size} → ${new_size} bytes (${ratio}% smaller)"
        fi
    done
}

# Compress different directories with different settings
compress_images "img/ALBUM25X35" 1920 85  # Album photos - high quality
compress_images "img/picture" 1920 85     # General photos - high quality  
compress_images "img/desk13x18" 1200 80  # Desk photos - medium quality
compress_images "img/pic60x90" 1200 80   # Gate photos - medium quality

echo ""
echo "📊 Final size check:"
du -sh img/
echo ""
echo "🎉 Image compression completed!"
echo "💡 If still too large, you can:"
echo "   1. Reduce quality further (70-75%)"
echo "   2. Use WebP format"
echo "   3. Upload to CDN (Cloudinary, etc.)"
echo "   4. Use Git LFS for large files"
