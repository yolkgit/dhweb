const fs = require('fs');
const path = require('path');

const adminPath = path.join(__dirname, '..', 'pages', 'Admin.tsx');
const newContentPath = path.join(__dirname, 'videos_tab_content.txt');

const content = fs.readFileSync(adminPath, 'utf8');
const newSection = fs.readFileSync(newContentPath, 'utf8').trimEnd();

const marker = "activeTab === 'VIDEOS'";
const markerIdx = content.indexOf(marker);
if (markerIdx === -1) {
  console.error('ERROR: Could not find VIDEOS tab marker');
  process.exit(1);
}

// Find the line start
const lineStart = content.lastIndexOf('\n', markerIdx) + 1;

// Find matching closing paren using brace counting
let braceCount = 0;
let endIdx = -1;
let foundFirst = false;

for (let i = lineStart; i < content.length; i++) {
  const ch = content[i];
  if (ch === '(') {
    braceCount++;
    foundFirst = true;
  }
  if (ch === ')') {
    braceCount--;
    if (foundFirst && braceCount === 0) {
      const nextNewline = content.indexOf('\n', i);
      endIdx = nextNewline > 0 ? nextNewline + 1 : i + 1;
      break;
    }
  }
}

if (endIdx === -1) {
  console.error('ERROR: Could not find end of VIDEOS tab');
  process.exit(1);
}

console.log(`Replacing chars ${lineStart} to ${endIdx} (${endIdx - lineStart} chars)`);

const newContent = content.substring(0, lineStart) + newSection + '\r\n' + content.substring(endIdx);
fs.writeFileSync(adminPath, newContent, 'utf8');
console.log('SUCCESS: VIDEOS tab replaced');
console.log(`New file size: ${newContent.length} chars`);
