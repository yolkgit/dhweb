import React from 'react';
import { MapPin, Phone, Printer } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import Logo from './Logo';

const Footer: React.FC = () => {
  const { companyInfo, designSettings } = useContent();

  const footerSizeClasses = {
    'small': 'text-sm',
    'medium': 'text-base',
    'large': 'text-lg'
  };
  const footerBaseSize = footerSizeClasses[designSettings.footerFontSize || 'small'];

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

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">제품 안내</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-emerald-400 cursor-pointer transition">도로보수재 (RPM)</span></li>
              <li><span className="hover:text-emerald-400 cursor-pointer transition">콘크리트 보수</span></li>
              <li><span className="hover:text-emerald-400 cursor-pointer transition">미끄럼방지/도막</span></li>
              <li><span className="hover:text-emerald-400 cursor-pointer transition">제설제</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {companyInfo.englishName} All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;