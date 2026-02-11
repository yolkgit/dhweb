import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Settings, Globe } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import Logo from './Logo';

interface NavbarProps {
  scrolled: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ scrolled }) => {
  const { companyInfo, designSettings, currentLang, toggleLanguage } = useContent();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: '홈', path: '/' },
    { name: '제품소개', path: '/products' },
    { name: '기술연구소', path: '/technology' },
    { name: '고객센터', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Determine logo variant based on scroll state and background
  const logoVariant = (scrolled || isOpen) ? 'color' : 'white';
  const textColor = (scrolled || isOpen) ? 'text-slate-900' : 'text-white';

  const titleSizeClasses = {
    'small': 'text-base md:text-lg',
    'medium': 'text-lg md:text-xl',
    'large': 'text-xl md:text-2xl',
    'xlarge': 'text-2xl md:text-3xl'
  };

  const subtitleSizeClasses = {
    'small': 'text-[0.5rem] md:text-[0.6rem]',
    'medium': 'text-[0.55rem] md:text-[0.65rem]',
    'large': 'text-[0.65rem] md:text-[0.75rem]',
    'xlarge': 'text-[0.7rem] md:text-[0.85rem]'
  };

  const navSizeClasses = {
    'small': 'text-sm',
    'medium': 'text-base',
    'large': 'text-lg'
  };

  const currentSize = designSettings.headerTitleSize || 'medium';
  const currentNavSize = designSettings.headerFontSize || 'medium';
  const titleSize = titleSizeClasses[currentSize];
  const subtitleSize = subtitleSizeClasses[currentSize];
  const navTextSize = navSizeClasses[currentNavSize];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled || isOpen ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <Logo className="h-10 w-auto transition-transform group-hover:scale-105" variant={logoVariant} />
            <div 
              className={`flex flex-col ${textColor}`}
              style={{ fontFamily: designSettings.headerFontFamily || 'inherit' }}
            >
              <span className={`font-extrabold leading-none tracking-tight uppercase ${titleSize}`}>
                {companyInfo.headerTitle || "DAHYEON"}
              </span>
              <span className={`font-bold tracking-widest opacity-80 uppercase mt-0.5 ${subtitleSize} ${(scrolled || isOpen) ? 'text-slate-500' : 'text-slate-300'}`}>
                {companyInfo.headerSubtitle || "INDUSTRY"}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors duration-200 ${navTextSize} ${
                  scrolled
                    ? isActive(link.path)
                      ? 'text-emerald-600'
                      : 'text-slate-600 hover:text-emerald-600'
                    : isActive(link.path)
                    ? 'text-white border-b-2 border-white'
                    : 'text-white/90 hover:text-white'
                }`}
                style={{ fontFamily: designSettings.headerFontFamily || 'inherit' }}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Language Toggle */}
            <button 
              type="button"
              onClick={toggleLanguage}
              className={`flex items-center gap-1 font-bold text-xs px-2 py-1 rounded border transition-colors ${
                 scrolled 
                 ? 'border-slate-300 text-slate-600 hover:bg-slate-100' 
                 : 'border-white/30 text-white hover:bg-white/20'
              }`}
            >
               <Globe size={14} />
               <span>{currentLang === 'ko' ? 'ENG' : 'KOR'}</span>
            </button>
            
            <Link to="/admin" className={`p-2 rounded-full hover:bg-white/20 transition ${scrolled ? 'text-slate-500 hover:bg-slate-100' : 'text-white'}`} title="관리자">
              <Settings size={20} />
            </Link>

            {/* Desktop 'Contact Us' button removed as per user request (Mobile only) */}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
             <button 
              type="button"
              onClick={toggleLanguage}
              className={`flex items-center gap-1 font-bold text-xs px-2 py-1 rounded border ${
                 scrolled || isOpen
                 ? 'border-slate-300 text-slate-600' 
                 : 'border-white/30 text-white'
              }`}
            >
               <Globe size={14} />
               <span>{currentLang === 'ko' ? 'EN' : 'KR'}</span>
            </button>
             <Link to="/admin" className={`p-2 ${scrolled || isOpen ? 'text-slate-900' : 'text-white'}`}>
                <Settings size={24} />
             </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md ${scrolled || isOpen ? 'text-slate-900' : 'text-white'}`}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 w-full shadow-lg border-t border-slate-100">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-4 text-base font-medium rounded-md border-b border-slate-50 ${
                  isActive(link.path)
                    ? 'text-emerald-600 bg-emerald-50'
                    : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4">
               <a 
                href={`tel:${companyInfo.phone}`}
                className="flex justify-center items-center w-full px-4 py-3 bg-slate-900 text-white rounded-lg font-bold"
              >
                <Phone size={18} className="mr-2" />
                문의하기
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;