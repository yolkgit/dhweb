import React from 'react';
import Section from '../components/Section';
import { useContent } from '../context/ContentContext';
import { IconRenderer } from '../utils/iconMap';

const Technology: React.FC = () => {
  const { labEquipment } = useContent();

  return (
    <div>
      <div className="bg-slate-900 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Technology & R&D</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            지속적인 연구개발을 통해 최고의 품질을 증명합니다.
          </p>
        </div>
      </div>

      {/* Lab Equipment Section */}
      <Section>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">첨단 실험 장비 및 품질 관리</h2>
          <p className="text-slate-600">
            KS 규격 및 국제 표준에 적합한 시험 기기를 보유하여 철저한 품질 관리를 수행합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {labEquipment.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition overflow-hidden flex flex-col h-full group">
              <div className="h-48 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 relative">
                {item.imageUrl ? (
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform duration-300">
                    <IconRenderer name={item.iconName} size={32} />
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-grow text-center">
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default Technology;