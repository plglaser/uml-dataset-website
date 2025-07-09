// TODO: ADAPT THIS

import fs from 'node:fs';
import path from "node:path";
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATASET_DIR = path.resolve(__dirname, '../../dataset');
const OUTPUT_DIR = path.resolve(__dirname, '../public/models');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'models.json');

function getDirectories(srcPath) {
    return fs.readdirSync(srcPath).filter((file) =>
        fs.statSync(path.join(srcPath, file)).isDirectory()
    );
}

function main() {
    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  
    const modelFolders = getDirectories(DATASET_DIR);
  
    const models = modelFolders.map((folder) => {
      // const absFolder = path.join(DATASET_DIR, folder);
      return {
        name: folder,
        // description: getDescription(absFolder),
        path: folder,
      };
    });
  
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(models, null, 2));
    console.log(`models.json generated with ${models.length} entries.`);
}
  
main();

/*
function getDescription(modelDir) {
    // Adjust the filename if your description has a different name/extension
    const descPath = path.join(modelDir, 'description.md');
    if (fs.existsSync(descPath)) {
        return fs.readFileSync(descPath, 'utf-8').slice(0, 200); // First 200 chars
    }
    return '';
}
*/