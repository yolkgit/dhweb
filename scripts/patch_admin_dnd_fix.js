const fs = require('fs');

const adminPath = 'pages/Admin.tsx';
let adminContent = fs.readFileSync(adminPath, 'utf8');

const normalizeStr = str => str.replace(/\r\n/g, '\n');
adminContent = normalizeStr(adminContent);

const stateTarget = `  // --- Handlers ---`;
const stateInjection = `  // Lab Equipment Drag and Drop
  const [draggedLabId, setDraggedLabId] = useState<string | null>(null);
  const [dragOverLabId, setDragOverLabId] = useState<string | null>(null);
  const labDragCounterRef = useRef<Record<string, number>>({});

  const handleDropLab = (droppedOnId: string) => {
    if (!draggedLabId || draggedLabId === droppedOnId) {
      setDraggedLabId(null);
      setDragOverLabId(null);
      labDragCounterRef.current = {};
      return;
    }
    const draggedIdx = labEquipment.findIndex(i => i.id === draggedLabId);
    const dropIdx = labEquipment.findIndex(i => i.id === droppedOnId);
    if (draggedIdx !== -1 && dropIdx !== -1) {
      const newLabs = [...labEquipment];
      const [moved] = newLabs.splice(draggedIdx, 1);
      newLabs.splice(dropIdx, 0, moved);
      reorderLabEquipment(newLabs);
    }
    setDraggedLabId(null);
    setDragOverLabId(null);
    labDragCounterRef.current = {};
  };

  // Certification Drag and Drop
  const [draggedCertId, setDraggedCertId] = useState<string | null>(null);
  const [dragOverCertId, setDragOverCertId] = useState<string | null>(null);
  const certDragCounterRef = useRef<Record<string, number>>({});

  const handleDropCert = (droppedOnId: string) => {
    if (!draggedCertId || draggedCertId === droppedOnId) {
      setDraggedCertId(null);
      setDragOverCertId(null);
      certDragCounterRef.current = {};
      return;
    }
    const draggedIdx = certifications.findIndex(c => c.id === draggedCertId);
    const dropIdx = certifications.findIndex(c => c.id === droppedOnId);
    if (draggedIdx !== -1 && dropIdx !== -1) {
      const newCerts = [...certifications];
      const [moved] = newCerts.splice(draggedIdx, 1);
      newCerts.splice(dropIdx, 0, moved);
      reorderCertifications(newCerts);
    }
    setDraggedCertId(null);
    setDragOverCertId(null);
    certDragCounterRef.current = {};
  };

  // Branch Drag and Drop
  const [draggedBranchId, setDraggedBranchId] = useState<string | null>(null);
  const [dragOverBranchId, setDragOverBranchId] = useState<string | null>(null);
  const branchDragCounterRef = useRef<Record<string, number>>({});

  const handleDropBranch = (droppedOnId: string) => {
    if (!draggedBranchId || draggedBranchId === droppedOnId) {
      setDraggedBranchId(null);
      setDragOverBranchId(null);
      branchDragCounterRef.current = {};
      return;
    }
    const draggedIdx = branches.findIndex(b => b.id === draggedBranchId);
    const dropIdx = branches.findIndex(b => b.id === droppedOnId);
    if (draggedIdx !== -1 && dropIdx !== -1) {
      const newBranches = [...branches];
      const [moved] = newBranches.splice(draggedIdx, 1);
      newBranches.splice(dropIdx, 0, moved);
      reorderBranches(newBranches);
    }
    setDraggedBranchId(null);
    setDragOverBranchId(null);
    branchDragCounterRef.current = {};
  };

  // --- Handlers ---`;

if (!adminContent.includes('const [draggedLabId, setDraggedLabId]')) {
    adminContent = adminContent.replace(stateTarget, stateInjection);
}

// 2. LabEquipment
const labMapTarget = `{labEquipment.map(item => (
                        <div key={item.id} className="border border-slate-200 p-4 rounded-lg flex items-center gap-4 bg-white hover:shadow-md transition">`;
const labMapReplacement = `{labEquipment.map(item => (
                        <div 
                          key={item.id} 
                          className={\`border p-4 rounded-lg flex items-center gap-4 transition \${dragOverLabId === item.id ? (labEquipment.findIndex(i => i.id === draggedLabId) < labEquipment.findIndex(i => i.id === item.id) ? 'border-b-4 border-b-emerald-500 bg-emerald-50/30' : 'border-t-4 border-t-emerald-500 bg-emerald-50/30') : 'border-slate-200 bg-white hover:shadow-md'} \${draggedLabId === item.id ? 'opacity-40' : ''}\`}
                          draggable
                          onDragStart={(e) => {
                            setDraggedLabId(item.id);
                            e.dataTransfer.effectAllowed = 'move';
                            e.dataTransfer.setData('text/plain', item.id);
                          }}
                          onDragEnd={() => {
                            setDraggedLabId(null);
                            setDragOverLabId(null);
                            labDragCounterRef.current = {};
                          }}
                          onDragEnter={(e) => {
                            e.preventDefault();
                            if (!labDragCounterRef.current[item.id]) labDragCounterRef.current[item.id] = 0;
                            labDragCounterRef.current[item.id]++;
                            if (draggedLabId && draggedLabId !== item.id) {
                              setDragOverLabId(item.id);
                            }
                          }}
                          onDragLeave={(e) => {
                            e.preventDefault();
                            if (labDragCounterRef.current[item.id]) labDragCounterRef.current[item.id]--;
                            if (labDragCounterRef.current[item.id] <= 0) {
                              labDragCounterRef.current[item.id] = 0;
                              if (dragOverLabId === item.id) setDragOverLabId(null);
                            }
                          }}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            handleDropLab(item.id);
                          }}
                        >
                          <span className="text-slate-300 cursor-move hover:text-emerald-500 transition-colors">
                            <Menu size={20} />
                          </span>`;
adminContent = adminContent.replace(labMapTarget, labMapReplacement);

// 3. Certifications
const certMapTarget = `{certifications.map(cert => (
                         <div key={cert.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-white hover:shadow-sm">`;
const certMapReplacement = `{certifications.map(cert => (
                         <div 
                           key={cert.id} 
                           className={\`flex items-center justify-between p-4 border rounded-lg transition \${dragOverCertId === cert.id ? (certifications.findIndex(c => c.id === draggedCertId) < certifications.findIndex(c => c.id === cert.id) ? 'border-b-4 border-b-emerald-500 bg-emerald-50/30' : 'border-t-4 border-t-emerald-500 bg-emerald-50/30') : 'border-slate-200 bg-white hover:shadow-sm'} \${draggedCertId === cert.id ? 'opacity-40' : ''}\`}
                           draggable
                           onDragStart={(e) => {
                             setDraggedCertId(cert.id);
                             e.dataTransfer.effectAllowed = 'move';
                             e.dataTransfer.setData('text/plain', cert.id);
                           }}
                           onDragEnd={() => {
                             setDraggedCertId(null);
                             setDragOverCertId(null);
                             certDragCounterRef.current = {};
                           }}
                           onDragEnter={(e) => {
                             e.preventDefault();
                             if (!certDragCounterRef.current[cert.id]) certDragCounterRef.current[cert.id] = 0;
                             certDragCounterRef.current[cert.id]++;
                             if (draggedCertId && draggedCertId !== cert.id) {
                               setDragOverCertId(cert.id);
                             }
                           }}
                           onDragLeave={(e) => {
                             e.preventDefault();
                             if (certDragCounterRef.current[cert.id]) certDragCounterRef.current[cert.id]--;
                             if (certDragCounterRef.current[cert.id] <= 0) {
                               certDragCounterRef.current[cert.id] = 0;
                               if (dragOverCertId === cert.id) setDragOverCertId(null);
                             }
                           }}
                           onDragOver={(e) => e.preventDefault()}
                           onDrop={(e) => {
                             e.preventDefault();
                             handleDropCert(cert.id);
                           }}
                         >
                           <div className="flex items-center gap-3">
                              <span className="text-slate-300 cursor-move hover:text-emerald-500 transition-colors">
                                <Menu size={20} />
                              </span>`;
adminContent = adminContent.replace(certMapTarget, certMapReplacement);

// 4. Branches
const branchMapTarget = `{branches.map((branch) => (
                        <div key={branch.id} className="border border-slate-200 rounded-lg p-6 bg-white hover:shadow-md transition flex flex-col justify-between">`;
const branchMapReplacement = `{branches.map((branch) => (
                        <div 
                          key={branch.id} 
                          className={\`border rounded-lg p-6 transition flex flex-col justify-between \${dragOverBranchId === branch.id ? (branches.findIndex(b => b.id === draggedBranchId) < branches.findIndex(b => b.id === branch.id) ? 'border-b-4 border-b-emerald-500 bg-emerald-50/30' : 'border-t-4 border-t-emerald-500 bg-emerald-50/30') : 'border-slate-200 bg-white hover:shadow-md'} \${draggedBranchId === branch.id ? 'opacity-40' : ''}\`}
                          draggable
                          onDragStart={(e) => {
                            setDraggedBranchId(branch.id);
                            e.dataTransfer.effectAllowed = 'move';
                            e.dataTransfer.setData('text/plain', branch.id);
                          }}
                          onDragEnd={() => {
                            setDraggedBranchId(null);
                            setDragOverBranchId(null);
                            branchDragCounterRef.current = {};
                          }}
                          onDragEnter={(e) => {
                            e.preventDefault();
                            if (!branchDragCounterRef.current[branch.id]) branchDragCounterRef.current[branch.id] = 0;
                            branchDragCounterRef.current[branch.id]++;
                            if (draggedBranchId && draggedBranchId !== branch.id) {
                              setDragOverBranchId(branch.id);
                            }
                          }}
                          onDragLeave={(e) => {
                            e.preventDefault();
                            if (branchDragCounterRef.current[branch.id]) branchDragCounterRef.current[branch.id]--;
                            if (branchDragCounterRef.current[branch.id] <= 0) {
                              branchDragCounterRef.current[branch.id] = 0;
                              if (dragOverBranchId === branch.id) setDragOverBranchId(null);
                            }
                          }}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            handleDropBranch(branch.id);
                          }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-slate-300 cursor-move hover:text-emerald-500 transition-colors">
                              <Menu size={20} />
                            </span>
                          </div>`;
adminContent = adminContent.replace(branchMapTarget, branchMapReplacement);


fs.writeFileSync(adminPath, adminContent, 'utf8');
console.log("Admin.tsx FIXED for drag and drop!");
