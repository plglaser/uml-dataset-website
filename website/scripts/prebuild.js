import fs from 'node:fs';
import path from "node:path";
import { fileURLToPath } from 'node:url';
import plantUMLParser from 'plantuml-parser';
import AdmZip from 'adm-zip';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATASET_DIR = path.resolve(__dirname, '../../dataset');
const MODELS_DIR = path.resolve(__dirname, '../public/models');
const OUTPUT_FILE = path.resolve(__dirname, '../public/models.json');

function getDirectories(srcPath) {
    return fs.readdirSync(srcPath).filter((file) =>
        fs.statSync(path.join(srcPath, file)).isDirectory()
    );
}

function parsePlantUML(filePath) {
    let lines = fs.readFileSync(filePath, 'utf8').split('\n');
    const plantumlContent = lines.join('\n');
    return plantUMLParser.parse(plantumlContent);
}

function getDescription(filePath) {
    if (!fs.existsSync(filePath)) return '';
    return fs.readFileSync(filePath, 'utf8');
}

function checkUmlConcepts(elements) {
    const concepts = [
        { property: 'hasComposition', symbols: ['*'] },
        { property: 'hasAggregation', symbols: ['o'] }
        // add more concepts here as needed
    ];

    // Get only relationships
    const relationships = elements.filter(e => e instanceof plantUMLParser.Relationship);

    // Prepare result object
    const result = {};
    for (const concept of concepts) {
        result[concept.property] = relationships.some(rel =>
            concept.symbols.includes(rel.leftArrowHead) ||
            concept.symbols.includes(rel.rightArrowHead)
        );
    }
    return result;
}

function getModelData(folderPath, folderName) {
    const plantumlPath = path.join(folderPath, 'plantuml.txt');
    const descriptionPath = path.join(folderPath, 'description.md');
    const metadataPath = path.join(folderPath, 'metadata.txt');
    const extraMaterialPath = path.join(folderPath, 'extramaterial');

    if (!fs.existsSync(plantumlPath)) return null;

    const parsed = parsePlantUML(plantumlPath);
    const elements = parsed.at(0).elements;

    const elementCount = elements.filter(e => e instanceof plantUMLParser.Class).length
    const relationshipCount = elements.filter(e => e instanceof plantUMLParser.Relationship).length
    const metadata = parseMetadata(metadataPath);
    const umlConcepts = checkUmlConcepts(elements);
    const hasExtraMaterial = fs.existsSync(extraMaterialPath) && fs.statSync(extraMaterialPath).isDirectory();

    return {
        name: folderName,
        description: getDescription(descriptionPath),
        elementCount,
        relationshipCount,
        hasExtraMaterial,
        ...umlConcepts,
        ...metadata
    };
}

function parseMetadata(filePath) {
    if (!fs.existsSync(filePath)) return {};
    const raw = fs.readFileSync(filePath, 'utf8');
    const lines = raw.split('\n');
    const metadata = {};
    for (let line of lines) {
        line = line.trim();
        if (!line || !line.includes(':')) continue;
        const [key, ...rest] = line.split(':');
        if (key.trim() === 'name') continue; // Skip name as it's already the folder name
        let value = rest.join(':').trim();
        // tags and domain are expected to be comma-separated lists
        if (['tags', 'domain'].includes(key)) {
            value = value ? value.split(',').map(s => s.trim()).filter(Boolean) : [];
        }
        metadata[key] = value;
    }
    return metadata;
}

// Recursively copy all files and folders from src to dest
function copyRecursiveSync(src, dest) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
        const srcPath = path.join(src, entry);
        const destPath = path.join(dest, entry);
        if (fs.statSync(srcPath).isDirectory()) {
            copyRecursiveSync(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Copies all files of each model into public/models/[modelName]
function copyAllModelFiles(modelFolders) {
    for (const folder of modelFolders) {
        const src = path.join(DATASET_DIR, folder);
        const dest = path.join(MODELS_DIR, folder);
        copyRecursiveSync(src, dest);
    }
}

function zipModelFiles() {
    fs.readdirSync(MODELS_DIR).forEach(modelName => {
        const modelPath = path.join(MODELS_DIR, modelName);
        if (fs.statSync(modelPath).isDirectory()) {
          const zip = new AdmZip();
          zip.addLocalFolder(modelPath);
          zip.writeZip(path.join(MODELS_DIR, `${modelName}.zip`));
        }
    });
}

// TODO: Add validation
function main() {
    if (!fs.existsSync(MODELS_DIR)) fs.mkdirSync(MODELS_DIR, { recursive: true });
    const modelFolders = getDirectories(DATASET_DIR);
    const models = [];

    for (const folder of modelFolders) {
        const folderPath = path.join(DATASET_DIR, folder);
        const data = getModelData(folderPath, folder);
        if (data) models.push(data);
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(models, null, 2));
    console.log(`Wrote ${models.length} models to ${OUTPUT_FILE}`);

    copyAllModelFiles(modelFolders);
    console.log(`Copied all model files to ${MODELS_DIR}`);

    zipModelFiles();
    console.log(`Zipped model files in ${MODELS_DIR}`);
}

main()