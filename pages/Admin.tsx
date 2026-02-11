import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { Product, ProductCategory, LabEquipment, Certification, HeroSlide, CertificationMark, Category, DesignSettings, Branch } from '../types';
import { Trash2, Plus, Edit2, RotateCcw, X, Beaker, Award, LogOut, Youtube, Info, Key, ExternalLink, Image as ImageIcon, Palette, Film, Type, CheckSquare, Table as TableIcon, Tag, List, Clock, MapPin, Phone } from 'lucide-react';
import IconPicker from '../components/IconPicker';
import { IconRenderer } from '../utils/iconMap';
import ImageInput from '../components/ImageInput';
import VideoInput from '../components/VideoInput';
import PdfInput from '../components/PdfInput';

const Admin: React.FC = () => {
  const { 
    companyInfo, updateCompanyInfo, 
    categories, addCategory, updateCategory, deleteCategory,
    products, addProduct, updateProduct, deleteProduct,
    playlists, updatePlaylist,
    labEquipment, addLabEquipment, updateLabEquipment, deleteLabEquipment,
    certifications, addCertification, updateCertification, deleteCertification,
    heroSlides, addHeroSlide, updateHeroSlide, deleteHeroSlide,
    logoSettings, updateLogoSettings,
    designSettings, updateDesignSettings,
    appSettings, updateAppSettings,
    certificationMarks, addCertificationMark, updateCertificationMark, deleteCertificationMark,
    calculatorSettings, updateCalculatorSettings,
    branches, addBranch, updateBranch, deleteBranch,
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

  // Sync table specs toggle
  useEffect(() => {
    if (editingProduct) {
      setUseTableSpecs(!!editingProduct.specTable);
    }
  }, [editingProduct]);

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
      certificationMarkIds: []
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
                 <p className="text-sm text-slate-500 mb-6">제품의 분류 기준이 되는 카테고리를 추가, 수정, 삭제합니다. ID는 영문 대문자 사용을 권장합니다.</p>

                 {!editingCategory ? (
                   <div className="space-y-4">
                      {categories.map((cat) => {
                         const productCount = products.filter(p => p.category === cat.id).length;
                         return (
                           <div key={cat.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-white hover:shadow-md transition">
                              <div className="flex items-center gap-4">
                                 <div className="bg-slate-100 text-slate-500 px-3 py-1 rounded text-xs font-bold font-mono">
                                   {cat.id}
                                 </div>
                                 <div className="font-bold text-lg text-slate-800">{cat.label}</div>
                                 <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                                   제품 {productCount}개
                                 </span>
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
                        <div key={branch.id} className="border border-slate-200 rounded-lg p-6 bg-white hover:shadow-md transition flex flex-col justify-between">
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
                            value={calculatorSettings.density} 
                            onChange={e => updateCalculatorSettings({...calculatorSettings, density: parseFloat(e.target.value)})} 
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
                <div className="flex justify-between items-center mb-8">
                   <h2 className="text-2xl font-bold text-slate-800">제품 목록 ({products.length})</h2>
                   <button onClick={createNewProduct} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-700 shadow-md transition">
                     <Plus size={20} /> 새 제품 추가
                   </button>
                </div>

                {!editingProduct ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {products.map(product => {
                      const catLabel = categories.find(c => c.id === product.category)?.label || product.category;
                      return (
                        <div key={product.id} className="border border-slate-200 rounded-xl p-4 flex gap-4 bg-white hover:shadow-md transition group">
                          <div className="w-24 h-24 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-xs font-bold text-emerald-600 uppercase">{catLabel}</span>
                                <h3 className="font-bold text-slate-900">{product.name}</h3>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setEditingProduct(product)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded"><Edit2 size={16} /></button>
                                <button onClick={() => { if(confirm('삭제하시겠습니까?')) deleteProduct(product.id) }} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                              </div>
                            </div>
                            <p className="text-sm text-slate-500 line-clamp-2 mt-1">{product.description}</p>
                          </div>
                        </div>
                      );
                    })}
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
                           {/* Headers Editor */}
                           <div className="flex gap-2 mb-4 min-w-max pb-2 border-b border-slate-100">
                              {editingProduct.specTable.headers.map((h, i) => (
                                 <div key={i} className="flex-1 min-w-[120px] relative group">
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
                                className="flex items-center justify-center w-10 bg-emerald-100 text-emerald-600 rounded hover:bg-emerald-200 transition"
                                title="열 추가"
                              >
                                <Plus size={20} />
                              </button>
                           </div>
                           
                           {/* Rows Editor */}
                           <div className="space-y-2 min-w-max">
                              {editingProduct.specTable.rows.map((row, rIdx) => (
                                 <div key={rIdx} className="flex gap-2 items-center">
                                    <div className="text-xs text-slate-300 w-4 text-center">{rIdx + 1}</div>
                                    {row.map((cell, cIdx) => (
                                       <div key={cIdx} className="flex-1 min-w-[120px]">
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
                                       className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                                    >
                                       <Trash2 size={16} />
                                    </button>
                                 </div>
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
                              <div className="w-8 text-center text-xs text-slate-300 font-mono">{idx + 1}</div>
                              <input 
                                className="input-field w-1/3 focus:bg-emerald-50 transition-colors" 
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
                              <span className="text-slate-400">:</span>
                              <input 
                                className="input-field flex-1 focus:bg-emerald-50 transition-colors" 
                                value={val} 
                                onChange={e => {
                                   setEditingProduct({...editingProduct, specs: { ...editingProduct.specs, [key]: e.target.value }});
                                }} 
                                placeholder="내용 (예: 25kg)" 
                              />
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
                   <div>
                     <label className="label">슬로건</label>
                     <textarea name="slogan" value={String(companyInfo.slogan || '')} onChange={handleInfoChange} className="input-field h-24 resize-none" />
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
                        <div key={item.id} className="border border-slate-200 p-4 rounded-lg flex items-center gap-4 bg-white hover:shadow-md transition">
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
                         <div key={cert.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-white hover:shadow-sm">
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
                 <h2 className="text-2xl font-bold text-slate-800 mb-2">영상 설정 및 관리</h2>
                 
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

                 <h3 className="text-xl font-bold text-slate-800 mb-4">카테고리별 재생목록 연결</h3>
                 
                 <div className="grid grid-cols-1 gap-6">
                   {categories.map((category) => (
                     <div key={category.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                           <Youtube className="text-red-600" size={28} />
                           <div>
                             <h4 className="font-bold text-slate-900 text-lg">{category.label}</h4>
                             <p className="text-xs text-slate-400">ID: {category.id}</p>
                           </div>
                        </div>
                        
                        <div>
                           <label className="label">YouTube 링크 (Playlist or Video URL)</label>
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
                     </div>
                   ))}
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