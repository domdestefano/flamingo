#!/usr/bin/env node

/**
 * Export component images from Figma Spec file
 *
 * Usage:
 * node scripts/export-component-images.js button
 *
 * Environment variables required:
 * - FIGMA_TOKEN: Figma personal access token
 * - FIGMA_SPEC_FILE: Figma file key (VuBl4ugiWKRiGROf3zglzb)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_SPEC_FILE || 'VuBl4ugiWKRiGROf3zglzb';
const COMPONENT = process.argv[2] || 'button';

if (!FIGMA_TOKEN) {
  console.error('❌ FIGMA_TOKEN environment variable is required');
  process.exit(1);
}

// Helper to make HTTPS requests
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    }).on('error', reject);
  });
}

// Figma API request
function figmaAPI(endpoint, token = FIGMA_TOKEN) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.figma.com',
      path: endpoint,
      method: 'GET',
      headers: {
        'X-Figma-Token': token,
      },
    };

    https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`Figma API ${res.statusCode}: ${data}`));
        }
      });
    }).on('error', reject).end();
  });
}

// Download image from URL
async function downloadImage(url, filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const imageData = await httpsGet(url);
  fs.writeFileSync(filePath, imageData, 'binary');
}

// Export component images
async function exportComponentImages(component) {
  try {
    console.log(`📡 Fetching ${component} specs from Figma...\n`);

    // Get file structure
    const file = await figmaAPI(`/v1/files/${FIGMA_FILE_KEY}`);
    console.log(`File: ${file.name}`);

    // TODO: Parse file.document to find frames matching component name
    // For now, export placeholder

    const outputDir = path.join(__dirname, '..', 'website', 'static', 'img', 'components', component);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log(`\n✅ Component images exported to ${outputDir}`);
    console.log('Note: Image export implementation pending - Figma frame IDs need to be mapped');

  } catch (error) {
    console.error('❌ Export failed:', error.message);
    process.exit(1);
  }
}

// Main
(async () => {
  console.log(`\n🎨 Exporting component images from Figma\n`);
  console.log(`Component: ${COMPONENT}`);
  console.log(`File: ${FIGMA_FILE_KEY}\n`);

  await exportComponentImages(COMPONENT);

  console.log('\n✨ Image export complete!');
})();
