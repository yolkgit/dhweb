import React, { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import UsageCalculator from './UsageCalculator';
import { useContent } from '../context/ContentContext';
import { getSquareCropDataUrl } from '../utils/imageHelpers';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [scrolled, setScrolled] = React.useState(false);
  const { logoSettings } = useContent();
  const location = useLocation();

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
    </div>
  );
};

export default Layout;