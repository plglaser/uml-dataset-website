import fs from 'node:fs';
import path from "node:path";
import { fileURLToPath } from 'node:url';
import plantUMLParser from 'plantuml-parser';

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

function parsePlantUML(filePath) {
    let lines = fs.readFileSync(filePath, 'utf8').split('\n');
    if (lines.length > 2) {
        lines = lines.slice(1, -1); // Remove first and last line
    }
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
    const plantumlPath = path.join(folderPath, 'plantuml.md');
    const descriptionPath = path.join(folderPath, 'description.md');
    const metadataPath = path.join(folderPath, 'metadata.txt');
    if (!fs.existsSync(plantumlPath)) return null;

    const parsed = parsePlantUML(plantumlPath);
    const elements = parsed.at(0).elements;

    const elementCount = elements.filter(e => e instanceof plantUMLParser.Class).length
    const relationshipCount = elements.filter(e => e instanceof plantUMLParser.Relationship).length
    const metadata = parseMetadata(metadataPath);
    const umlConcepts = checkUmlConcepts(elements);

    return {
        name: folderName,
        description: getDescription(descriptionPath),
        elementCount,
        relationshipCount,
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

// TODO: Add validation
function main() {
    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    const modelFolders = getDirectories(DATASET_DIR);
    const models = [];

    for (const folder of modelFolders) {
        const folderPath = path.join(DATASET_DIR, folder);
        const data = getModelData(folderPath, folder);
        if (data) models.push(data);
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(models, null, 2));
    console.log(`Wrote ${models.length} models to ${OUTPUT_FILE}`);
}

main()