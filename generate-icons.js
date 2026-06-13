const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

// Define colors for the brand
const brandColor = '#1A6B2A'; // Green from manifest

async function generateIcons() {
  try {
    // Create a simple SVG logo if logo.png doesn't exist, or use a colored square
    const svgIcon = `
      <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
        <rect width="512" height="512" fill="${brandColor}"/>
        <text x="256" y="280" font-size="180" font-weight="bold" text-anchor="middle" fill="white" font-family="Arial">CMP</text>
      </svg>
    `;

    // Generate 192x192 icon
    console.log('Generating icon-192x192.png...');
    await sharp(Buffer.from(svgIcon))
      .png()
      .resize(192, 192, { fit: 'cover' })
      .toFile(path.join(publicDir, 'icon-192x192.png'));

    // Generate 512x512 icon
    console.log('Generating icon-512x512.png...');
    await sharp(Buffer.from(svgIcon))
      .png()
      .resize(512, 512, { fit: 'cover' })
      .toFile(path.join(publicDir, 'icon-512x512.png'));

    // Generate apple-touch-icon
    console.log('Generating apple-touch-icon.png...');
    await sharp(Buffer.from(svgIcon))
      .png()
      .resize(180, 180, { fit: 'cover' })
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));

    console.log('✓ All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
