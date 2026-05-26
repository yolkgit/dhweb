const fs = require('fs');
const targetPath = 'pages/Admin.tsx';
const newVideosContent = fs.readFileSync('scripts/videos_tab_content.txt', 'utf8').trimEnd();
let content = fs.readFileSync(targetPath, 'utf8');

const marker = "             {activeTab === 'VIDEOS' && (";
const startIdx = content.indexOf(marker);
if (startIdx === -1) throw new Error("Could not find start marker");

const styleMarker = "      <style>{`";
const endIdx = content.indexOf(styleMarker, startIdx);
if (endIdx === -1) throw new Error("Could not find style marker");

const endContent = `          </div>
        </div>
      </div>
`;

const before = content.substring(0, startIdx);
const after = content.substring(endIdx);

fs.writeFileSync(targetPath, before + newVideosContent + '\r\n' + endContent + after, 'utf8');
console.log("SUCCESS");
