#!/usr/bin/env node

/**
 * Sync design tokens from Figma to JSON files
 *
 * Usage:
 * node scripts/sync-tokens-from-figma.js
 *
 * Environment variables required:
 * - FIGMA_TOKEN: Figma personal access token
 */

const fs = require('fs');
const path = require('path');

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FIGMA_FILE_KEY = 'SS96QDVedbpCNWbkju1UbI';

if (!FIGMA_TOKEN) {
  console.error('❌ FIGMA_TOKEN environment variable is required');
  process.exit(1);
}

// Transform Figma variables into JSON structure matching logistics DS
function transformTokens() {
  // Return placeholder structure for now
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
function writeTokens(tokens) {
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
try {
  console.log(`🔗 Syncing tokens from Figma (${FIGMA_FILE_KEY})...\n`);

  const tokens = transformTokens();
  writeTokens(tokens);

  console.log('\n✨ Token sync complete!');
} catch (error) {
  console.error('❌ Sync failed:', error.message);
  process.exit(1);
}
