import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const targets = [
  { sourceDirectory: 'public/portfolio/illustrative', width: 480 },
  { sourceDirectory: 'public/portfolio/tarot', width: 480 },
  { sourceDirectory: 'public/portfolio/non-illustrative', width: 480 },
  { sourceDirectory: 'public/portfolio/upcoming', width: 640 },
  { sourceDirectory: 'public', files: ['wizardjuice.gif'], outputDirectory: 'public/thumbs', width: 480 },
];

let generatedCount = 0;

for (const target of targets) {
  const sourceDirectory = path.resolve(target.sourceDirectory);
  const outputDirectory = path.resolve(target.outputDirectory ?? path.join(target.sourceDirectory, 'thumbs'));
  const files = target.files ?? (await fs.readdir(sourceDirectory)).filter((file) => file.endsWith('.webp'));

  await fs.mkdir(outputDirectory, { recursive: true });

  await Promise.all(files.map(async (file) => {
    const sourcePath = path.join(sourceDirectory, file);
    const outputName = file.replace(/\.gif$/i, '.webp');
    const outputPath = path.join(outputDirectory, outputName);

    await sharp(sourcePath)
      .resize({ width: target.width, withoutEnlargement: true })
      .webp({ quality: 72, effort: 4 })
      .toFile(outputPath);
  }));

  generatedCount += files.length;
}

console.log(`Generated ${generatedCount} portfolio thumbnails`);