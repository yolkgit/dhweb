import React, { useState } from 'react';
import { MapPin, Phone, Printer, X, Download, Search, FileText } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import Logo from './Logo';

const Footer: React.FC = () => {
  const { companyInfo, designSettings, products, categories } = useContent();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDownloadType, setActiveDownloadType] = useState<'ALL' | 'SPEC' | 'MSDS'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const footerSizeClasses = {
    'small': 'text-sm',
    'medium': 'text-base',
    'large': 'text-lg'
  };
  const footerBaseSize = footerSizeClasses[designSettings.footerFontSize || 'small'];

  // Filter products that have at least one document
  const downloadableProducts = products.filter(p => p.specUrl || p.msdsUrl);

  // Filter based on search term
  const filteredProducts = downloadableProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (categories.find(c => c.id === p.category)?.label || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCatalogDownload = (e: React.MouseEvent) => {
    const catalogUrl = (companyInfo as any).catalogUrl;
    if (!catalogUrl) {
      e.preventDefault();
      alert("등록된 종합 카탈로그가 없습니다. 관리자 페이지에서 카탈로그를 업로드해 주세요.");
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300" style={{ fontFamily: designSettings.footerFontFamily || 'inherit' }}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${footerBaseSize}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Logo className="h-8 w-auto" variant="white" />
              <span 
                className="text-xl font-bold text-white tracking-tight uppercase"
                style={{ fontFamily: designSettings.headerFontFamily || 'inherit' }}
              >
                {companyInfo.headerTitle || "DAHYEON"}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4 whitespace-pre-line">
              {companyInfo.footerDesc}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">고객센터</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-emerald-500 shrink-0" />
                <span>{companyInfo.address}</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-emerald-500 shrink-0" />
                <span>{companyInfo.phone}</span>
              </li>
              <li className="flex items-center">
                <Printer className="w-5 h-5 mr-3 text-emerald-500 shrink-0" />
                <span>{companyInfo.fax}</span>
              </li>
            </ul>
          </div>

          {/* Downloads section */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">다운로드 자료실</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a 
                  href={(companyInfo as any).catalogUrl || '#'} 
                  download="다현산업_종합카탈로그.pdf"
                  onClick={handleCatalogDownload}
                  className="hover:text-emerald-400 cursor-pointer transition flex items-center gap-2 text-slate-300"
                >
                  <FileText size={16} className="text-emerald-500" />
                  종합 카탈로그 다운로드
                </a>
              </li>
              <li>
                <button 
                  onClick={() => { setIsModalOpen(true); setActiveDownloadType('SPEC'); }}
                  className="hover:text-emerald-400 cursor-pointer transition flex items-center gap-2 text-left bg-transparent border-0 p-0 text-slate-300"
                >
                  <FileText size={16} className="text-emerald-500" />
                  제품별 시방서 다운로드
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setIsModalOpen(true); setActiveDownloadType('MSDS'); }}
                  className="hover:text-emerald-400 cursor-pointer transition flex items-center gap-2 text-left bg-transparent border-0 p-0 text-slate-300"
                >
                  <FileText size={16} className="text-emerald-500" />
                  MSDS(물질안전보건자료) 다운로드
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {companyInfo.englishName} All rights reserved.</p>
        </div>
      </div>

      {/* Download Center Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden text-slate-800 animate-fade-in-up">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center shrink-0">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Download size={20} className="text-emerald-400" />
                자료 다운로드 센터
              </h3>
              <button 
                onClick={() => { setIsModalOpen(false); setSearchTerm(''); }}
                className="p-1 hover:bg-white/10 rounded-full transition text-slate-300 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Tabs & Search */}
            <div className="p-6 border-b border-slate-100 bg-slate-50 shrink-0 space-y-4">
              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveDownloadType('ALL')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeDownloadType === 'ALL' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                >
                  전체 자료
                </button>
                <button 
                  onClick={() => setActiveDownloadType('SPEC')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeDownloadType === 'SPEC' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                >
                  시방서
                </button>
                <button 
                  onClick={() => setActiveDownloadType('MSDS')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeDownloadType === 'MSDS' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                >
                  MSDS
                </button>
              </div>

              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  placeholder="제품명 또는 카테고리를 검색하세요..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition text-sm text-slate-800"
                />
              </div>
            </div>

            {/* Modal Body / Product List */}
            <div className="flex-1 overflow-y-auto p-6">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12 text-slate-400 italic text-sm">
                  검색 결과 또는 등록된 다운로드 자료가 없습니다.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredProducts.map(product => {
                    const categoryLabel = categories.find(c => c.id === product.category)?.label || '미분류';
                    
                    // Filter based on active tab
                    const showSpec = (activeDownloadType === 'ALL' || activeDownloadType === 'SPEC') && product.specUrl;
                    const showMsds = (activeDownloadType === 'ALL' || activeDownloadType === 'MSDS') && product.msdsUrl;
                    
                    if (!showSpec && !showMsds) return null;

                    return (
                      <div key={product.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0" 
                          />
                          <div>
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                              {categoryLabel}
                            </span>
                            <h4 className="font-bold text-slate-900 text-sm mt-1">{product.name}</h4>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 shrink-0">
                          {showSpec && product.specUrl && (
                            <a 
                              href={product.specUrl} 
                              download={`시방서_${product.name}.pdf`}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold transition"
                            >
                              <Download size={14} />
                              시방서
                            </a>
                          )}
                          {showMsds && product.msdsUrl && (
                            <a 
                              href={product.msdsUrl} 
                              download={`MSDS_${product.name}.pdf`}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-xs font-bold transition"
                            >
                              <Download size={14} />
                              MSDS
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;