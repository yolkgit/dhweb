import React, { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const InquiryModal: React.FC = () => {
  const { isInquiryModalOpen, setIsInquiryModalOpen, inquiryProduct, categories } = useContent();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('제품 견적 문의');
  const [message, setMessage] = useState('');

  // Pre-populate fields when inquiryProduct changes
  useEffect(() => {
    if (inquiryProduct) {
      setSubject('제품 견적 문의');
      setMessage(`[${inquiryProduct.name}] 제품에 대한 견적 및 구매 문의입니다.\n\n내용: `);
    } else {
      setSubject('제품 견적 문의');
      setMessage('');
    }
  }, [inquiryProduct, isInquiryModalOpen]);

  if (!isInquiryModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("문의가 성공적으로 접수되었습니다. 빠른 시일 내에 답변 드리겠습니다.");
    setIsInquiryModalOpen(false);
    // Reset form
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
  };

  const productCategoryLabel = inquiryProduct 
    ? (categories.find(c => c.id === inquiryProduct.category)?.label || '제품') 
    : '';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden text-slate-800 animate-fade-in-up">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center shrink-0">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            온라인 견적 문의
          </h3>
          <button 
            onClick={() => setIsInquiryModalOpen(false)}
            className="p-1 hover:bg-white/10 rounded-full transition text-slate-300 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Selected Product Card (if applicable) */}
          {inquiryProduct && (
            <div className="flex items-center gap-3 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100/60">
              <img 
                src={inquiryProduct.imageUrl} 
                alt={inquiryProduct.name} 
                className="w-14 h-14 object-cover rounded-lg border border-emerald-100 shrink-0" 
              />
              <div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  {productCategoryLabel}
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-1">{inquiryProduct.name}</h4>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="modal-name" className="block text-xs font-bold text-slate-700 mb-1.5">이름 / 담당자명 *</label>
              <input 
                type="text" 
                id="modal-name" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition" 
              />
            </div>
            <div>
              <label htmlFor="modal-phone" className="block text-xs font-bold text-slate-700 mb-1.5">연락처 *</label>
              <input 
                type="tel" 
                id="modal-phone" 
                required 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-0000-0000"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition" 
              />
            </div>
          </div>

          <div>
            <label htmlFor="modal-email" className="block text-xs font-bold text-slate-700 mb-1.5">이메일 *</label>
            <input 
              type="email" 
              id="modal-email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@dahyeon.com"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition" 
            />
          </div>

          <div>
            <label htmlFor="modal-subject" className="block text-xs font-bold text-slate-700 mb-1.5">문의 제목 *</label>
            <select 
              id="modal-subject" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition text-slate-600 bg-white"
            >
              <option value="제품 견적 문의">제품 견적 문의</option>
              <option value="시공 방법 문의">시공 방법 문의</option>
              <option value="대리점 개설 문의">대리점 개설 문의</option>
              <option value="기타 문의">기타 문의</option>
            </select>
          </div>

          <div>
            <label htmlFor="modal-message" className="block text-xs font-bold text-slate-700 mb-1.5">문의 내용 *</label>
            <textarea 
              id="modal-message" 
              rows={4} 
              required 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="문의하실 상세 내용을 입력하세요."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition resize-none" 
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="w-full py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition shadow-lg shadow-emerald-100 flex justify-center items-center gap-2 text-sm"
          >
            <Send size={16} />
            문의하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default InquiryModal;
