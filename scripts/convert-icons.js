// scripts/convert-icons.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Define sizes for PNG icons
const sizes = [192, 256, 384, 512];

// Convert SVG to PNG for each size
async function convertIcons() {
  const svgPath = path.join(iconsDir, 'icon.svg');
  
  if (!fs.existsSync(svgPath)) {
    console.error('SVG icon not found. Please run generate-icons.js first.');
    return;
  }
  
  for (const size of sizes) {
    try {
      const pngPath = path.join(iconsDir, `icon-${size}x${size}.png`);
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(pngPath);
      console.log(`Created ${size}x${size} PNG icon`);
    } catch (error) {
      console.error(`Error creating ${size}x${size} PNG icon:`, error);
    }
  }
  
  console.log('All PNG icons created successfully!');
}

convertIcons();