import React, { useState } from 'react';
import Section from '../components/Section';
import { useContent } from '../context/ContentContext';
import { MapPin, Phone, Clock, Send, ChevronDown, ChevronUp, MessageSquare, Building } from 'lucide-react';

const Contact: React.FC = () => {
  const { companyInfo, branches, currentLang } = useContent();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("문의가 성공적으로 접수되었습니다. 빠른 시일 내에 답변 드리겠습니다.");
    // In a real app, this would make an API call.
  };

  return (
    <div className="min-h-screen bg-slate-50">
       <div className="bg-slate-900 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">고객 지원 센터</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            다현산업은 언제나 고객님의 소리에 귀 기울이고 있습니다.
          </p>
        </div>
      </div>

      <Section>
        {/* Company View Image */}
        {(companyInfo as any).companyViewUrl && (
          <div className="mb-12 rounded-2xl overflow-hidden shadow-lg border border-slate-200">
            <img 
              src={(companyInfo as any).companyViewUrl} 
              alt="Company View" 
              className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Contact Info & FAQ */}
          <div className="space-y-12">
            {/* Contact Info */}
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">연락처 및 위치</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600 mr-4 shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">본사 주소</h3>
                    <p className="text-slate-600">{companyInfo.address}</p>
                    <a 
                       href={currentLang === 'ko' 
                         ? `https://map.naver.com/p/search/${encodeURIComponent(companyInfo.address)}`
                         : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(companyInfo.address)}&z=18`
                       } 
                       target="_blank" 
                       rel="noreferrer"
                       className="text-emerald-600 text-sm font-bold mt-2 inline-block hover:underline"
                     >
                       {currentLang === 'ko' ? '네이버 지도 보기 →' : 'View on Google Maps →'}
                     </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600 mr-4 shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">전화 / 팩스</h3>
                    <p className="text-slate-600">Tel: {companyInfo.phone}</p>
                    <p className="text-slate-600">Fax: {companyInfo.fax}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600 mr-4 shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">영업 시간</h3>
                    <p className="text-slate-600">평일: 09:00 - 18:00</p>
                    <p className="text-slate-500 text-sm">주말 및 공휴일 휴무</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Branch List */}
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <Building className="w-6 h-6 mr-2 text-emerald-500" />
                지점 및 대리점 안내 (Branches)
              </h2>
              <div className="space-y-4">
                {branches.map((branch) => (
                  <div key={branch.id} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                    <h3 className="font-bold text-lg text-slate-800 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      {branch.name}
                    </h3>
                    <div className="pl-4 space-y-1">
                      <p className="text-slate-600 flex items-start gap-2">
                        <MapPin size={16} className="mt-1 text-slate-400 shrink-0" />
                        {branch.address}
                      </p>
                      <p className="text-slate-600 flex items-center gap-2">
                        <Phone size={16} className="text-slate-400 shrink-0" />
                        {branch.phone}
                      </p>
                      <a 
                        href={currentLang === 'ko' 
                          ? `https://map.naver.com/p/search/${encodeURIComponent(branch.address)}`
                          : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address)}&z=18`
                        } 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline mt-1 inline-block ml-6"
                      >
                        {currentLang === 'ko' ? '지도에서 보기' : 'View Map'}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10 border border-slate-100 h-fit">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">온라인 문의</h2>
            <p className="text-slate-500 mb-8">제품 견적 및 기타 궁금한 사항을 남겨주세요.</p>
            
            {/* KakaoTalk Button */}
            {(companyInfo as any).kakaoChannelUrl && (
              <a 
                href={(companyInfo as any).kakaoChannelUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center w-full py-4 mb-8 bg-[#FAE100] text-[#371D1E] font-bold rounded-lg hover:bg-[#FCE840] transition shadow-md gap-2"
              >
                <MessageSquare className="w-6 h-6" fill="#371D1E" />
                카카오톡으로 간편하게 상담하기
              </a>
            )}

            <div className="relative flex items-center justify-center mb-8">
               <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
               </div>
               <span className="relative z-10 bg-white px-4 text-sm text-slate-400">또는 이메일 문의</span>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">이름 / 담당자명</label>
                  <input 
                    type="text" 
                    id="name" 
                    required 
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition" 
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-bold text-slate-700 mb-2">연락처</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    required 
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition" 
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">이메일</label>
                <input 
                  type="email" 
                  id="email" 
                  required 
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition" 
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-bold text-slate-700 mb-2">문의 제목</label>
                <select 
                  id="subject" 
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition text-slate-600"
                >
                  <option>제품 견적 문의</option>
                  <option>시공 방법 문의</option>
                  <option>대리점 개설 문의</option>
                  <option>기타 문의</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-2">문의 내용</label>
                <textarea 
                  id="message" 
                  rows={5} 
                  required 
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition resize-none" 
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full py-4 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 flex justify-center items-center"
              >
                <Send className="w-5 h-5 mr-2" />
                문의하기
              </button>
            </form>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Contact;