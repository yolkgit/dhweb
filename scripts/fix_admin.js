const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'pages', 'Admin.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// The file currently ends with:
//                    </div>
//                 </div>
//                )}
// };
//
// export default Admin;

// We need to replace it with:
/*
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
*/

// Find the last index of `)}` before `};`
const brokenEnd = '                </div>\r\n               )\}\r\n};\r\n\r\nexport default Admin;';
const brokenEnd2 = '                </div>\n               )}\n};\n\nexport default Admin;';

let target = content.includes(brokenEnd) ? brokenEnd : (content.includes(brokenEnd2) ? brokenEnd2 : null);

if (!target) {
    // try to match using regex just in case
    const regex = /<\/div>\s*\)\}\s*};\s*export default Admin;/;
    const match = content.match(regex);
    if (match) {
        target = match[0];
    }
}

if (target) {
    const fixed = `                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;`;
    content = content.replace(target, fixed);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("SUCCESS: Fixed closing tags");
} else {
    console.log("COULD NOT FIND TARGET ENDING. Checking last 100 characters:");
    console.log(content.slice(-100));
}
