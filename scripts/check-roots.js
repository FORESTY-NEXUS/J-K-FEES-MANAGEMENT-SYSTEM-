const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) results = results.concat(walk(full));
    else if (file === 'page.tsx') results.push(full);
  });
  return results;
}

const pages = walk('src/app');
pages.forEach(p => {
  const content = fs.readFileSync(p, 'utf8');
  const match = content.match(/return\s*\(\s*(?:<div|<main)([^>]+)>/);
  if (match) {
    console.log(p.replace(/\\/g, '/'), '-->', match[1].trim());
  } else {
    console.log(p.replace(/\\/g, '/'), '--> (no simple match)');
  }
});
