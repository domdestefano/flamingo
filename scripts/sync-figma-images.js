#!/usr/bin/env node

/**
 * Pull every image listed in scripts/figma-images.json from Figma and write
 * it to its mapped local path.
 *
 * Unlike the Variables API (Enterprise-only — see scripts/README-tokens.md),
 * Figma's file/image REST API works on any plan, so this can run fully
 * unattended on a schedule via .github/workflows/sync-figma-images.yml.
 *
 * Usage:
 *   node scripts/sync-figma-images.js
 *
 * Environment variables required:
 * - FIGMA_TOKEN: Figma personal access token (needs File content: Read)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const MAPPING_FILE = path.join(__dirname, 'figma-images.json');
const REPO_ROOT = path.join(__dirname, '..');

if (!FIGMA_TOKEN) {
  console.error('❌ FIGMA_TOKEN environment variable is required');
  process.exit(1);
}

function figmaGet(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'X-Figma-Token': FIGMA_TOKEN } }, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          if (res.statusCode !== 200) {
            reject(new Error(`Figma API ${res.statusCode} for ${url}: ${data}`));
            return;
          }
          resolve(JSON.parse(data));
        });
      })
      .on('error', reject);
  });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Download failed ${res.statusCode} for ${url}`));
          return;
        }
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        const fileStream = fs.createWriteStream(destPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => fileStream.close(resolve));
      })
      .on('error', reject);
  });
}

async function syncGroup(fileKey, images) {
  // Figma returns all requested node images from one file in a single call —
  // batch by fileKey to minimize API requests.
  const byScale = new Map();
  for (const img of images) {
    const scale = img.scale || 2;
    if (!byScale.has(scale)) byScale.set(scale, []);
    byScale.get(scale).push(img);
  }

  for (const [scale, group] of byScale) {
    const ids = group.map((g) => g.nodeId).join(',');
    const url = `https://api.figma.com/v1/images/${fileKey}?ids=${encodeURIComponent(
      ids
    )}&format=png&scale=${scale}`;

    console.log(`📡 Fetching ${group.length} image(s) from ${fileKey} @${scale}x...`);
    const response = await figmaGet(url);

    if (response.err) {
      throw new Error(`Figma image render error: ${response.err}`);
    }

    for (const img of group) {
      const imageUrl = response.images[img.nodeId];
      if (!imageUrl) {
        console.warn(`⚠️  No image returned for node ${img.nodeId} (${img.description}) — skipping`);
        continue;
      }
      const destPath = path.join(REPO_ROOT, img.output);
      await downloadFile(imageUrl, destPath);
      console.log(`✅ ${img.output}`);
    }
  }
}

async function main() {
  const mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf8'));
  const images = mapping.images;

  const byFile = new Map();
  for (const img of images) {
    if (!byFile.has(img.fileKey)) byFile.set(img.fileKey, []);
    byFile.get(img.fileKey).push(img);
  }

  console.log(`🔗 Syncing ${images.length} image(s) across ${byFile.size} Figma file(s)...\n`);

  for (const [fileKey, group] of byFile) {
    await syncGroup(fileKey, group);
  }

  console.log('\n✨ Figma image sync complete!');
}

main().catch((error) => {
  console.error('❌ Sync failed:', error.message);
  process.exit(1);
});
