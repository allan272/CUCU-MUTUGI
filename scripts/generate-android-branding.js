const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.join(__dirname, '..');
const source = path.join(root, 'public', 'cucumutugi-logo.png');

const targets = [
  { dir: 'android/app/src/main/res/mipmap-mdpi', size: 48 },
  { dir: 'android/app/src/main/res/mipmap-hdpi', size: 72 },
  { dir: 'android/app/src/main/res/mipmap-xhdpi', size: 96 },
  { dir: 'android/app/src/main/res/mipmap-xxhdpi', size: 144 },
  { dir: 'android/app/src/main/res/mipmap-xxxhdpi', size: 192 },
];

async function main() {
  if (!fs.existsSync(source)) {
    throw new Error(`Missing source logo: ${source}`);
  }

  for (const target of targets) {
    const outDir = path.join(root, target.dir);
    fs.mkdirSync(outDir, { recursive: true });

    const outFile = path.join(outDir, 'ic_launcher.png');
    const outRound = path.join(outDir, 'ic_launcher_round.png');
    const outForeground = path.join(outDir, 'ic_launcher_foreground.png');

    await sharp(source)
      .resize(target.size, target.size, {
        fit: 'contain',
        background: '#FFFFFF',
      })
      .png()
      .toFile(outFile);

    await sharp(source)
      .resize(target.size, target.size, {
        fit: 'contain',
        background: '#FFFFFF',
      })
      .png()
      .toFile(outRound);

    await sharp(source)
      .resize(target.size, target.size, {
        fit: 'contain',
        background: '#FFFFFF',
      })
      .png()
      .toFile(outForeground);
  }

  console.log('Android launcher branding updated from cucumutugi logo.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
