const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'src');

const replacements = [
  // Primary brand blues -> Darker desaturated slate-navy
  [/#315B9A/gi, '#1e3a5f'],
  [/#26497D/gi, '#142842'],
  [/#EEF3FA/gi, '#f1f5f9'],
  [/#F4F7FC/gi, '#f1f5f9'],
  
  // Semantic Greens -> Darker muted forest green
  [/#16845B/gi, '#166534'],
  [/#16a34a/gi, '#166534'],
  [/#EBF8F2/gi, '#f0fdf4'],
  [/#C6EFDC/gi, '#bbf7d0'],
  
  // Semantic Ambers -> Darker muted bronze amber
  [/#C58A27/gi, '#854d0e'],
  [/#b45309/gi, '#854d0e'],
  [/#d97706/gi, '#854d0e'],
  [/#FEF7EC/gi, '#fefce8'],
  [/#FCE7C5/gi, '#fde68a'],
  
  // Semantic Reds -> Darker desaturated crimson
  [/#D14C4C/gi, '#991b1b'],
  [/#dc2626/gi, '#991b1b'],
  [/#c63333/gi, '#991b1b'],
  [/#FDF2F2/gi, '#fef2f2'],
  [/#FAD3D3/gi, '#fecaca'],

  // Borders & Dividers -> Clean, crisp hairline
  [/#E7EAF0/gi, '#e2e8f0'],
  [/#D1D7E2/gi, '#cbd5e1'],
  [/#F1F3F7/gi, '#f1f5f9'],
  [/#F8F9FB/gi, '#f8f9fb'],
  
  // High contrast text
  [/#172033/gi, '#0f172a'],
  [/#687386/gi, '#334155'],
  [/#94A3B8/gi, '#64748b'],
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  for (const [from, to] of replacements) {
    content = content.replace(from, to);
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${path.relative(targetDir, filePath)}`);
  }
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
      processFile(full);
    }
  }
}

console.log('Running color refinement pass...');
walk(targetDir);
console.log('Done!');
