import React, { useState, useEffect } from 'react';
import { Calculator, X, ChevronRight, Check } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const UsageCalculator: React.FC = () => {
  const { calculatorSettings } = useContent();
  const [isOpen, setIsOpen] = useState(false);
  
  // Inputs
  const [width, setWidth] = useState<string>(''); // meters
  const [length, setLength] = useState<string>(''); // meters
  const [depth, setDepth] = useState<string>(''); // cm

  // Results
  const [totalWeight, setTotalWeight] = useState<number>(0);
  const [bagCount, setBagCount] = useState<number>(0);
  const [showResult, setShowResult] = useState(false);

  // Clear result when inputs change
  useEffect(() => {
    setShowResult(false);
  }, [width, length, depth]);

  const calculate = () => {
    const w = parseFloat(width);
    const l = parseFloat(length);
    const d = parseFloat(depth);

    if (isNaN(w) || isNaN(l) || isNaN(d) || w <= 0 || l <= 0 || d <= 0) {
      alert('모든 치수를 올바르게 입력해주세요.');
      return;
    }

    // Formula: Volume (m3) = Width(m) * Length(m) * Depth(m)
    // Depth is in cm, so divide by 100
    const volume = w * l * (d / 100);
    
    // Weight (kg) = Volume * Density (kg/m3) -> default 2300
    const density = calculatorSettings.density * 1000; // convert density to kg/m3 if stored as specific gravity (e.g. 2.3)
    // Actually, let's assume stored density is 2.3 (meaning 2300kg/m3). 
    // If user enters 2300 directly, handle that? 
    // Let's assume user enters standard specific gravity like 2.3.
    
    // Safety check for density input magnitude
    const densityVal = calculatorSettings.density > 10 ? calculatorSettings.density : calculatorSettings.density * 1000; 

    const weight = volume * densityVal;
    
    // Bags (25kg standard)
    const bags = Math.ceil(weight / 25);

    setTotalWeight(Math.round(weight));
    setBagCount(bags);
    setShowResult(true);
  };

  const isPallet = bagCount >= 50;
  const currentImage = isPallet ? calculatorSettings.palletImageUrl : calculatorSettings.bagImageUrl;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end print:hidden">
      {/* Calculator Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in-up flex flex-col">
          {/* Header */}
          <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
            <div className="flex items-center">
              <div className="p-1.5 bg-emerald-500 rounded-full mr-2">
                <Calculator size={18} />
              </div>
              <span className="font-bold">제품 사용량 계산기</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-emerald-400 transition">
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="text-xs font-bold text-slate-500 mb-1 block">가로 (m)</label>
                   <input 
                     type="number" 
                     value={width}
                     onChange={(e) => setWidth(e.target.value)}
                     placeholder="예: 10" 
                     className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-900" 
                   />
                </div>
                <div>
                   <label className="text-xs font-bold text-slate-500 mb-1 block">세로 (m)</label>
                   <input 
                     type="number" 
                     value={length}
                     onChange={(e) => setLength(e.target.value)}
                     placeholder="예: 2" 
                     className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-900" 
                   />
                </div>
              </div>
              <div>
                 <label className="text-xs font-bold text-slate-500 mb-1 block">깊이/두께 (cm)</label>
                 <input 
                   type="number" 
                   value={depth}
                   onChange={(e) => setDepth(e.target.value)}
                   placeholder="예: 5" 
                   className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-900" 
                 />
              </div>

              <button 
                onClick={calculate}
                className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-md flex justify-center items-center gap-2"
              >
                계산하기 <ChevronRight size={16} />
              </button>
            </div>

            {showResult && (
              <div className="mt-6 pt-6 border-t border-slate-100 animate-fade-in-up">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-center mb-4">
                   <p className="text-sm text-slate-500 mb-1">총 예상 소요량</p>
                   <div className="text-3xl font-extrabold text-slate-900">
                     {bagCount} <span className="text-lg text-emerald-600">포</span>
                   </div>
                   <div className="text-xs text-slate-400 mt-1">({totalWeight.toLocaleString()} kg / 25kg 기준)</div>
                </div>

                <div className="rounded-xl overflow-hidden relative group">
                   <img src={currentImage} alt="Product Requirement" className="w-full h-40 object-cover" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                      <div className="text-white">
                         <div className="flex items-center gap-1 text-emerald-400 font-bold text-sm mb-0.5">
                            <Check size={14} /> {isPallet ? '50포 이상 (대량)' : '50포 미만 (소량)'}
                         </div>
                         <div className="font-bold text-sm opacity-90">
                            {isPallet ? '파레트 단위 배송 추천' : '택배/화물 배송 가능'}
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 hover:scale-105 transition-all flex items-center justify-center relative group"
      >
        {isOpen ? <X size={28} /> : <Calculator size={28} />}
        {!isOpen && (
          <span className="absolute right-full mr-3 bg-slate-900 text-white text-xs py-1.5 px-3 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
            사용량 계산기
          </span>
        )}
      </button>
    </div>
  );
};

export default UsageCalculator;
