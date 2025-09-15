// scripts/generate-icons.js
const fs = require('fs');
const path = require('path');

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create a simple SVG icon
const svgIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
  <rect width="192" height="192" fill="#3b82f6" rx="20"/>
  <circle cx="96" cy="80" r="20" fill="white"/>
  <rect x="76" y="110" width="40" height="60" fill="white" rx="5"/>
</svg>
`;

// Write the SVG file
fs.writeFileSync(path.join(iconsDir, 'icon.svg'), svgIcon.trim());

console.log('SVG icon created successfully!');
console.log('Please use an online tool or image editor to generate PNG icons in the following sizes:');
console.log('- 192x192');
console.log('- 256x256');
console.log('- 384x384');
console.log('- 512x512');
console.log('Place them in the public/icons directory.');