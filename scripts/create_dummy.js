const fs = require('fs');
const t = fs.readFileSync('scripts/videos_tab_content.txt', 'utf8');
const c = `import React from 'react';\nexport default function Dummy() {\n  const activeTab = 'VIDEOS';\n  return (\n    <div>\n      ${t}\n    </div>\n  );\n}\n`;
fs.writeFileSync('dummy.tsx', c, 'utf8');
