const fs = require('fs');
const path = require('path');

const adminPath = path.join(__dirname, '..', 'pages', 'Admin.tsx');
const content = fs.readFileSync(adminPath, 'utf8');

const marker = "             {activeTab === 'VIDEOS' && (";
const start = content.indexOf(marker);

const videosContent = fs.readFileSync(path.join(__dirname, 'videos_tab_content.txt'), 'utf8');
const endContent = `
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
`;

fs.writeFileSync(adminPath, content.substring(0, start) + videosContent.trimEnd() + endContent, 'utf8');
console.log("Replaced end of Admin.tsx successfully.");
