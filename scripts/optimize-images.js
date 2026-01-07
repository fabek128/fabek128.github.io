import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Sizes for responsive images
const sizes = [
  { name: 'mobile', width: 128 },
  { name: 'tablet', width: 224 },
  { name: 'desktop', width: 448 }
];

async function optimizeProfileImage() {
  const inputPath = join(rootDir, 'public', 'fbk14.png');
  const outputDir = join(rootDir, 'public');

  // Check if input file exists
  if (!fs.existsSync(inputPath)) {
    console.error('❌ Error: fbk14.png not found in public/');
    process.exit(1);
  }

  console.log('🖼️  Optimizing profile image...\n');

  try {
    // Get original image metadata
    const metadata = await sharp(inputPath).metadata();
    console.log(`📏 Original: ${metadata.width}x${metadata.height} (${metadata.format})`);
    console.log(`📦 Size: ${(fs.statSync(inputPath).size / 1024).toFixed(2)} KB\n`);

    // Generate WebP versions in different sizes
    for (const size of sizes) {
      const outputPath = join(outputDir, `fbk14-${size.name}.webp`);

      await sharp(inputPath)
        .resize(size.width, size.width, {
          fit: 'cover',
          position: 'center'
        })
        .webp({ quality: 85 })
        .toFile(outputPath);

      const stats = fs.statSync(outputPath);
      console.log(`✅ ${size.name}: ${size.width}x${size.width} → ${(stats.size / 1024).toFixed(2)} KB`);
    }

    // Generate a default WebP version (original size, up to 512px)
    const defaultSize = Math.min(metadata.width, 512);
    const defaultPath = join(outputDir, 'fbk14.webp');

    await sharp(inputPath)
      .resize(defaultSize, defaultSize, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 85 })
      .toFile(defaultPath);

    const defaultStats = fs.statSync(defaultPath);
    console.log(`✅ default: ${defaultSize}x${defaultSize} → ${(defaultStats.size / 1024).toFixed(2)} KB`);

    console.log('\n✨ Image optimization complete!');
    console.log('\n📝 Generated files:');
    console.log('   - fbk14.webp (default)');
    console.log('   - fbk14-mobile.webp (128px)');
    console.log('   - fbk14-tablet.webp (224px)');
    console.log('   - fbk14-desktop.webp (448px)');

  } catch (error) {
    console.error('❌ Error optimizing image:', error.message);
    process.exit(1);
  }
}

optimizeProfileImage();
