const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const TARGET_DIR = './public/assets/images';
const MAX_WIDTH = 1920;
const QUALITY = 82;

async function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else if (/\.(jpg|jpeg|png)$/i.test(entry.name)) {
      const outputPath = fullPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');

      try {
        await sharp(fullPath)
          .resize({
            width: MAX_WIDTH,
            withoutEnlargement: true
          })
          .webp({ quality: QUALITY })
          .toFile(outputPath);

        console.log(`Сконвертовано: ${outputPath}`);
      } catch (err) {
        console.error(`Помилка з файлом ${fullPath}:`, err);
      }
    }
  }
}

processDirectory(TARGET_DIR).then(() => console.log('Готово!'));