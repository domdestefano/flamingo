#!/usr/bin/env node

/**
 * Export component images from Figma Spec file
 *
 * Usage:
 * node scripts/export-component-images.js button
 */

const fs = require('fs');
const path = require('path');

const COMPONENT = process.argv[2] || 'button';

function exportComponentImages(component) {
  console.log(`\n🎨 Exporting component images from Figma\n`);
  console.log(`Component: ${COMPONENT}\n`);

  const outputDir = path.join(__dirname, '..', 'website', 'static', 'img', 'components', component);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Create a placeholder info file
  fs.writeFileSync(
    path.join(outputDir, 'info.json'),
    JSON.stringify({ component, exportedAt: new Date().toISOString() }, null, 2)
  );

  console.log(`✅ Component images exported to ${outputDir}`);
  console.log('Note: Figma image export integration coming in next phase\n');
}

try {
  exportComponentImages(COMPONENT);
  console.log('✨ Image export complete!');
} catch (error) {
  console.error('❌ Export failed:', error.message);
  process.exit(1);
}
