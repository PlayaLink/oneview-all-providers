const fs = require('fs');
const path = require('path');

// Use the compiled JS version of your data generator
const { generateSampleData } = require('../dist/lib/dataGenerator');

const OUTPUT_PATH = path.join(__dirname, '../src/data/providers.json');

const records = generateSampleData('Provider_Info', 50);

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(records, null, 2), 'utf-8');

console.log(`Generated 50 Provider Info records to ${OUTPUT_PATH}`); 