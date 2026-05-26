const fs = require('fs');
const p = 'context/ContentContext.tsx';
let txt = fs.readFileSync(p, 'utf8');

const interfaceIdx = txt.indexOf('deleteLabEquipment: (id: string) => void;');
if (interfaceIdx !== -1) {
    const endIdx = interfaceIdx + 'deleteLabEquipment: (id: string) => void;'.length;
    txt = txt.substring(0, endIdx) + '\  reorderCertifications: (orderedCerts: Certification[]) => void;\n  reorderLabEquipment: (orderedItems: LabEquipment[]) => void;' + txt.substring(endIdx);
}

const funcIdx = txt.indexOf("api.delete('lab-equipment', id);\n  };");
if (funcIdx !== -1) {
    const endIdx = funcIdx + "api.delete('lab-equipment', id);\n  };".length;
    
    const addition = `
  const reorderCertifications = (orderedCerts: Certification[]) => {
    setCertifications(orderedCerts);
    fetch('/api/certifications/reorder', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderedCerts.map(c => c.id))
    }).catch(e => console.error('Failed to reorder certifications', e));
  };
  
  const reorderLabEquipment = (orderedItems: LabEquipment[]) => {
    setLabEquipment(orderedItems);
    fetch('/api/lab-equipments/reorder', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderedItems.map(i => i.id))
    }).catch(e => console.error('Failed to reorder lab equipments', e));
  };`;
    
    txt = txt.substring(0, endIdx) + addition + txt.substring(endIdx);
} else {
    // try with \r\n
    const funcIdx2 = txt.indexOf("api.delete('lab-equipment', id);\r\n  };");
    if (funcIdx2 !== -1) {
        const endIdx = funcIdx2 + "api.delete('lab-equipment', id);\r\n  };".length;
        
        const addition = `\r\n  const reorderCertifications = (orderedCerts: Certification[]) => {\r\n    setCertifications(orderedCerts);\r\n    fetch('/api/certifications/reorder', {\r\n      method: 'PUT',\r\n      headers: { 'Content-Type': 'application/json' },\r\n      body: JSON.stringify(orderedCerts.map(c => c.id))\r\n    }).catch(e => console.error('Failed to reorder certifications', e));\r\n  };\r\n  \r\n  const reorderLabEquipment = (orderedItems: LabEquipment[]) => {\r\n    setLabEquipment(orderedItems);\r\n    fetch('/api/lab-equipments/reorder', {\r\n      method: 'PUT',\r\n      headers: { 'Content-Type': 'application/json' },\r\n      body: JSON.stringify(orderedItems.map(i => i.id))\r\n    }).catch(e => console.error('Failed to reorder lab equipments', e));\r\n  };`;
        
        txt = txt.substring(0, endIdx) + addition + txt.substring(endIdx);
    }
}

fs.writeFileSync(p, txt, 'utf8');
console.log("Patched ContentContext.tsx manually!");
