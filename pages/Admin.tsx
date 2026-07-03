import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { Product, ProductCategory, LabEquipment, Certification, HeroSlide, CertificationMark, Category, DesignSettings, Branch } from '../types';
import { Trash2, Plus, Edit2, RotateCcw, X, Beaker, Award, LogOut, Youtube, Info, Key, ExternalLink, Image as ImageIcon, Palette, Film, Type, CheckSquare, Table as TableIcon, Tag, List, Clock, MapPin, Phone, GripVertical } from 'lucide-react';
import IconPicker from '../components/IconPicker';
import { IconRenderer } from '../utils/iconMap';
import ImageInput from '../components/ImageInput';
import VideoInput from '../components/VideoInput';
import PdfInput from '../components/PdfInput';

const Admin: React.FC = () => {
  const { 
    companyInfo, updateCompanyInfo, 
    categories, addCategory, updateCategory, deleteCategory, reorderCategories,
    products, addProduct, updateProduct, deleteProduct, reorderProducts,
    playlists, updatePlaylist,
    labEquipment, addLabEquipment, updateLabEquipment, deleteLabEquipment, reorderLabEquipment,
    certifications, addCertification, updateCertification, deleteCertification, reorderCertifications,
    heroSlides, addHeroSlide, updateHeroSlide, deleteHeroSlide,
    logoSettings, updateLogoSettings,
    designSettings, updateDesignSettings,
    appSettings, updateAppSettings,
    certificationMarks, addCertificationMark, updateCertificationMark, deleteCertificationMark,
    calculatorSettings, updateCalculatorSettings,
    branches, addBranch, updateBranch, deleteBranch, reorderBranches,
    resetToDefaults 
  } = useContent();

  const [activeTab, setActiveTab] = useState<'INFO' | 'CATEGORIES' | 'PRODUCTS' | 'VIDEOS' | 'TECHNOLOGY' | 'DESIGN' | 'MARKS' | 'HERO' | 'CALCULATOR' | 'CONTACT'>('PRODUCTS');
  
  // Edit States
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingLabItem, setEditingLabItem] = useState<LabEquipment | null>(null);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [editingMark, setEditingMark] = useState<CertificationMark | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [useTableSpecs, setUseTableSpecs] = useState(false);

  // Drag-and-drop state for category reordering
  const [draggedCategoryId, setDraggedCategoryId] = useState<string | null>(null);
  const [dragOverCategoryId, setDragOverCategoryId] = useState<string | null>(null);
  const dragCounterRef = useRef<Record<string, number>>({});

  // Drag-and-drop state for product reordering
  const [draggedProductId, setDraggedProductId] = useState<string | null>(null);
  const [dragOverProductId, setDragOverProductId] = useState<string | null>(null);
  const prodDragCounterRef = useRef<Record<string, number>>({});
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  // Sync table specs toggle
  useEffect(() => {
    if (editingProduct) {
      setUseTableSpecs(!!editingProduct.specTable);
    }
  }, [editingProduct]);


  // Lab Equipment Drag and Drop
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

  // --- Handlers ---
  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateCompanyInfo({ ...companyInfo, [e.target.name]: e.target.value } as any);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      if (products.find(p => p.id === editingProduct.id)) {
        updateProduct(editingProduct);
      } else {
        addProduct(editingProduct);
      }
      setEditingProduct(null);
    }
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      if (categories.find(c => c.id === editingCategory.id)) {
        updateCategory(editingCategory);
      } else {
        // Validation: Check ID uniqueness for new categories
        if (categories.some(c => c.id === editingCategory.id)) {
           alert("이미 존재하는 ID입니다. 다른 ID를 사용해주세요.");
           return;
        }
        addCategory(editingCategory);
      }
      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = (id: string) => {
    // Check if products exist in this category
    const hasProducts = products.some(p => p.category === id);
    if (hasProducts) {
      alert("이 카테고리에 등록된 제품이 있습니다. 제품을 먼저 삭제하거나 이동시킨 후 삭제해주세요.");
      return;
    }
    if (confirm("정말 이 카테고리를 삭제하시겠습니까?")) {
      deleteCategory(id);
    }
  };

  const handleLabSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLabItem) {
      if (labEquipment.find(i => i.id === editingLabItem.id)) {
        updateLabEquipment(editingLabItem);
      } else {
        addLabEquipment(editingLabItem);
      }
      setEditingLabItem(null);
    }
  };

  const handleCertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCert) {
      if (certifications.find(c => c.id === editingCert.id)) {
        updateCertification(editingCert);
      } else {
        addCertification(editingCert);
      }
      setEditingCert(null);
    }
  };

  const handleSlideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSlide) {
      if (heroSlides.find(s => s.id === editingSlide.id)) {
        updateHeroSlide(editingSlide);
      } else {
        addHeroSlide(editingSlide);
      }
      setEditingSlide(null);
    }
  };

  const handleMarkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMark) {
      if (certificationMarks.find(m => m.id === editingMark.id)) {
        updateCertificationMark(editingMark);
      } else {
        addCertificationMark(editingMark);
      }
      setEditingMark(null);
    }
  };

  const handleBranchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBranch) {
      if (branches.find(b => b.id === editingBranch.id)) {
        updateBranch(editingBranch);
      } else {
        addBranch(editingBranch);
      }
      setEditingBranch(null);
    }
  };

  const handlePlaylistChange = (categoryId: string, value: string) => {
    let id = value.trim();
    try {
        if (value.startsWith('http')) {
            const url = new URL(value);
            if (url.searchParams.has('list')) {
                id = url.searchParams.get('list') || '';
            } else if (url.searchParams.has('v')) {
                id = url.searchParams.get('v') || '';
            } else if (url.hostname === 'youtu.be') {
                id = url.pathname.slice(1);
            }
        }
    } catch (e) {
        // Not a URL
    }
    updatePlaylist(categoryId, id);
  };

  const createNewCategory = () => {
    setEditingCategory({
      id: '',
      label: ''
    });
  };

  const createNewProduct = () => {
    if (categories.length === 0) {
      alert("먼저 카테고리를 생성해주세요.");
      return;
    }
    setEditingProduct({
      id: `new-${Date.now()}`,
      name: '',
      category: categories[0].id,
      description: '',
      features: ['특징 1'],
      specs: { '규격 1': '내용' },
      imageUrl: '',
      isNew: false,
      isEco: false,
      specUrl: '',
      msdsUrl: '',
      certificationMarkIds: [],
      constructionImageUrl: ''
    });
  };

  const createNewLabItem = () => {
    setEditingLabItem({
      id: `lab-${Date.now()}`,
      title: '',
      desc: '',
      iconName: 'Beaker',
      imageUrl: ''
    });
  };

  const createNewCert = () => {
    setEditingCert({
      id: `cert-${Date.now()}`,
      title: '',
      issuer: '',
      type: 'CERTIFICATE',
      pdfUrl: ''
    });
  };

  const createNewSlide = () => {
    setEditingSlide({
      id: `slide-${Date.now()}`,
      type: 'image',
      src: '',
      title: 'New Slide Title',
      subtitle: 'Main Headline',
      desc: 'Description goes here'
    });
  };

  const createNewMark = () => {
    setEditingMark({
      id: `mark-${Date.now()}`,
      name: 'New Mark',
      imageUrl: ''
    });
  };

  const createNewBranch = () => {
    setEditingBranch({
        id: `branch-${Date.now()}`,
        name: '',
        address: '',
        phone: ''
    });
  };

  // --- Helpers for Spec Table Editor ---
  const addSpecColumn = () => {
    if (!editingProduct || !editingProduct.specTable) return;
    const newHeaders = [...editingProduct.specTable.headers, '새 열'];
    const newRows = editingProduct.specTable.rows.map(row => [...row, '']);
    setEditingProduct({
      ...editingProduct,
      specTable: { headers: newHeaders, rows: newRows }
    });
  };

  const removeSpecColumn = (index: number) => {
    if (!editingProduct || !editingProduct.specTable) return;
    if (editingProduct.specTable.headers.length <= 1) {
       alert("최소 1개의 열은 있어야 합니다.");
       return;
    }
    if (!confirm("이 열을 삭제하시겠습니까? 데이터가 유실됩니다.")) return;
    
    const newHeaders = editingProduct.specTable.headers.filter((_, i) => i !== index);
    const newRows = editingProduct.specTable.rows.map(row => row.filter((_, i) => i !== index));
    setEditingProduct({
      ...editingProduct,
      specTable: { headers: newHeaders, rows: newRows }
    });
  };

  const updateSpecHeader = (index: number, value: string) => {
    if (!editingProduct || !editingProduct.specTable) return;
    const newHeaders = [...editingProduct.specTable.headers];
    newHeaders[index] = value;
    setEditingProduct({
      ...editingProduct,
      specTable: { ...editingProduct.specTable, headers: newHeaders }
    });
  };

  const addSpecRow = () => {
    if (!editingProduct || !editingProduct.specTable) return;
    const newRow = new Array(editingProduct.specTable.headers.length).fill('');
    setEditingProduct({
      ...editingProduct,
      specTable: { ...editingProduct.specTable, rows: [...editingProduct.specTable.rows, newRow] }
    });
  };
  
  const removeSpecRow = (index: number) => {
     if (!editingProduct || !editingProduct.specTable) return;
     const newRows = editingProduct.specTable.rows.filter((_, i) => i !== index);
     setEditingProduct({
       ...editingProduct,
       specTable: { ...editingProduct.specTable, rows: newRows }
     });
  };

  const updateSpecCell = (rowIndex: number, colIndex: number, value: string) => {
    if (!editingProduct || !editingProduct.specTable) return;
    const newRows = [...editingProduct.specTable.rows];
    newRows[rowIndex] = [...newRows[rowIndex]]; // Copy row
    newRows[rowIndex][colIndex] = value;
    setEditingProduct({
      ...editingProduct,
      specTable: { ...editingProduct.specTable, rows: newRows }
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      <div className="bg-slate-900 text-white pt-24 pb-12 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold">관리자 페이지 (Admin)</h1>
            <p className="text-slate-400 mt-2">웹사이트의 콘텐츠와 디자인을 실시간으로 관리하세요.</p>
          </div>
          <div className="flex gap-3">
             <Link 
               to="/"
               className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-700 hover:text-white transition font-bold text-sm"
             >
               <LogOut size={16} /> 나가기
             </Link>
             <button 
               onClick={resetToDefaults}
               className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-200 border border-red-500/50 rounded-lg hover:bg-red-500 hover:text-white transition font-bold text-sm"
             >
               <RotateCcw size={16} /> 초기화
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-6">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden min-h-[600px] flex flex-col md:flex-row">
          
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-4 shrink-0">
            <nav className="space-y-2">
              {[
                { id: 'DESIGN', label: '사이트 디자인 (Design)' },
                { id: 'HERO', label: '메인 배너 (Main Banner)' },
                { id: 'INFO', label: '회사 정보 (Company Info)' },
                { id: 'CATEGORIES', label: '카테고리 관리 (Categories)' },
                { id: 'PRODUCTS', label: '제품 관리 (Products)' },
                { id: 'MARKS', label: '인증마크 관리 (Marks)' },
                { id: 'TECHNOLOGY', label: '기술연구소 (R&D)' },
                { id: 'VIDEOS', label: '영상 관리 (Videos)' },
                { id: 'CONTACT', label: '고객센터 관리 (Customer Center)' },
                { id: 'CALCULATOR', label: '계산기 설정 (Calculator)' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-bold transition-all ${
                    activeTab === tab.id 
                      ? 'bg-emerald-600 text-white shadow-md' 
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-8 overflow-y-auto max-h-[800px]">

            {/* --- CATEGORIES TAB --- */}
            {activeTab === 'CATEGORIES' && (
              <div className="animate-fade-in-up">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                       <List className="mr-2 text-emerald-600" /> 카테고리 관리
                    </h2>
                    <button onClick={createNewCategory} className="flex items-center gap-2 bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-emerald-700 shadow-md text-sm">
                       <Plus size={16} /> 카테고리 추가
                    </button>
                 </div>
                 <p className="text-sm text-slate-500 mb-6">제품의 분류 기준이 되는 카테고리를 추가, 수정, 삭제합니다. <span className="text-emerald-600 font-medium">⬍ 드래그하여 순서를 변경할 수 있습니다.</span> 이 순서는 메인페이지와 제품소개에 그대로 적용됩니다.</p>

                 {!editingCategory ? (
                   <div className="space-y-1">
                      {categories.map((cat, index) => {
                         const productCount = products.filter(p => p.category === cat.id).length;
                         const repProduct = cat.representativeProductId ? products.find(p => p.id === cat.representativeProductId) : null;
                         const isDragging = draggedCategoryId === cat.id;
                         const isDragOver = dragOverCategoryId === cat.id && draggedCategoryId !== cat.id;
                         return (
                           <div 
                             key={cat.id} 
                             draggable
                             onDragStart={(e) => {
                               setDraggedCategoryId(cat.id);
                               e.dataTransfer.effectAllowed = 'move';
                               e.dataTransfer.setData('text/plain', cat.id);
                             }}
                             onDragEnd={() => {
                               setDraggedCategoryId(null);
                               setDragOverCategoryId(null);
                               dragCounterRef.current = {};
                             }}
                             onDragEnter={(e) => {
                               e.preventDefault();
                               if (!dragCounterRef.current[cat.id]) dragCounterRef.current[cat.id] = 0;
                               dragCounterRef.current[cat.id]++;
                               if (draggedCategoryId && draggedCategoryId !== cat.id) {
                                 setDragOverCategoryId(cat.id);
                               }
                             }}
                             onDragLeave={(e) => {
                               e.preventDefault();
                               if (dragCounterRef.current[cat.id]) dragCounterRef.current[cat.id]--;
                               if (dragCounterRef.current[cat.id] <= 0) {
                                 dragCounterRef.current[cat.id] = 0;
                                 if (dragOverCategoryId === cat.id) {
                                   setDragOverCategoryId(null);
                                 }
                               }
                             }}
                             onDragOver={(e) => {
                               e.preventDefault();
                               e.dataTransfer.dropEffect = 'move';
                             }}
                             onDrop={(e) => {
                               e.preventDefault();
                               dragCounterRef.current = {};
                               if (!draggedCategoryId || draggedCategoryId === cat.id) return;
                               const fromIndex = categories.findIndex(c => c.id === draggedCategoryId);
                               const toIndex = categories.findIndex(c => c.id === cat.id);
                               if (fromIndex === -1 || toIndex === -1) return;
                               const reordered = [...categories];
                               const [moved] = reordered.splice(fromIndex, 1);
                               reordered.splice(toIndex, 0, moved);
                               reorderCategories(reordered);
                               setDraggedCategoryId(null);
                               setDragOverCategoryId(null);
                             }}
                             className={`flex items-center justify-between p-4 border rounded-lg transition-all cursor-grab active:cursor-grabbing ${
                               isDragging 
                                 ? 'opacity-40 border-dashed border-slate-400 bg-slate-100 scale-95' 
                                 : isDragOver
                                   ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-100 ring-2 ring-emerald-300'
                                   : 'border-slate-200 bg-white hover:shadow-md'
                             }`}
                             style={{ transition: isDragging ? 'none' : 'all 0.2s ease' }}
                           >
                              <div className="flex items-center gap-4 flex-wrap">
                                 <div className="text-slate-300 hover:text-slate-500 transition cursor-grab active:cursor-grabbing" title="드래그하여 순서 변경">
                                   <GripVertical size={20} />
                                 </div>
                                 <div className="bg-emerald-50 text-emerald-700 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border border-emerald-200">
                                   {index + 1}
                                 </div>
                                 <div className="bg-slate-100 text-slate-500 px-3 py-1 rounded text-xs font-bold font-mono">
                                   {cat.id}
                                 </div>
                                 <div className="font-bold text-lg text-slate-800">{cat.label}</div>
                                 <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                                   제품 {productCount}개
                                 </span>
                                 {repProduct && (
                                   <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                     🏆 {repProduct.name}
                                   </span>
                                 )}
                              </div>
                              <div className="flex gap-2">
                                 <button onClick={() => setEditingCategory(cat)} className="p-2 text-slate-400 hover:text-emerald-600 bg-slate-50 hover:bg-emerald-50 rounded transition">
                                   <Edit2 size={16} />
                                 </button>
                                 <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded transition">
                                   <Trash2 size={16} />
                                 </button>
                              </div>
                           </div>
                         );
                      })}
                   </div>
                 ) : (
                    <form onSubmit={handleCategorySubmit} className="bg-slate-50 border border-slate-200 rounded-xl p-6 relative max-w-lg">
                       <button type="button" onClick={() => setEditingCategory(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X /></button>
                       <h3 className="font-bold mb-4 text-lg">
                         {categories.some(c => c.id === editingCategory.id) ? '카테고리 수정' : '새 카테고리 추가'}
                       </h3>
                       
                       <div className="space-y-4">
                          <div>
                             <label className="label">카테고리 ID (고유 식별자)</label>
                             <input 
                               className="input-field font-mono uppercase" 
                               value={editingCategory.id} 
                               onChange={e => setEditingCategory({...editingCategory, id: e.target.value.toUpperCase().replace(/\s/g, '_')})} 
                               required 
                               placeholder="예: ASPHALT"
                               disabled={categories.some(c => c.id === editingCategory.id)} // ID edit disabled for existing
                             />
                             {categories.some(c => c.id === editingCategory.id) && <p className="text-xs text-slate-400 mt-1">기존 카테고리의 ID는 수정할 수 없습니다.</p>}
                          </div>
                          <div>
                             <label className="label">카테고리 명칭 (화면 표시용)</label>
                             <input 
                               className="input-field" 
                               value={editingCategory.label} 
                               onChange={e => setEditingCategory({...editingCategory, label: e.target.value})} 
                               required 
                               placeholder="예: 도로보수재"
                             />
                          </div>
                          <div>
                              <label className="label">🏆 메인페이지 대표제품</label>
                              <p className="text-xs text-slate-500 mb-2">메인페이지 카테고리 섹션에 표시될 대표제품을 선택합니다. 미선택 시 첫 번째 제품이 표시됩니다.</p>
                              {(() => {
                                const catProducts = products.filter(p => p.category === editingCategory.id);
                                return catProducts.length > 0 ? (
                                  <select
                                    className="input-field"
                                    value={editingCategory.representativeProductId || ''}
                                    onChange={e => setEditingCategory({...editingCategory, representativeProductId: e.target.value || undefined})}
                                  >
                                    <option value="">자동 (첫 번째 제품)</option>
                                    {catProducts.map(p => (
                                      <option key={p.id} value={p.id}>
                                        {p.name}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <p className="text-sm text-slate-400 italic">이 카테고리에 등록된 제품이 없습니다.</p>
                                );
                              })()}
                          </div>
                          <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-lg font-bold mt-4 hover:bg-emerald-700 transition">저장</button>
                       </div>
                    </form>
                 )}
              </div>
            )}

            {/* --- CONTACT TAB (Branches & Company View) --- */}
            {activeTab === 'CONTACT' && (
              <div className="animate-fade-in-up">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                       <MapPin className="mr-2 text-emerald-600" /> 고객센터 관리
                    </h2>
                    <button onClick={createNewBranch} className="flex items-center gap-2 bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-emerald-700 shadow-md text-sm">
                       <Plus size={16} /> 지점 추가
                    </button>
                 </div>
                 
                 {/* Company View Image Section */}
                 {!editingBranch && (
                   <div className="bg-white border border-slate-200 rounded-lg p-6 mb-8">
                      <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                        <ImageIcon size={20} className="text-emerald-600"/> 회사 전경 사진 (Company Overview Image)
                      </h3>
                      <p className="text-sm text-slate-500 mb-4">고객지원 페이지 최상단에 표시될 회사 전경 이미지입니다.</p>
                      <ImageInput 
                        label="이미지 업로드" 
                        value={(companyInfo as any).companyViewUrl || ''} 
                        onChange={(url) => updateCompanyInfo({ ...companyInfo, companyViewUrl: url } as any)} 
                      />

                      <div className="mt-4">
                        <label className="label">카카오톡 채널 URL (1:1 상담)</label>
                        <input 
                           className="input-field" 
                           placeholder="예: http://pf.kakao.com/_aZxjxmn"
                           value={(companyInfo as any).kakaoChannelUrl || ''}
                           onChange={(e) => updateCompanyInfo({ ...companyInfo, kakaoChannelUrl: e.target.value } as any)}
                        />
                        <p className="text-xs text-slate-400 mt-1">입력 시 고객지원 페이지에 '카카오톡 상담하기' 버튼이 표시됩니다.</p>
                      </div>
                   </div>
                 )}

                 <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                    <List size={20} className="text-emerald-600"/> 지점 목록 관리
                 </h3>
                 <p className="text-sm text-slate-500 mb-6">본사 및 지점 정보를 관리합니다. 고객지원 페이지에 표시됩니다.</p>

                 {!editingBranch ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {branches.map((branch) => (
                        <div 
                          key={branch.id} 
                          className={`border rounded-lg p-6 transition flex flex-col justify-between ${dragOverBranchId === branch.id ? (branches.findIndex(b => b.id === draggedBranchId) < branches.findIndex(b => b.id === branch.id) ? 'border-b-4 border-b-emerald-500 bg-emerald-50/30' : 'border-t-4 border-t-emerald-500 bg-emerald-50/30') : 'border-slate-200 bg-white hover:shadow-md'} ${draggedBranchId === branch.id ? 'opacity-40' : ''}`}
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
                          onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
                          onDrop={(e) => {
                            e.preventDefault();
                            handleDropBranch(branch.id);
                          }}
                        >
                           <div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded uppercase">{branch.id}</span>
                                <h3 className="font-bold text-lg text-slate-800">{branch.name}</h3>
                              </div>
                              <div className="space-y-1 text-sm text-slate-600 mb-4">
                                 <p className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0 text-slate-400"/> {branch.address}</p>
                                 <p className="flex items-center gap-2"><Phone size={14} className="text-slate-400"/> {branch.phone}</p>
                              </div>
                           </div>
                           <div className="flex justify-end gap-2 border-t pt-4">
                              <button onClick={() => setEditingBranch(branch)} className="flex items-center gap-1 px-3 py-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded transition text-sm font-bold">
                                <Edit2 size={14} /> 수정
                              </button>
                              <button onClick={() => { if(confirm('정말 삭제하시겠습니까?')) deleteBranch(branch.id) }} className="flex items-center gap-1 px-3 py-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition text-sm font-bold">
                                <Trash2 size={14} /> 삭제
                              </button>
                           </div>
                        </div>
                      ))}
                   </div>
                 ) : (
                    <form onSubmit={handleBranchSubmit} className="bg-slate-50 border border-slate-200 rounded-xl p-6 relative max-w-lg">
                       <button type="button" onClick={() => setEditingBranch(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X /></button>
                       <h3 className="font-bold mb-4 text-lg">
                         {branches.some(b => b.id === editingBranch.id) ? '지점 정보 수정' : '새 지점 추가'}
                       </h3>
                       
                       <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="label">지점 ID (영문/숫자)</label>
                                <input 
                                  className="input-field font-mono" 
                                  value={editingBranch.id} 
                                  onChange={e => setEditingBranch({...editingBranch, id: e.target.value})} 
                                  required 
                                  placeholder="예: hq"
                                  disabled={branches.some(b => b.id === editingBranch.id)} 
                                />
                             </div>
                             <div>
                                <label className="label">지점명</label>
                                <input 
                                  className="input-field" 
                                  value={editingBranch.name} 
                                  onChange={e => setEditingBranch({...editingBranch, name: e.target.value})} 
                                  required 
                                  placeholder="예: 본사"
                                />
                             </div>
                          </div>
                          <div>
                             <label className="label">주소</label>
                             <input 
                               className="input-field" 
                               value={editingBranch.address} 
                               onChange={e => setEditingBranch({...editingBranch, address: e.target.value})} 
                               required 
                             />
                          </div>
                          <div>
                             <label className="label">전화번호</label>
                             <input 
                               className="input-field" 
                               value={editingBranch.phone} 
                               onChange={e => setEditingBranch({...editingBranch, phone: e.target.value})} 
                               required 
                               placeholder="예: 043-883-0602"
                             />
                          </div>
                          <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-lg font-bold mt-4 hover:bg-emerald-700 transition">저장</button>
                       </div>
                    </form>
                 )}
              </div>
            )}
            
            {/* --- MARKS TAB --- */}
            {activeTab === 'MARKS' && (
              <div className="animate-fade-in-up">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                       <Award className="mr-2 text-emerald-600" /> 인증마크 관리
                    </h2>
                    <button onClick={createNewMark} className="flex items-center gap-2 bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-emerald-700 shadow-md text-sm">
                       <Plus size={16} /> 마크 추가
                    </button>
                 </div>
                 {/* ... Marks Content ... */}
                 {!editingMark ? (
                   <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {certificationMarks.map(mark => (
                        <div key={mark.id} className="border border-slate-200 rounded-lg p-4 bg-white hover:shadow-md transition flex flex-col items-center text-center group relative">
                           <div className="w-16 h-16 bg-slate-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden border border-slate-100">
                             {mark.imageUrl ? <img src={mark.imageUrl} alt={mark.name} className="w-full h-full object-contain" /> : <Award size={24} className="text-slate-300" />}
                           </div>
                           <h4 className="font-bold text-sm text-slate-800">{mark.name}</h4>
                           <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-lg p-1 shadow-sm">
                              <button onClick={() => setEditingMark(mark)} className="p-1 text-slate-400 hover:text-emerald-600"><Edit2 size={14} /></button>
                              <button onClick={() => { if(confirm('삭제하시겠습니까?')) deleteCertificationMark(mark.id) }} className="p-1 text-slate-400 hover:text-red-600"><Trash2 size={14} /></button>
                           </div>
                        </div>
                      ))}
                   </div>
                 ) : (
                   <form onSubmit={handleMarkSubmit} className="bg-slate-50 border border-slate-200 rounded-xl p-6 relative max-w-lg">
                      <button type="button" onClick={() => setEditingMark(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X /></button>
                      <h3 className="font-bold mb-4 text-lg">인증마크 수정</h3>
                      <div className="space-y-4">
                         <div>
                            <label className="label">마크 이름 (관리용)</label>
                            <input className="input-field" value={editingMark.name} onChange={e => setEditingMark({...editingMark, name: e.target.value})} required />
                         </div>
                         <ImageInput 
                           label="마크 아이콘 (PNG 권장, 배경 투명)" 
                           value={editingMark.imageUrl} 
                           onChange={(url) => setEditingMark({...editingMark, imageUrl: url})} 
                         />
                         <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-lg font-bold">저장</button>
                      </div>
                   </form>
                 )}
              </div>
            )}

            {/* --- CALCULATOR TAB --- */}
            {activeTab === 'CALCULATOR' && (
              <div className="animate-fade-in-up">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                       <Clock className="mr-2 text-emerald-600" /> 사용량 계산기 설정
                    </h2>
                 </div>
                 <p className="text-sm text-slate-500 mb-6">사용량 계산기에 표시될 제품 이미지와 기본 밀도 값을 설정합니다.</p>

                 <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-2xl">
                    <div className="space-y-6">
                       <ImageInput 
                         label="포대 제품 이미지 (50포 미만 시 표시)" 
                         value={calculatorSettings.bagImageUrl} 
                         onChange={(url) => updateCalculatorSettings({...calculatorSettings, bagImageUrl: url})} 
                       />
                       <ImageInput 
                         label="파레트 적재 이미지 (50포 이상 시 표시)" 
                         value={calculatorSettings.palletImageUrl} 
                         onChange={(url) => updateCalculatorSettings({...calculatorSettings, palletImageUrl: url})} 
                       />
                       <div>
                          <label className="label">기본 밀도 (kg/m³)</label>
                          <input 
                            type="number"
                            step="0.1"
                            className="input-field" 
                            value={calculatorSettings.density || ''} 
                            onChange={e => updateCalculatorSettings({...calculatorSettings, density: parseFloat(e.target.value) || 2.3})} 
                          />
                          <p className="text-xs text-slate-400 mt-1">기본값: 2.3 (아스콘/콘크리트 일반 밀도)</p>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {/* --- PRODUCTS TAB --- */}
            {activeTab === 'PRODUCTS' && (
              <div className="animate-fade-in-up">
                <div className="flex justify-between items-center mb-4">
                   <h2 className="text-2xl font-bold text-slate-800">제품 관리 ({products.length})</h2>
                   <button onClick={createNewProduct} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-700 shadow-md transition">
                     <Plus size={20} /> 새 제품 추가
                   </button>
                </div>
                <p className="text-sm text-slate-500 mb-6">카테고리별로 제품이 분류됩니다. <span className="text-emerald-600 font-medium">⬍ 드래그하여 순서를 변경</span>하면 제품소개 페이지에 그대로 반영됩니다.</p>

                {!editingProduct ? (
                  <div className="space-y-6">
                    {categories.map((cat) => {
                      const catProducts = products.filter(p => p.category === cat.id);
                      const isCollapsed = collapsedCategories.has(cat.id);
                      return (
                        <div key={cat.id} className="border border-slate-200 rounded-xl bg-white overflow-hidden">
                          {/* Category Header */}
                          <button
                            onClick={() => {
                              setCollapsedCategories(prev => {
                                const next = new Set(prev);
                                if (next.has(cat.id)) next.delete(cat.id);
                                else next.add(cat.id);
                                return next;
                              });
                            }}
                            className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 hover:bg-slate-100 transition text-left border-b border-slate-200"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-slate-300 cursor-move hover:text-emerald-500 transition-colors shrink-0">
                                <GripVertical size={20} />
                              </span>
                              <div className="bg-emerald-600 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold">
                                {catProducts.length}
                              </div>
                              <div>
                                <h3 className="font-bold text-slate-800 text-lg">{cat.label}</h3>
                                <span className="text-xs text-slate-400 font-mono">{cat.id}</span>
                              </div>
                            </div>
                            <svg className={`w-5 h-5 text-slate-400 transition-transform ${isCollapsed ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </button>

                          {/* Products List */}
                          {!isCollapsed && (
                            <div className="divide-y divide-slate-100">
                              {catProducts.length === 0 ? (
                                <div className="px-5 py-8 text-center text-sm text-slate-400 italic">
                                  이 카테고리에 등록된 제품이 없습니다.
                                </div>
                              ) : (
                                catProducts.map((product, pIdx) => {
                                  const isDragging = draggedProductId === product.id;
                                  const isDragOver = dragOverProductId === product.id && draggedProductId !== product.id;
                                  return (
                                    <div
                                      key={product.id}
                                      draggable
                                      onDragStart={(e) => {
                                        setDraggedProductId(product.id);
                                        e.dataTransfer.effectAllowed = 'move';
                                        e.dataTransfer.setData('text/plain', product.id);
                                      }}
                                      onDragEnd={() => {
                                        setDraggedProductId(null);
                                        setDragOverProductId(null);
                                        prodDragCounterRef.current = {};
                                      }}
                                      onDragEnter={(e) => {
                                        e.preventDefault();
                                        if (!prodDragCounterRef.current[product.id]) prodDragCounterRef.current[product.id] = 0;
                                        prodDragCounterRef.current[product.id]++;
                                        if (draggedProductId && draggedProductId !== product.id) {
                                          // Only allow drag within same category
                                          const draggedProduct = products.find(p => p.id === draggedProductId);
                                          if (draggedProduct && draggedProduct.category === product.category) {
                                            setDragOverProductId(product.id);
                                          }
                                        }
                                      }}
                                      onDragLeave={(e) => {
                                        e.preventDefault();
                                        if (prodDragCounterRef.current[product.id]) prodDragCounterRef.current[product.id]--;
                                        if (prodDragCounterRef.current[product.id] <= 0) {
                                          prodDragCounterRef.current[product.id] = 0;
                                          if (dragOverProductId === product.id) {
                                            setDragOverProductId(null);
                                          }
                                        }
                                      }}
                                      onDragOver={(e) => {
                                        e.preventDefault();
                                        e.dataTransfer.dropEffect = 'move';
                                      }}
                                      onDrop={(e) => {
                                        e.preventDefault();
                                        prodDragCounterRef.current = {};
                                        if (!draggedProductId || draggedProductId === product.id) return;
                                        const draggedProduct = products.find(p => p.id === draggedProductId);
                                        if (!draggedProduct || draggedProduct.category !== product.category) return;
                                        // Reorder within category: rebuild full product array
                                        const thisCatProducts = products.filter(p => p.category === cat.id);
                                        const otherProducts = products.filter(p => p.category !== cat.id);
                                        const fromIdx = thisCatProducts.findIndex(p => p.id === draggedProductId);
                                        const toIdx = thisCatProducts.findIndex(p => p.id === product.id);
                                        if (fromIdx === -1 || toIdx === -1) return;
                                        const reordered = [...thisCatProducts];
                                        const [moved] = reordered.splice(fromIdx, 1);
                                        reordered.splice(toIdx, 0, moved);
                                        // Rebuild full product array preserving other categories
                                        const newProducts: typeof products = [];
                                        categories.forEach(c => {
                                          if (c.id === cat.id) {
                                            newProducts.push(...reordered);
                                          } else {
                                            newProducts.push(...products.filter(p => p.category === c.id));
                                          }
                                        });
                                        // Add any products with unknown category
                                        const allCatIds = categories.map(c => c.id);
                                        newProducts.push(...products.filter(p => !allCatIds.includes(p.category)));
                                        reorderProducts(newProducts);
                                        setDraggedProductId(null);
                                        setDragOverProductId(null);
                                      }}
                                      className={`flex items-center gap-4 px-5 py-3 transition-all cursor-grab active:cursor-grabbing ${
                                        isDragging
                                          ? 'opacity-40 bg-slate-100'
                                          : isDragOver
                                            ? 'bg-emerald-50 ring-2 ring-emerald-300 ring-inset'
                                            : 'bg-white hover:bg-slate-50'
                                      }`}
                                      style={{ transition: isDragging ? 'none' : 'all 0.15s ease' }}
                                    >
                                      <div className="text-slate-300 hover:text-slate-500 transition cursor-grab active:cursor-grabbing shrink-0" title="드래그하여 순서 변경">
                                        <GripVertical size={18} />
                                      </div>
                                      <div className="bg-slate-100 text-slate-500 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                                        {pIdx + 1}
                                      </div>
                                      <div className="w-14 h-14 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                          <h3 className="font-bold text-slate-900 truncate">{product.name}</h3>
                                          {product.isNew && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">NEW</span>}
                                          {product.isEco && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold">ECO</span>}
                                        </div>
                                        <p className="text-xs text-slate-400 truncate mt-0.5">{product.description}</p>
                                      </div>
                                      <div className="flex gap-1 shrink-0">
                                        <button onClick={(e) => { e.stopPropagation(); setEditingProduct(product); }} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition">
                                          <Edit2 size={15} />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); if(confirm('삭제하시겠습니까?')) deleteProduct(product.id) }} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition">
                                          <Trash2 size={15} />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {/* Products with no/unknown category */}
                    {(() => {
                      const allCatIds = categories.map(c => c.id);
                      const uncategorized = products.filter(p => !allCatIds.includes(p.category));
                      if (uncategorized.length === 0) return null;
                      return (
                        <div className="border border-amber-200 rounded-xl bg-amber-50 overflow-hidden">
                          <div className="px-5 py-4 bg-amber-100 border-b border-amber-200">
                            <h3 className="font-bold text-amber-800">⚠ 미분류 제품 ({uncategorized.length})</h3>
                          </div>
                          <div className="divide-y divide-amber-100">
                            {uncategorized.map(product => (
                              <div key={product.id} className="flex items-center gap-4 px-5 py-3 bg-white hover:bg-amber-50 transition">
                                <div className="w-14 h-14 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-bold text-slate-900 truncate">{product.name}</h3>
                                  <span className="text-xs text-amber-600 font-mono">카테고리: {product.category}</span>
                                </div>
                                <div className="flex gap-1 shrink-0">
                                  <button onClick={() => setEditingProduct(product)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition"><Edit2 size={15} /></button>
                                  <button onClick={() => { if(confirm('삭제하시겠습니까?')) deleteProduct(product.id) }} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"><Trash2 size={15} /></button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <form onSubmit={handleProductSubmit} className="bg-slate-50 border border-slate-200 rounded-xl p-6 relative">
                    <button type="button" onClick={() => setEditingProduct(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X /></button>
                    <h3 className="text-xl font-bold mb-6 text-slate-900 border-b pb-2">
                       {products.find(p => p.id === editingProduct.id) ? '제품 수정' : '새 제품 등록'}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="label">제품명</label>
                        <input className="input-field" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} required />
                      </div>
                      <div>
                        <label className="label">카테고리</label>
                        <select 
                          className="input-field" 
                          value={editingProduct.category} 
                          onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}
                        >
                           {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <ImageInput 
                          label="제품 이미지" 
                          value={editingProduct.imageUrl} 
                          onChange={(url) => setEditingProduct({...editingProduct, imageUrl: url})} 
                        />
                      </div>
                      
                      <div className="md:col-span-2 bg-white p-4 rounded-lg border border-slate-200">
                         <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                            <CheckSquare size={16} className="text-emerald-600" /> 인증마크 선택
                         </h4>
                         <p className="text-xs text-slate-500 mb-3">선택한 마크는 제품 카드 이미지 상단에 표시됩니다.</p>
                         
                         {certificationMarks.length > 0 ? (
                            <div className="flex flex-wrap gap-3">
                               {certificationMarks.map(mark => {
                                 const isChecked = editingProduct.certificationMarkIds?.includes(mark.id);
                                 return (
                                   <label key={mark.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${isChecked ? 'bg-emerald-50 border-emerald-400' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
                                      <input 
                                        type="checkbox" 
                                        className="rounded text-emerald-600 focus:ring-emerald-500"
                                        checked={isChecked || false}
                                        onChange={(e) => {
                                           const currentIds = editingProduct.certificationMarkIds || [];
                                           if (e.target.checked) {
                                              setEditingProduct({...editingProduct, certificationMarkIds: [...currentIds, mark.id]});
                                           } else {
                                              setEditingProduct({...editingProduct, certificationMarkIds: currentIds.filter(id => id !== mark.id)});
                                           }
                                        }}
                                      />
                                      {mark.imageUrl && <img src={mark.imageUrl} alt={mark.name} className="w-5 h-5 object-contain" />}
                                      <span className="text-sm font-medium text-slate-700">{mark.name}</span>
                                   </label>
                                 );
                               })}
                            </div>
                         ) : (
                            <div className="text-sm text-slate-400 italic">등록된 인증마크가 없습니다. '인증마크 관리' 탭에서 먼저 등록해주세요.</div>
                         )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="label">제품 설명</label>
                        <textarea className="input-field min-h-[80px]" value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} required />
                      </div>
                      
                      <div className="md:col-span-2 bg-white p-4 rounded-lg border border-slate-200">
                        <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">📂 제품 관련 문서 (다운로드용)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <PdfInput 
                            label="시방서 (Specification)" 
                            value={editingProduct.specUrl} 
                            onChange={(url) => setEditingProduct({...editingProduct, specUrl: url})} 
                          />
                          <PdfInput 
                            label="MSDS (물질안전보건자료)" 
                            value={editingProduct.msdsUrl} 
                            onChange={(url) => setEditingProduct({...editingProduct, msdsUrl: url})} 
                          />
                        </div>
                      </div>

                       <div className="md:col-span-2 bg-white p-4 rounded-lg border border-slate-200">
                         <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                           <span>📐</span> 시공방법 이미지
                         </h4>
                         <p className="text-xs text-slate-500 mb-4">제품 상세 팝업 하단에 전체 너비로 표시되는 시공방법 안내 이미지입니다.</p>
                         <ImageInput
                           label="시공방법 이미지 업로드"
                           value={editingProduct.constructionImageUrl || ''}
                           onChange={(url) => setEditingProduct({...editingProduct, constructionImageUrl: url})}
                         />
                       </div>
                    </div>

                    <div className="mb-6">
                      <label className="label flex justify-between">주요 특징 <button type="button" onClick={() => setEditingProduct({...editingProduct, features: [...editingProduct.features, '']})} className="text-xs text-emerald-600 font-bold">+ 추가</button></label>
                      <div className="space-y-2">
                        {editingProduct.features.map((feat, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input className="input-field" value={feat} onChange={e => {
                              const newFeats = [...editingProduct.features];
                              newFeats[idx] = e.target.value;
                              setEditingProduct({...editingProduct, features: newFeats});
                            }} />
                            <button type="button" onClick={() => {
                               const newFeats = editingProduct.features.filter((_, i) => i !== idx);
                               setEditingProduct({...editingProduct, features: newFeats});
                            }} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Specs Editor */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <label className="label">기술 사양 (Specs)</label>
                        <div className="flex items-center gap-2 bg-white px-3 py-1 rounded border border-slate-200 shadow-sm">
                           <input 
                             type="checkbox" 
                             id="useTableSpecs" 
                             checked={useTableSpecs} 
                             onChange={(e) => {
                                setUseTableSpecs(e.target.checked);
                                if(e.target.checked && !editingProduct.specTable) {
                                   setEditingProduct({
                                     ...editingProduct, 
                                     specTable: { headers: ['항목', '내용'], rows: [['', '']] }
                                   });
                                } else if (!e.target.checked) {
                                   const { specTable, ...rest } = editingProduct;
                                   setEditingProduct(rest);
                                }
                             }}
                             className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                           />
                           <label htmlFor="useTableSpecs" className="text-sm font-bold text-slate-600 cursor-pointer select-none flex items-center gap-1">
                              <TableIcon size={14} /> 고급 테이블 모드 (다중 열)
                           </label>
                        </div>
                      </div>

                      {useTableSpecs && editingProduct.specTable ? (
                        <div className="overflow-x-auto bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                           {/* Grid Editor: header row + data rows share the same column tracks so they always align */}
                           <div
                             className="grid gap-2 items-center"
                             style={{ gridTemplateColumns: `1.5rem repeat(${editingProduct.specTable.headers.length}, minmax(120px, 1fr)) 2.5rem` }}
                           >
                              {/* --- Header Row --- */}
                              <div className="mb-2" />
                              {editingProduct.specTable.headers.map((h, i) => (
                                 <div key={`h-${i}`} className="relative group mb-2">
                                    <input
                                      value={h}
                                      onChange={(e) => updateSpecHeader(i, e.target.value)}
                                      className="input-field font-bold bg-slate-50 text-center focus:bg-white"
                                      placeholder={`열 ${i+1}`}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeSpecColumn(i)}
                                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow-sm z-10 hover:bg-red-600"
                                      title="열 삭제"
                                    >
                                      <X size={10} />
                                    </button>
                                 </div>
                              ))}
                              <button
                                type="button"
                                onClick={addSpecColumn}
                                className="flex items-center justify-center self-stretch mb-2 bg-emerald-100 text-emerald-600 rounded hover:bg-emerald-200 transition"
                                title="열 추가"
                              >
                                <Plus size={20} />
                              </button>

                              {/* --- Data Rows --- */}
                              {editingProduct.specTable.rows.map((row, rIdx) => (
                                 <React.Fragment key={`r-${rIdx}`}>
                                    <div className="text-xs text-slate-300 text-center">{rIdx + 1}</div>
                                    {row.map((cell, cIdx) => (
                                       <div key={cIdx}>
                                          <input
                                            value={cell}
                                            onChange={(e) => updateSpecCell(rIdx, cIdx, e.target.value)}
                                            className="input-field"
                                          />
                                       </div>
                                    ))}
                                    <button
                                       type="button"
                                       onClick={() => removeSpecRow(rIdx)}
                                       className="flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition h-full"
                                    >
                                       <Trash2 size={16} />
                                    </button>
                                 </React.Fragment>
                              ))}
                           </div>

                           <button
                             type="button"
                             onClick={addSpecRow}
                             className="mt-4 flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg hover:bg-emerald-100 transition"
                           >
                             <Plus size={16} /> 행 추가
                           </button>
                        </div>
                      ) : (
                        /* Standard KV Editor */
                        <div className="space-y-2 bg-white p-4 rounded-lg border border-slate-200">
                          {(!editingProduct.specs || Object.keys(editingProduct.specs).length === 0) && (
                            <div className="text-center text-sm text-slate-400 py-4">
                              등록된 기술 사양이 없습니다. '행 추가' 버튼을 눌러 추가하세요.
                            </div>
                          )}
                          {editingProduct.specs && Object.entries(editingProduct.specs).map(([key, val], idx) => (
                            <div key={idx} className="flex gap-2 items-center group">
                              <div className="w-8 text-center text-xs text-slate-300 font-mono shrink-0">{idx + 1}</div>
                              <div className="w-1/3 shrink-0">
                                <input
                                  className="input-field focus:bg-emerald-50 transition-colors"
                                  value={key}
                                  onChange={e => {
                                     const newKey = e.target.value;
                                     const entries = Object.entries(editingProduct.specs || {});
                                     const newSpecs: Record<string, string> = {};
                                     entries.forEach(([k, v]) => {
                                       if (k === key) newSpecs[newKey] = v as string;
                                       else newSpecs[k] = v as string;
                                     });
                                     setEditingProduct({...editingProduct, specs: newSpecs});
                                  }}
                                  placeholder="항목명 (예: 포장 단위)"
                                />
                              </div>
                              <span className="text-slate-400">:</span>
                              <div className="flex-1 min-w-0">
                                <input
                                  className="input-field focus:bg-emerald-50 transition-colors"
                                  value={val}
                                  onChange={e => {
                                     setEditingProduct({...editingProduct, specs: { ...editingProduct.specs, [key]: e.target.value }});
                                  }}
                                  placeholder="내용 (예: 25kg)"
                                />
                              </div>
                              <button type="button" onClick={() => {
                                 const newSpecs = { ...editingProduct.specs };
                                 delete newSpecs[key];
                                 setEditingProduct({...editingProduct, specs: newSpecs});
                              }} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 size={16}/></button>
                            </div>
                          ))}
                          <button type="button" onClick={() => {
                            const specs = editingProduct.specs || {};
                            let count = 1;
                            while (`항목 ${count}` in specs) count++;
                            setEditingProduct({...editingProduct, specs: {...specs, [`항목 ${count}`]: ''}});
                          }} className="mt-2 flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-3 py-2 rounded hover:bg-slate-200 transition font-bold w-full justify-center border border-slate-200">
                            <Plus size={12} /> 행 추가 (기본 모드)
                          </button>
                        </div>
                      )}
                      {!useTableSpecs && <p className="text-xs text-slate-400 mt-2 text-right">* 항목명은 중복될 수 없습니다.</p>}
                    </div>

                    <div className="flex gap-4 border-t pt-4">
                      <button type="submit" className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition">저장하기</button>
                      <button type="button" onClick={() => setEditingProduct(null)} className="px-6 py-3 border border-slate-300 rounded-lg font-bold text-slate-600 hover:bg-slate-100 transition">취소</button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* ... Other Tabs Content ... */}
            {/* --- HERO TAB --- */}
            {activeTab === 'HERO' && (
              <div className="animate-fade-in-up">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                    <Film className="mr-2 text-emerald-600" /> 메인 배너 관리
                  </h2>
                  <button onClick={createNewSlide} className="flex items-center gap-2 bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-emerald-700 shadow-md text-sm">
                    <Plus size={16} /> 슬라이드 추가
                  </button>
                </div>
                <p className="text-sm text-slate-500 mb-6">첫 화면에 나오는 큰 배너(슬라이드)를 관리합니다. 이미지와 동영상을 모두 지원합니다.</p>

                {!editingSlide ? (
                  <div className="space-y-4">
                    {heroSlides.map((slide, index) => (
                      <div key={slide.id} className="border border-slate-200 rounded-lg p-4 bg-white hover:shadow-md transition flex flex-col md:flex-row gap-4 items-center">
                        <div className="w-full md:w-48 h-28 bg-slate-100 rounded-lg overflow-hidden shrink-0 relative flex items-center justify-center">
                          {slide.type === 'video' ? (
                            <div className="relative w-full h-full bg-slate-900">
                               <video src={slide.src} className="w-full h-full object-cover opacity-50" />
                               <div className="absolute inset-0 flex items-center justify-center text-white"><Film size={24}/></div>
                            </div>
                          ) : (
                            <img src={slide.src} alt={slide.title} className="w-full h-full object-cover" />
                          )}
                          <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">{slide.type}</div>
                        </div>
                        
                        <div className="flex-1 text-center md:text-left">
                          <h3 className="font-bold text-slate-800">{slide.title}</h3>
                          <p className="text-sm text-slate-600 font-bold mt-1 text-emerald-600">{slide.subtitle}</p>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">{slide.desc}</p>
                        </div>

                        <div className="flex gap-2">
                          <button onClick={() => setEditingSlide(slide)} className="p-2 text-slate-400 hover:text-emerald-600 bg-slate-50 hover:bg-emerald-50 rounded transition">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => { if(confirm('이 슬라이드를 삭제하시겠습니까?')) deleteHeroSlide(slide.id) }} className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded transition">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {heroSlides.length === 0 && <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-lg border border-dashed">등록된 슬라이드가 없습니다.</div>}
                  </div>
                ) : (
                  <form onSubmit={handleSlideSubmit} className="bg-slate-50 border border-slate-200 rounded-xl p-6 relative max-w-2xl">
                    <button type="button" onClick={() => setEditingSlide(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X /></button>
                    <h3 className="font-bold mb-4 text-lg text-slate-900 border-b pb-2">
                       {heroSlides.some(s => s.id === editingSlide.id) ? '슬라이드 수정' : '새 슬라이드 추가'}
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Type Selection */}
                      <div>
                        <label className="label">미디어 타입</label>
                        <div className="flex gap-4">
                           <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${editingSlide.type === 'image' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-200' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}>
                              <input 
                                type="radio" 
                                name="slideType" 
                                className="hidden" 
                                checked={editingSlide.type === 'image'} 
                                onChange={() => setEditingSlide({...editingSlide, type: 'image'})} 
                              />
                              <ImageIcon size={18} /> 이미지
                           </label>
                           <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${editingSlide.type === 'video' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-200' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}>
                              <input 
                                type="radio" 
                                name="slideType" 
                                className="hidden" 
                                checked={editingSlide.type === 'video'} 
                                onChange={() => setEditingSlide({...editingSlide, type: 'video'})} 
                              />
                              <Film size={18} /> 동영상
                           </label>
                        </div>
                      </div>

                      {/* Media Input */}
                      <div className="bg-white p-4 rounded-lg border border-slate-200">
                         {editingSlide.type === 'image' ? (
                           <div className="space-y-4">
                            <ImageInput 
                              label="배경 이미지 (1920x1080 권장)" 
                              value={editingSlide.src} 
                              onChange={(url) => setEditingSlide({...editingSlide, src: url})} 
                            />
                             <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                               <div className="flex justify-between items-center">
                                  <label className="label mb-0 flex items-center gap-2">
                                    <Clock size={16} className="text-emerald-600"/>
                                    노출 시간 (Duration)
                                  </label>
                                  <div className="text-xs text-slate-500 bg-white px-2 py-1 rounded border">
                                     {editingSlide.duration || 6}초
                                  </div>
                               </div>
                               <input 
                                 type="range" 
                                 min="3" 
                                 max="20" 
                                 step="1"
                                 className="w-full accent-emerald-600 cursor-pointer mt-2"
                                 value={editingSlide.duration || 6}
                                 onChange={e => setEditingSlide({...editingSlide, duration: parseInt(e.target.value)})}
                               />
                               <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                                 <span>3s (최소)</span>
                                 <span>20s (최대)</span>
                               </div>
                             </div>
                           </div>
                         ) : (
                            <div className="space-y-4">
                               <VideoInput 
                                 label="배경 동영상 (MP4, WEBM)" 
                                 value={editingSlide.src} 
                                 onChange={(url) => setEditingSlide({...editingSlide, src: url})} 
                               />
                               <ImageInput 
                                 label="동영상 포스터 (로딩 중 또는 모바일용 이미지)" 
                                 value={editingSlide.poster} 
                                 onChange={(url) => setEditingSlide({...editingSlide, poster: url})} 
                               />
                            </div>
                         )}

                         {/* Fade Out Setting for Video */}
                         {editingSlide.type === 'video' && (
                           <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mt-2">
                             <div className="flex justify-between items-center">
                                <label className="label mb-0 flex items-center gap-2">
                                  <Clock size={16} className="text-emerald-600"/>
                                  다음 슬라이드 전환 타이밍 (Fade Out)
                                </label>
                                <div className="text-xs text-slate-500 bg-white px-2 py-1 rounded border">
                                   영상 종료 {editingSlide.fadeOutDuration || 0}초 전 전환
                                </div>
                             </div>
                             <p className="text-xs text-slate-400 mb-3 mt-1">
                               영상이 완전히 끝나기 전에 미리 다음 슬라이드로 넘어갑니다. (자연스러운 전환 연출)
                             </p>
                             <input 
                               type="range" 
                               min="0" 
                               max="5" 
                               step="0.5"
                               className="w-full accent-emerald-600 cursor-pointer"
                               value={editingSlide.fadeOutDuration || 0}
                               onChange={e => setEditingSlide({...editingSlide, fadeOutDuration: parseFloat(e.target.value)})}
                             />
                             <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                               <span>0s (즉시)</span>
                               <span>1s</span>
                               <span>2s</span>
                               <span>3s</span>
                               <span>4s</span>
                               <span>5s</span>
                             </div>
                           </div>
                         )}
                      </div>

                      {/* Text Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="label">상단 소제목 (Point Text)</label>
                          <input 
                            className="input-field" 
                            value={editingSlide.title} 
                            onChange={e => setEditingSlide({...editingSlide, title: e.target.value})} 
                            placeholder="예: DAHYEON INDUSTRY"
                          />
                        </div>
                        <div>
                          <label className="label">메인 카피 (큰 제목)</label>
                          <textarea 
                            className="input-field h-12 py-2" 
                            value={editingSlide.subtitle} 
                            onChange={e => setEditingSlide({...editingSlide, subtitle: e.target.value})} 
                            placeholder="예: Global Leader in Road Safety"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="label">설명 문구</label>
                          <textarea 
                            className="input-field min-h-[80px]" 
                            value={editingSlide.desc} 
                            onChange={e => setEditingSlide({...editingSlide, desc: e.target.value})} 
                            placeholder="배너에 들어갈 설명 문구를 입력하세요."
                          />
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                         <button type="submit" className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition">저장하기</button>
                         <button type="button" onClick={() => setEditingSlide(null)} className="px-6 py-3 border border-slate-300 rounded-lg font-bold text-slate-600 hover:bg-slate-100 transition">취소</button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            )}
            
            {activeTab === 'DESIGN' && (
               <div className="animate-fade-in-up space-y-12">
                 
                 {/* Logo Settings Section */}
                 <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                       <ImageIcon className="mr-2 text-emerald-600" /> 로고 설정 (Logo)
                    </h2>
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                       <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
                          <div>
                             <h3 className="font-bold text-lg text-slate-800">커스텀 이미지 로고 사용</h3>
                             <p className="text-sm text-slate-500">활성화하면 텍스트 대신 업로드한 로고 이미지를 사용합니다.</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                             <input 
                               type="checkbox" 
                               className="sr-only peer"
                               checked={logoSettings.useCustomLabel}
                               onChange={(e) => updateLogoSettings({...logoSettings, useCustomLabel: e.target.checked})}
                             />
                             <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
                          </label>
                       </div>

                       {logoSettings.useCustomLabel && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up">
                             <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <h4 className="font-bold text-slate-700 mb-2">기본 로고 (Standard)</h4>
                                <p className="text-xs text-slate-500 mb-4">흰색 배경이나 일반적인 상황에서 사용됩니다. (유색 권장)</p>
                                <ImageInput 
                                  label="이미지 업로드" 
                                  value={logoSettings.defaultUrl || ''} 
                                  onChange={(url) => updateLogoSettings({...logoSettings, defaultUrl: url})} 
                                />
                                <div className="mt-4 p-4 bg-white border border-slate-200 rounded-lg flex items-center justify-center h-24">
                                   {logoSettings.defaultUrl ? (
                                      <img src={logoSettings.defaultUrl} alt="Standard Logo" className="max-h-16 object-contain" />
                                   ) : (
                                      <span className="text-slate-300 text-xs">미리보기 없음</span>
                                   )}
                                </div>
                             </div>

                             <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                <h4 className="font-bold text-white mb-2">화이트 로고 (White)</h4>
                                <p className="text-xs text-slate-400 mb-4">투명 헤더나 어두운 배경 위에서 사용됩니다. (흰색 필수)</p>
                                <ImageInput 
                                  label="이미지 업로드" 
                                  value={logoSettings.whiteUrl || ''} 
                                  onChange={(url) => updateLogoSettings({...logoSettings, whiteUrl: url})} 
                                />
                                <div className="mt-4 p-4 bg-slate-900 border border-slate-700 rounded-lg flex items-center justify-center h-24">
                                   {logoSettings.whiteUrl ? (
                                      <img src={logoSettings.whiteUrl} alt="White Logo" className="max-h-16 object-contain" />
                                   ) : (
                                      <span className="text-slate-600 text-xs">미리보기 없음</span>
                                   )}
                                </div>
                             </div>
                          </div>
                       )}
                    </div>
                 </div>

                 <hr className="border-slate-200" />

                 {/* Typography Settings (Existing) */}
                 <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                       <Type className="mr-2 text-emerald-600" /> 글꼴 및 크기 설정
                    </h2>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {/* Global Body Font */}
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                           <div className="flex items-center gap-2 mb-4 border-b pb-2">
                             <Type className="text-slate-400" size={20} />
                             <h3 className="font-bold text-slate-700">기본 본문 (Body)</h3>
                           </div>
                           <div className="space-y-4">
                              <div>
                                 <label className="label">기본 글꼴 (Base Font)</label>
                                 <select 
                                    className="input-field"
                                    value={designSettings.fontFamily}
                                    onChange={(e) => updateDesignSettings({...designSettings, fontFamily: e.target.value})}
                                 >
                                    <option value="Noto Sans KR">Noto Sans KR (기본 / 깔끔함)</option>
                                    <option value="Nanum Gothic">나눔고딕 (Nanum Gothic / 부드러움)</option>
                                    <option value="Gowun Dodum">고운돋움 (Gowun Dodum / 친근함)</option>
                                    <option value="Do Hyeon">도현 (Do Hyeon / 굵고 강렬함)</option>
                                    <option value="Inter">Inter (영문 전용 느낌)</option>
                                 </select>
                              </div>
                              <div>
                                 <label className="label">기본 글자 크기 (Base Size)</label>
                                 <select 
                                    className="input-field"
                                    value={designSettings.fontSize}
                                    onChange={(e) => updateDesignSettings({...designSettings, fontSize: e.target.value as any})}
                                 >
                                    <option value="small">작게 (15px)</option>
                                    <option value="medium">보통 (16px)</option>
                                    <option value="large">크게 (17px)</option>
                                 </select>
                              </div>
                           </div>
                        </div>

                        {/* Header Font */}
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                           <div className="flex items-center gap-2 mb-4 border-b pb-2">
                             <Tag className="text-slate-400" size={20} />
                             <h3 className="font-bold text-slate-700">헤더 (Header)</h3>
                           </div>
                           <div className="space-y-4">
                              <div>
                                 <label className="label">헤더 글꼴</label>
                                 <select 
                                    className="input-field"
                                    value={designSettings.headerFontFamily || 'Noto Sans KR'}
                                    onChange={(e) => updateDesignSettings({...designSettings, headerFontFamily: e.target.value})}
                                 >
                                    <option value="Noto Sans KR">Noto Sans KR</option>
                                    <option value="Nanum Gothic">나눔고딕</option>
                                    <option value="Gowun Dodum">고운돋움</option>
                                    <option value="Do Hyeon">도현</option>
                                    <option value="Inter">Inter</option>
                                 </select>
                              </div>
                              <div>
                                 <label className="label">로고 텍스트 크기</label>
                                 <select 
                                    className="input-field"
                                    value={designSettings.headerTitleSize || 'medium'}
                                    onChange={(e) => updateDesignSettings({...designSettings, headerTitleSize: e.target.value as any})}
                                 >
                                    <option value="small">작게</option>
                                    <option value="medium">보통</option>
                                    <option value="large">크게</option>
                                    <option value="xlarge">아주 크게</option>
                                 </select>
                              </div>
                              <div>
                                 <label className="label">메뉴 글자 크기</label>
                                 <select 
                                    className="input-field"
                                    value={designSettings.headerFontSize || 'medium'}
                                    onChange={(e) => updateDesignSettings({...designSettings, headerFontSize: e.target.value as any})}
                                 >
                                    <option value="small">작게</option>
                                    <option value="medium">보통</option>
                                    <option value="large">크게</option>
                                 </select>
                              </div>
                           </div>
                        </div>

                        {/* Footer Font */}
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                           <div className="flex items-center gap-2 mb-4 border-b pb-2">
                             <Info className="text-slate-400" size={20} />
                             <h3 className="font-bold text-slate-700">풋터 (Footer)</h3>
                           </div>
                           <div className="space-y-4">
                              <div>
                                 <label className="label">풋터 글꼴</label>
                                 <select 
                                    className="input-field"
                                    value={designSettings.footerFontFamily || 'Noto Sans KR'}
                                    onChange={(e) => updateDesignSettings({...designSettings, footerFontFamily: e.target.value})}
                                 >
                                    <option value="Noto Sans KR">Noto Sans KR</option>
                                    <option value="Nanum Gothic">나눔고딕</option>
                                    <option value="Gowun Dodum">고운돋움</option>
                                    <option value="Do Hyeon">도현</option>
                                    <option value="Inter">Inter</option>
                                 </select>
                              </div>
                              <div>
                                 <label className="label">풋터 글자 크기</label>
                                 <select 
                                    className="input-field"
                                    value={designSettings.footerFontSize || 'small'}
                                    onChange={(e) => updateDesignSettings({...designSettings, footerFontSize: e.target.value as any})}
                                 >
                                    <option value="small">작게</option>
                                    <option value="medium">보통</option>
                                    <option value="large">크게</option>
                                 </select>
                              </div>
                           </div>
                        </div>
                     </div>
                 </div>
              </div>
            )}
            
            {activeTab === 'INFO' && (
              <div className="animate-fade-in-up max-w-2xl">
                 <h2 className="text-2xl font-bold text-slate-800 mb-6">회사 기본 정보 설정</h2>
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
                   <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div className="col-span-2 text-sm text-slate-500 font-bold mb-1">헤더(Header) 및 로고 텍스트 설정</div>
                      <div>
                        <label className="label">헤더 브랜드명 (Header Title)</label>
                        <input type="text" name="headerTitle" value={companyInfo.headerTitle || ''} onChange={handleInfoChange} className="input-field" placeholder="DAHYEON"/>
                      </div>
                      <div>
                        <label className="label">헤더 서브텍스트 (Subtitle)</label>
                        <input type="text" name="headerSubtitle" value={companyInfo.headerSubtitle || ''} onChange={handleInfoChange} className="input-field" placeholder="INDUSTRY"/>
                      </div>
                   </div>

                   <div>
                     <label className="label">풋터 설명 문구 (Footer Description)</label>
                     <textarea name="footerDesc" value={companyInfo.footerDesc || ''} onChange={handleInfoChange} className="input-field h-24 resize-none" placeholder="회사 소개 문구를 입력하세요." />
                   </div>

                   <hr className="my-4"/>

                   <div>
                     <label className="label">회사명 (한글)</label>
                     <input type="text" name="name" value={String(companyInfo.name || '')} onChange={handleInfoChange} className="input-field" />
                   </div>
                   <div>
                     <label className="label">회사명 (영문)</label>
                     <input type="text" name="englishName" value={String(companyInfo.englishName || '')} onChange={handleInfoChange} className="input-field" />
                   </div>
                   <div>
                     <label className="label">주소</label>
                     <input type="text" name="address" value={String(companyInfo.address || '')} onChange={handleInfoChange} className="input-field" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="label">전화번호</label>
                       <input type="text" name="phone" value={String(companyInfo.phone || '')} onChange={handleInfoChange} className="input-field" />
                     </div>
                     <div>
                       <label className="label">팩스</label>
                       <input type="text" name="fax" value={String(companyInfo.fax || '')} onChange={handleInfoChange} className="input-field" />
                     </div>
                   </div>
                    <hr className="my-4"/>
                    <h4 className="font-bold text-slate-800 mb-2">온라인 문의 수신 설정</h4>
                    <div>
                      <label className="label">수신자 이메일 (관리자 이메일)</label>
                      <input type="text" name="email" value={String(companyInfo.email || '')} onChange={handleInfoChange} className="input-field" placeholder="admin@domain.com" />
                      <p className="text-xs text-slate-400 mt-1">이메일 주소를 입력하면 고객이 온라인 문의를 남길 때 이 주소로 메일이 발송됩니다.</p>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-lg mt-4 border border-slate-200">
                      <h4 className="font-bold text-slate-700 mb-2 text-sm">SMTP 메일 발송 서버 설정 (Nodemailer)</h4>
                      <p className="text-xs text-slate-500 mb-4">메일을 실제로 전송하기 위한 보내는 서버(예: Gmail, 네이버) 정보를 입력하세요.</p>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="label text-xs">SMTP Host</label>
                          <input type="text" value={appSettings.smtpHost || ''} onChange={(e) => updateAppSettings({...appSettings, smtpHost: e.target.value})} className="input-field text-sm" placeholder="smtp.gmail.com" />
                        </div>
                        <div>
                          <label className="label text-xs">SMTP Port</label>
                          <input type="number" value={appSettings.smtpPort || ''} onChange={(e) => updateAppSettings({...appSettings, smtpPort: parseInt(e.target.value, 10)})} className="input-field text-sm" placeholder="465" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="label text-xs">SMTP 아이디(이메일)</label>
                          <input type="text" value={appSettings.smtpUser || ''} onChange={(e) => updateAppSettings({...appSettings, smtpUser: e.target.value})} className="input-field text-sm" placeholder="user@gmail.com" />
                        </div>
                        <div>
                          <label className="label text-xs">SMTP 비밀번호(앱 비밀번호)</label>
                          <input type="password" value={appSettings.smtpPass || ''} onChange={(e) => updateAppSettings({...appSettings, smtpPass: e.target.value})} className="input-field text-sm" placeholder="password" />
                        </div>
                      </div>
                    </div>
                   <div>
                     <label className="label">슬로건</label>
                     <textarea name="slogan" value={String(companyInfo.slogan || '')} onChange={handleInfoChange} className="input-field h-24 resize-none" />
                   </div>
                    <div className="mt-4">
                      <PdfInput 
                        label="종합 카탈로그 PDF 업로드" 
                        value={(companyInfo as any).catalogUrl || ''} 
                        onChange={(url) => updateCompanyInfo({ ...companyInfo, catalogUrl: url } as any)} 
                      />
                    </div>
                 </div>
                 <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
                    * 이곳에서 수정된 정보는 헤더(Header)와 풋터(Footer), 고객센터 페이지에 자동으로 반영됩니다.
                 </div>
               </div>
            )}
            
            {activeTab === 'TECHNOLOGY' && (
               <div className="animate-fade-in-up space-y-12">
                {/* Lab Equipment Section */}
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                      <Beaker className="mr-2 text-emerald-600" /> 실험 장비 관리
                    </h2>
                    <button onClick={createNewLabItem} className="flex items-center gap-2 bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-emerald-700 shadow-md text-sm">
                      <Plus size={16} /> 장비 추가
                    </button>
                  </div>
                  
                  {!editingLabItem ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {labEquipment.map(item => (
                        <div 
                          key={item.id} 
                          className={`border p-4 rounded-lg flex items-center gap-4 transition ${dragOverLabId === item.id ? (labEquipment.findIndex(i => i.id === draggedLabId) < labEquipment.findIndex(i => i.id === item.id) ? 'border-b-4 border-b-emerald-500 bg-emerald-50/30' : 'border-t-4 border-t-emerald-500 bg-emerald-50/30') : 'border-slate-200 bg-white hover:shadow-md'} ${draggedLabId === item.id ? 'opacity-40' : ''}`}
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
                          onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
                          onDrop={(e) => {
                            e.preventDefault();
                            handleDropLab(item.id);
                          }}
                        >
                          <span className="text-slate-300 cursor-move hover:text-emerald-500 transition-colors shrink-0">
                            <GripVertical size={20} />
                          </span>
                          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                             {item.imageUrl ? (
                               <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                             ) : (
                               <IconRenderer name={item.iconName} size={24} />
                             )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-900">{item.title}</h4>
                            <p className="text-xs text-slate-500 line-clamp-1">{item.desc}</p>
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => setEditingLabItem(item)} className="p-1.5 text-slate-400 hover:text-emerald-600"><Edit2 size={16} /></button>
                            <button onClick={() => { if(confirm('삭제하시겠습니까?')) deleteLabEquipment(item.id) }} className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <form onSubmit={handleLabSubmit} className="bg-slate-50 border border-slate-200 rounded-xl p-6 relative">
                      <button type="button" onClick={() => setEditingLabItem(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X /></button>
                      <h3 className="font-bold mb-4 text-lg">장비 정보 수정</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="label">장비명</label>
                          <input className="input-field" value={editingLabItem.title} onChange={e => setEditingLabItem({...editingLabItem, title: e.target.value})} required />
                        </div>
                        <div>
                          <label className="label">설명</label>
                          <input className="input-field" value={editingLabItem.desc} onChange={e => setEditingLabItem({...editingLabItem, desc: e.target.value})} required />
                        </div>
                        
                        <ImageInput 
                          label="장비 사진 (선택)" 
                          value={editingLabItem.imageUrl} 
                          onChange={(url) => setEditingLabItem({...editingLabItem, imageUrl: url})} 
                        />

                        <div>
                          <label className="label">아이콘 (사진 없을 시 표시)</label>
                          <IconPicker selectedIcon={editingLabItem.iconName} onSelect={(iconName) => setEditingLabItem({...editingLabItem, iconName})} />
                        </div>
                        <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-lg font-bold">저장</button>
                      </div>
                    </form>
                  )}
                </div>

                <hr className="border-slate-200" />

                {/* Certifications Section */}
                <div>
                   <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                      <Award className="mr-2 text-emerald-600" /> 인증 및 특허 관리
                    </h2>
                    <button onClick={createNewCert} className="flex items-center gap-2 bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-emerald-700 shadow-md text-sm">
                      <Plus size={16} /> 인증 추가
                    </button>
                  </div>

                  {!editingCert ? (
                    <div className="space-y-3">
                       {certifications.map(cert => (
                         <div 
                           key={cert.id} 
                           className={`flex items-center justify-between p-4 border rounded-lg transition ${dragOverCertId === cert.id ? (certifications.findIndex(c => c.id === draggedCertId) < certifications.findIndex(c => c.id === cert.id) ? 'border-b-4 border-b-emerald-500 bg-emerald-50/30' : 'border-t-4 border-t-emerald-500 bg-emerald-50/30') : 'border-slate-200 bg-white hover:shadow-sm'} ${draggedCertId === cert.id ? 'opacity-40' : ''}`}
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
                           onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
                           onDrop={(e) => {
                             e.preventDefault();
                             handleDropCert(cert.id);
                           }}
                         >
                            <div className="flex items-center gap-3">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${cert.type === 'PATENT' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                {cert.type === 'PATENT' ? '특허' : '인증'}
                              </span>
                              <div>
                                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                  {cert.title}
                                  {cert.pdfUrl && <span className="bg-red-50 text-red-600 text-[10px] px-1.5 py-0.5 rounded border border-red-100 font-bold">PDF</span>}
                                </h4>
                                <span className="text-xs text-slate-500">{cert.issuer}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                               <button onClick={() => setEditingCert(cert)} className="text-slate-400 hover:text-emerald-600"><Edit2 size={18} /></button>
                               <button onClick={() => { if(confirm('삭제하시겠습니까?')) deleteCertification(cert.id) }} className="text-slate-400 hover:text-red-600"><Trash2 size={18} /></button>
                            </div>
                         </div>
                       ))}
                    </div>
                  ) : (
                    <form onSubmit={handleCertSubmit} className="bg-slate-50 border border-slate-200 rounded-xl p-6 relative">
                       <button type="button" onClick={() => setEditingCert(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X /></button>
                       <h3 className="font-bold mb-4 text-lg">인증 정보 수정</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="md:col-span-2">
                           <label className="label">인증/특허명</label>
                           <input className="input-field" value={editingCert.title} onChange={e => setEditingCert({...editingCert, title: e.target.value})} required />
                         </div>
                         <div>
                           <label className="label">발급 기관</label>
                           <input className="input-field" value={editingCert.issuer} onChange={e => setEditingCert({...editingCert, issuer: e.target.value})} required />
                         </div>
                         <div>
                           <label className="label">구분</label>
                           <select className="input-field" value={editingCert.type} onChange={e => setEditingCert({...editingCert, type: e.target.value as any})}>
                             <option value="CERTIFICATE">인증서 (Certificate)</option>
                             <option value="PATENT">특허 (Patent)</option>
                             <option value="TEST_REPORT">시험성적서 (Report)</option>
                           </select>
                         </div>
                         
                         <div className="md:col-span-2">
                            <PdfInput 
                              label="PDF 파일 첨부 (선택 사항)"
                              value={editingCert.pdfUrl}
                              onChange={(val) => setEditingCert({...editingCert, pdfUrl: val})}
                            />
                         </div>

                         <div className="md:col-span-2 pt-2">
                            <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-lg font-bold">저장</button>
                         </div>
                       </div>
                    </form>
                  )}
                </div>
              </div>
             )}

             {activeTab === 'VIDEOS' && (
                <div className="animate-fade-in-up">
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">영상 및 슬라이드 관리</h2>
                  <p className="text-sm text-slate-500 mb-6">카테고리별 YouTube 영상 링크를 연결하거나, 영상이 없는 경우 <span className="text-emerald-600 font-medium">사진 슬라이드</span>를 업로드할 수 있습니다.</p>
                  
                  {/* API Key Setting */}
                  <div className="bg-slate-800 text-white p-6 rounded-xl mb-8 shadow-lg">
                     <div className="flex items-start gap-4">
                        <div className="bg-emerald-500/20 p-3 rounded-lg text-emerald-400 shrink-0">
                           <Key size={24} />
                        </div>
                        <div className="flex-1">
                           <h3 className="text-lg font-bold mb-1">YouTube Data API Key 설정</h3>
                           <p className="text-slate-300 text-sm mb-4">
                             재생목록을 안정적으로 불러오기 위해 Google Cloud Console에서 발급받은 API Key를 입력해주세요. <br/>
                             키가 없으면 불안정한 RSS 방식(백업)으로 작동하여 오류가 발생할 수 있습니다.
                           </p>
                           <div className="flex gap-2">
                              <input 
                                type="text" 
                                value={appSettings.youtubeApiKey}
                                onChange={(e) => updateAppSettings({...appSettings, youtubeApiKey: e.target.value})}
                                placeholder="AIzaSy..."
                                className="flex-1 bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono"
                              />
                           </div>
                        </div>
                     </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 mb-4">카테고리별 영상/슬라이드 설정</h3>
                  
                  <div className="grid grid-cols-1 gap-6">
                    {categories.map((category) => {
                      const hasPlaylist = !!(playlists[category.id] && playlists[category.id].trim());
                      const slideImages = category.slideImages || [];
                      return (
                      <div key={category.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                         <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 border-b border-slate-200">
                            <div className="bg-emerald-600 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold">
                              {category.label.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 text-lg">{category.label}</h4>
                              <p className="text-xs text-slate-400">ID: {category.id}</p>
                            </div>
                            {hasPlaylist ? (
                              <span className="ml-auto text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-bold flex items-center gap-1">
                                <Youtube size={12} /> 영상 연결됨
                              </span>
                            ) : slideImages.length > 0 ? (
                              <span className="ml-auto text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-bold flex items-center gap-1">
                                <ImageIcon size={12} /> 사진 {slideImages.length}장
                              </span>
                            ) : (
                              <span className="ml-auto text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full font-bold">
                                미설정
                              </span>
                            )}
                         </div>
                         
                         <div className="p-6 space-y-6">
                           {/* YouTube Link */}
                           <div>
                              <label className="label flex items-center gap-2">
                                <Youtube size={16} className="text-red-500" /> YouTube 링크 (Playlist or Video URL)
                              </label>
                              <input 
                                type="text" 
                                className="input-field" 
                                placeholder="예: https://www.youtube.com/playlist?list=... 또는 https://youtu.be/..."
                                value={playlists[category.id] || ''}
                                onChange={(e) => handlePlaylistChange(category.id, e.target.value)}
                              />
                              {playlists[category.id] && (
                                <p className="text-xs text-emerald-600 mt-2 flex items-center">
                                  <Info size={12} className="mr-1" /> 
                                  ID 감지됨: {playlists[category.id]} 
                                  {playlists[category.id].startsWith('PL') || playlists[category.id].startsWith('UU') ? ' (재생목록)' : ' (개별 동영상)'}
                                </p>
                              )}
                           </div>

                           {/* Photo Slideshow - shown when no playlist */}
                           {!hasPlaylist && (
                             <div className="border-t border-slate-200 pt-6">
                               <div className="flex items-center justify-between mb-3">
                                 <label className="label mb-0 flex items-center gap-2">
                                   <ImageIcon size={16} className="text-emerald-600" /> 사진 슬라이드 (영상 미등록 시 표시)
                                 </label>
                               </div>
                               <p className="text-xs text-slate-500 mb-4">YouTube 영상 링크가 없으면 아래 업로드한 사진이 메인페이지에서 슬라이드로 표시됩니다.</p>

                               {/* Uploaded Images Grid */}
                               {slideImages.length > 0 && (
                                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                   {slideImages.map((imgUrl: string, imgIdx: number) => (
                                     <div key={imgIdx} className="relative group aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                       <img src={imgUrl} alt={`슬라이드 ${imgIdx + 1}`} className="w-full h-full object-cover" />
                                       <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                         <button 
                                           onClick={() => {
                                             const newImages = slideImages.filter((_: string, i: number) => i !== imgIdx);
                                             updateCategory({ ...category, slideImages: newImages });
                                           }}
                                           className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700"
                                           title="삭제"
                                         >
                                           <Trash2 size={14} />
                                         </button>
                                       </div>
                                       <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                                         {imgIdx + 1}
                                       </div>
                                     </div>
                                   ))}
                                 </div>
                               )}

                               {/* Add Image Button */}
                               <ImageInput 
                                 label="슬라이드 사진 추가" 
                                 value="" 
                                 onChange={(url) => {
                                   if (url) {
                                     const newImages = [...slideImages, url];
                                     updateCategory({ ...category, slideImages: newImages });
                                   }
                                 }} 
                               />
                             </div>
                           )}
                         </div>
                      </div>
                    );
                    })}
                  </div>
                  
                  <div className="mt-8 p-4 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-800 text-sm">
                    <span className="font-bold">✨ 자동 저장됨:</span> 입력하는 즉시 웹사이트에 반영됩니다.
                  </div>
               </div>
              )}
          </div>
        </div>
      </div>
      <style>{`
        .label { display: block; font-size: 0.875rem; font-weight: 700; color: #475569; margin-bottom: 0.5rem; }
        .input-field { width: 100%; padding: 0.5rem 1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; outline: none; transition: all; font-size: 0.875rem; }
        .input-field:focus { border-color: #059669; box-shadow: 0 0 0 2px #a7f3d0; }
        .input-field:disabled { background-color: #f1f5f9; cursor: not-allowed; color: #94a3b8; }
      `}</style>
    </div>
  );
};

export default Admin;
