import React, { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import UsageCalculator from './UsageCalculator';
import InquiryModal from './InquiryModal';
import { useContent } from '../context/ContentContext';
import { getSquareCropDataUrl } from '../utils/imageHelpers';
import { installGlossaryCorrector } from '../utils/glossary';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [scrolled, setScrolled] = React.useState(false);
  const { logoSettings, appSettings, currentLang } = useContent();
  const location = useLocation();

  // Keep latest glossary/language available to the DOM corrector without reinstalling it.
  const glossaryRef = React.useRef(appSettings.glossary || []);
  glossaryRef.current = appSettings.glossary || [];
  const langRef = React.useRef(currentLang);
  langRef.current = currentLang;

  // Correct Google Translate's English output with the construction-materials glossary.
  useEffect(() => {
    const cleanup = installGlossaryCorrector(
      () => glossaryRef.current || [],
      () => langRef.current === 'en'
    );
    return cleanup;
  }, []);

  // Scroll to top on route change
  // Scroll to top on route change
  useLayoutEffect(() => {
    // Disable browser's default scroll restoration
    if (window.history.scrollRestoration) {
      window.history.scrollRestoration = 'manual';
    }
    
    // Force scroll to top immediately before paint
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync Favicon with Default Logo (Cropped to Square)
  useEffect(() => {
    const updateFavicon = async () => {
      const link = document.getElementById('favicon') as HTMLLinkElement;
      if (link && logoSettings.defaultUrl) {
         try {
            const croppedUrl = await getSquareCropDataUrl(logoSettings.defaultUrl);
            link.href = croppedUrl;
         } catch (e) {
            console.error('Favicon update failed', e);
            link.href = logoSettings.defaultUrl; // Fallback
         }
      }
    };
    updateFavicon();
  }, [logoSettings.defaultUrl]);

  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-800 bg-slate-50 relative">
      <Navbar scrolled={scrolled} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <UsageCalculator />
      <InquiryModal />
    </div>
  );
};

export default Layout;