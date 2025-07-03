import { writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateSampleData } from '../src/lib/dataGenerator.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_PATH = path.join(__dirname, '../src/data/providers.json');

async function main() {
  const records = generateSampleData('Provider_Info', 50);
  await writeFile(OUTPUT_PATH, JSON.stringify(records, null, 2), 'utf-8');
  console.log(`Generated 50 Provider Info records to ${OUTPUT_PATH}`);
}

main(); 