/**
 * This script generates all required icon sizes from the SVG file
 * Install dependencies: npm install sharp
 * Run: node generate-icons.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Icon sizes to generate
const sizes = [
  { name: 'favicon.png', size: 64 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 }
];

async function generateIcons() {
  const svgBuffer = fs.readFileSync(path.join(__dirname, 'favicon.svg'));
  
  for (const icon of sizes) {
    await sharp(svgBuffer)
      .resize(icon.size, icon.size)
      .png()
      .toFile(path.join(__dirname, icon.name));
      
    console.log(`Generated ${icon.name} (${icon.size}x${icon.size})`);
  }
  
  console.log('All icons generated successfully!');
}

generateIcons().catch(err => console.error('Error generating icons:', err)); 