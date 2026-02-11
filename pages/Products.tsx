import React, { useState } from 'react';
import Section from '../components/Section';
import { Product } from '../types';
import { Tag, Leaf, Info, X, Check, FileText, Download } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const Products: React.FC = () => {
  const { products, certificationMarks, categories } = useContent();
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Combine static 'ALL' option with dynamic categories
  const filterCategories = [
    { id: 'ALL', label: '전체 제품' },
    ...categories
  ];

  const filteredProducts = activeCategory === 'ALL' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-slate-900 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Product Catalog</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            도로 안전과 유지보수를 위한 다현산업의 혁신적인 제품 라인업과 상세 스펙을 확인하세요.
          </p>
        </div>
      </div>

      <Section>
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filterCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all shadow-sm ${
                activeCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-emerald-200'
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const catLabel = categories.find(c => c.id === product.category)?.label || product.category;
            return (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-slate-100 flex flex-col">
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden bg-slate-200 cursor-pointer" onClick={() => setSelectedProduct(product)}>
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-contain p-2 bg-white group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Status Badges (Top Left) */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {product.isNew && (
                      <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        NEW
                      </span>
                    )}
                    {product.isEco && (
                      <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center">
                        <Leaf size={12} className="mr-1" /> ECO
                      </span>
                    )}
                  </div>

                  {/* Certification Marks (Top Right) */}
                  {product.certificationMarkIds && product.certificationMarkIds.length > 0 && (
                    <div className="absolute top-4 right-4 flex gap-1">
                        {product.certificationMarkIds.map(markId => {
                          const mark = certificationMarks.find(m => m.id === markId);
                          if (!mark || !mark.imageUrl) return null;
                          return (
                            <div key={markId} className="w-16 h-16 flex items-center justify-center" title={mark.name}>
                                <img src={mark.imageUrl} alt={mark.name} className="w-full h-full object-contain drop-shadow-md" />
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-8 flex-grow flex flex-col">
                  <div className="mb-4">
                    <span className="text-emerald-600 text-xs font-bold tracking-wider uppercase mb-2 block">
                      {catLabel}
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {product.name}
                    </h3>
                  </div>
                  
                  <p className="text-slate-500 mb-6 text-sm leading-relaxed flex-grow line-clamp-3">
                    {product.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    {product.features.slice(0, 2).map((feat, i) => (
                      <div key={i} className="flex items-center text-sm text-slate-700 bg-slate-50 p-2 rounded-lg truncate">
                        <Tag size={14} className="text-emerald-500 mr-2 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setSelectedProduct(product)}
                    className="mt-auto w-full py-3 border border-slate-200 rounded-lg text-slate-600 font-bold hover:bg-slate-900 hover:text-white transition-colors flex items-center justify-center"
                  >
                    <Info size={16} className="mr-2" /> 상세 스펙 보기
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 flex flex-col md:flex-row animate-fade-in-up">
            
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white rounded-full text-slate-800 transition-colors z-20"
            >
              <X size={24} />
            </button>

            {/* Modal Image */}
            <div className="w-full md:w-2/5 h-64 md:h-auto bg-slate-100 relative shrink-0">
               <img 
                src={selectedProduct.imageUrl} 
                alt={selectedProduct.name} 
                className="w-full h-full object-contain p-4 bg-white"
              />
               
               {/* Certification Marks for Modal */}
               {selectedProduct.certificationMarkIds && selectedProduct.certificationMarkIds.length > 0 && (
                   <div className="absolute top-4 left-4 flex gap-2 z-10">
                      {selectedProduct.certificationMarkIds.map(markId => {
                         const mark = certificationMarks.find(m => m.id === markId);
                         if (!mark || !mark.imageUrl) return null;
                         return (
                           <div key={markId} className="w-16 h-16 flex items-center justify-center" title={mark.name}>
                              <img src={mark.imageUrl} alt={mark.name} className="w-full h-full object-contain drop-shadow-md" />
                           </div>
                         );
                      })}
                   </div>
               )}

               <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white md:hidden">
                 <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
               </div>
            </div>

            {/* Modal Content */}
            <div className="w-full md:w-3/5 p-8 md:p-10 bg-white">
              <div className="hidden md:block mb-6">
                <span className="text-emerald-600 font-bold text-sm tracking-wider">
                  {categories.find(c => c.id === selectedProduct.category)?.label || selectedProduct.category}
                </span>
                <h2 className="text-3xl font-bold text-slate-900 mt-1">{selectedProduct.name}</h2>
              </div>

              <p className="text-slate-600 leading-relaxed mb-8 text-lg">
                {selectedProduct.description}
              </p>

              {/* Document Downloads (If Available) */}
              {(selectedProduct.specUrl || selectedProduct.msdsUrl) && (
                <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <h4 className="font-bold text-slate-800 mb-3 flex items-center">
                    <FileText className="w-5 h-5 text-emerald-500 mr-2" /> 제품 관련 문서
                  </h4>
                  <div className="flex gap-3">
                    {selectedProduct.specUrl && (
                      <a 
                        href={selectedProduct.specUrl} 
                        download={`시방서_${selectedProduct.name}.pdf`}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-800 hover:text-white hover:border-slate-800 transition-all shadow-sm"
                      >
                        <Download size={16} /> Specification
                      </a>
                    )}
                    {selectedProduct.msdsUrl && (
                      <a 
                        href={selectedProduct.msdsUrl} 
                        download={`MSDS_${selectedProduct.name}.pdf`}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-800 hover:text-white hover:border-slate-800 transition-all shadow-sm"
                      >
                        <Download size={16} /> MSDS
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div className="mb-8">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                  <Check className="w-5 h-5 text-emerald-500 mr-2" /> 주요 특징
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedProduct.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 mr-2 shrink-0"></div>
                      {feat}
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Specs Rendering */}
              {(selectedProduct.specTable || selectedProduct.specs) && (
                <div>
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                    <Info className="w-5 h-5 text-emerald-500 mr-2" /> 기술 사양
                  </h3>
                  
                  {selectedProduct.specTable ? (
                    /* Table Layout for Multi-Column Specs */
                    <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-100 overflow-x-auto">
                      <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="bg-slate-100 text-slate-700">
                          <tr>
                            {selectedProduct.specTable.headers.map((h, i) => (
                              <th key={i} className="py-3 px-4 font-bold border-b border-slate-200">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {selectedProduct.specTable.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="border-b border-slate-200 last:border-0 hover:bg-slate-100 transition-colors">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="py-3 px-4 text-slate-600 border-r border-slate-100 last:border-0">{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    /* Legacy Key-Value Layout */
                    <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                      <table className="w-full text-sm text-left">
                        <tbody>
                          {Object.entries(selectedProduct.specs || {}).map(([key, value], idx) => (
                            <tr key={key} className="border-b border-slate-200 last:border-0 hover:bg-slate-100 transition-colors">
                              <th className="py-3 px-4 font-semibold text-slate-700 bg-slate-100 w-1/3">{key}</th>
                              <td className="py-3 px-4 text-slate-600">{value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="px-6 py-2 rounded-lg border border-slate-300 text-slate-600 font-bold hover:bg-slate-50 transition"
                >
                  닫기
                </button>
                <a 
                  href="/#/contact"
                  className="px-6 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition"
                >
                  견적 문의하기
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;