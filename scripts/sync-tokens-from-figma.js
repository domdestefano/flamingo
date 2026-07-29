#!/usr/bin/env node

/**
 * Sync design tokens from Figma to JSON files
 *
 * Usage:
 * node scripts/sync-tokens-from-figma.js
 *
 * Environment variables required:
 * - FIGMA_TOKEN: Figma personal access token
 * - FIGMA_FILE_KEY: Figma file key containing tokens (SS96QDVedbpCNWbkju1UbI)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY || 'SS96QDVedbpCNWbkju1UbI';

if (!FIGMA_TOKEN) {
  console.error('❌ FIGMA_TOKEN environment variable is required');
  process.exit(1);
}

// Helper to make HTTPS requests to Figma API
function figmaAPI(endpoint) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.figma.com',
      path: endpoint,
      method: 'GET',
      headers: {
        'X-Figma-Token': FIGMA_TOKEN,
      },
    };

    https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`Figma API error ${res.statusCode}: ${data}`));
        }
      });
    }).on('error', reject).end();
  });
}

// Fetch file data including variables
async function getFileVariables() {
  try {
    console.log('📡 Fetching tokens from Figma...');
    const response = await figmaAPI(`/v1/files/${FIGMA_FILE_KEY}?plugin_data=ignore`);
    return response;
  } catch (error) {
    console.error('❌ Failed to fetch tokens:', error.message);
    process.exit(1);
  }
}

// Transform Figma variables into JSON structure matching logistics DS
function transformTokens(figmaData) {
  // TODO: Parse figmaData.variables and transform into:
  // {
  //   "global": { colors: {...}, spacing: {...}, typography: {...} },
  //   "theme": { colors: {...} }
  // }

  // For now, return placeholder structure
  return {
    global: {
      colors: {
        primary: '#0066CC',
        secondary: '#666666',
        success: '#00A854',
        warning: '#FF7A00',
        error: '#FF4D4F',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
      },
      typography: {
        fontFamily: "'Inter', sans-serif",
        fontSize: {
          xs: '12px',
          sm: '14px',
          md: '16px',
          lg: '18px',
          xl: '20px',
        },
      },
    },
    theme: {
      colors: {
        // Theme-specific overrides (light mode by default)
      },
    },
  };
}

// Write tokens to JSON files
async function writeTokens(tokens) {
  const outputDir = path.join(__dirname, '..', 'website', 'tokens');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    // Write global tokens
    fs.writeFileSync(
      path.join(outputDir, 'global.json'),
      JSON.stringify(tokens.global, null, 2)
    );
    console.log('✅ Global tokens written');

    // Write theme tokens
    fs.writeFileSync(
      path.join(outputDir, 'theme.json'),
      JSON.stringify(tokens.theme, null, 2)
    );
    console.log('✅ Theme tokens written');

    console.log(`\n✅ Tokens synced to ${outputDir}`);
  } catch (error) {
    console.error('❌ Failed to write tokens:', error.message);
    process.exit(1);
  }
}

// Main
(async () => {
  console.log(`🔗 Syncing tokens from Figma (${FIGMA_FILE_KEY})...\n`);

  const figmaData = await getFileVariables();
  const tokens = transformTokens(figmaData);
  await writeTokens(tokens);

  console.log('\n✨ Token sync complete!');
})();
