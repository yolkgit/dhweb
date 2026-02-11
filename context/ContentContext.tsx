// ... (imports remain similar, but we remove INITIAL_* usage for state initialization if we want strictly server-first, 
// but for safety we can keep them as fallbacks or initial values while loading)
import React, { createContext, useContext, useState, useEffect } from 'react';
import { COMPANY_INFO as INITIAL_INFO, PRODUCTS as INITIAL_PRODUCTS, FAQS as INITIAL_FAQS, DEFAULT_PLAYLISTS as INITIAL_PLAYLISTS, CERTIFICATIONS as INITIAL_CERTS, LAB_EQUIPMENT as INITIAL_LAB, HERO_SLIDES as INITIAL_SLIDES, LOGO_SETTINGS as INITIAL_LOGO, DESIGN_SETTINGS as INITIAL_DESIGN, CERT_MARKS as INITIAL_CERT_MARKS, INITIAL_CATEGORIES, CALCULATOR_SETTINGS as INITIAL_CALCULATOR, INITIAL_BRANCHES } from '../constants';
import { Product, Certification, LabEquipment, CategoryPlaylists, AppSettings, HeroSlide, LogoSettings, DesignSettings, CertificationMark, Category, CalculatorSettings, Branch } from '../types';

interface ContentContextType {
  // ... (Type definitions remain mostly the same)
  companyInfo: typeof INITIAL_INFO;
  updateCompanyInfo: (info: typeof INITIAL_INFO) => void;
  categories: Category[];
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  playlists: CategoryPlaylists;
  updatePlaylist: (categoryId: string, playlistId: string) => void;
  faqs: typeof INITIAL_FAQS;
  updateFaqs: (faqs: typeof INITIAL_FAQS) => void;
  certifications: Certification[];
  addCertification: (cert: Certification) => void;
  updateCertification: (cert: Certification) => void;
  deleteCertification: (id: string) => void;
  labEquipment: LabEquipment[];
  addLabEquipment: (item: LabEquipment) => void;
  updateLabEquipment: (item: LabEquipment) => void;
  deleteLabEquipment: (id: string) => void;
  appSettings: AppSettings;
  updateAppSettings: (settings: AppSettings) => void;
  heroSlides: HeroSlide[];
  addHeroSlide: (slide: HeroSlide) => void;
  updateHeroSlide: (slide: HeroSlide) => void;
  deleteHeroSlide: (id: string) => void;
  logoSettings: LogoSettings;
  updateLogoSettings: (settings: LogoSettings) => void;
  designSettings: DesignSettings;
  updateDesignSettings: (settings: DesignSettings) => void;
  certificationMarks: CertificationMark[];
  addCertificationMark: (mark: CertificationMark) => void;
  updateCertificationMark: (mark: CertificationMark) => void;
  deleteCertificationMark: (id: string) => void;
  calculatorSettings: CalculatorSettings;
  updateCalculatorSettings: (settings: CalculatorSettings) => void;
  branches: Branch[];
  addBranch: (branch: Branch) => void;
  updateBranch: (branch: Branch) => void;
  deleteBranch: (id: string) => void;
  currentLang: 'ko' | 'en';
  toggleLanguage: () => void;
  resetToDefaults: () => void;
  isLoading: boolean; // Added loading state
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

// API Helper
const api = {
  get: async () => {
    try {
      const res = await fetch('/api/content');
      if (!res.ok) throw new Error('Failed to fetch data');
      return await res.json();
    } catch (e) {
      console.error(e);
      return {};
    }
  },
  save: async (key: string, data: any) => {
    try {
      await fetch(`/api/data/${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.error(`Failed to save ${key}`, e);
    }
  }
};

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentLang, setCurrentLang] = useState<'ko' | 'en'>('ko');

  // Initialize states with defaults first
  const [companyInfo, setCompanyInfo] = useState(INITIAL_INFO);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [playlists, setPlaylists] = useState<CategoryPlaylists>(INITIAL_PLAYLISTS);
  const [faqs, setFaqs] = useState(INITIAL_FAQS);
  const [certifications, setCertifications] = useState<Certification[]>(INITIAL_CERTS);
  const [labEquipment, setLabEquipment] = useState<LabEquipment[]>(INITIAL_LAB);
  const [appSettings, setAppSettings] = useState<AppSettings>({ youtubeApiKey: '' });
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(INITIAL_SLIDES);
  const [logoSettings, setLogoSettings] = useState<LogoSettings>(INITIAL_LOGO);
  const [designSettings, setDesignSettings] = useState<DesignSettings>(INITIAL_DESIGN);
  const [certificationMarks, setCertificationMarks] = useState<CertificationMark[]>(INITIAL_CERT_MARKS);
  const [calculatorSettings, setCalculatorSettings] = useState<CalculatorSettings>(INITIAL_CALCULATOR);
  const [branches, setBranches] = useState<Branch[]>(INITIAL_BRANCHES);

  // Fetch initial data from server
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await api.get();
      
      if (data.companyInfo) setCompanyInfo(data.companyInfo);
      if (data.categories) setCategories(data.categories);
      if (data.products) setProducts(data.products);
      if (data.playlists) setPlaylists(data.playlists);
      if (data.faqs) setFaqs(data.faqs);
      if (data.certifications) setCertifications(data.certifications);
      if (data.labEquipment) setLabEquipment(data.labEquipment);
      if (data.appSettings) setAppSettings(data.appSettings);
      if (data.heroSlides) setHeroSlides(data.heroSlides);
      if (data.logoSettings) setLogoSettings(data.logoSettings);
      if (data.designSettings) setDesignSettings(data.designSettings);
      if (data.certificationMarks) setCertificationMarks(data.certificationMarks);
      if (data.calculatorSettings) setCalculatorSettings(data.calculatorSettings);
      if (data.branches) setBranches(data.branches);
      
      setIsLoading(false);
    };
    fetchData();
  }, []);

  // Language Logic
  useEffect(() => {
    const getCookie = (name: string) => {
      try {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
      } catch (e) { return null; }
    };
    if (getCookie('googtrans') === '/ko/en') setCurrentLang('en');
    else setCurrentLang('ko');
  }, []);

  const toggleLanguage = () => {
      // (Language toggle logic remains same... optional: improve strict mode handling)
      if (currentLang === 'ko') {
        document.cookie = "googtrans=/ko/en; path=/";
        setCurrentLang('en');
      } else {
        document.cookie = "googtrans=/ko/ko; path=/";
        setCurrentLang('ko');
      }
      window.location.reload();
  };

  // --- CRUD Wrappers with API Sync ---
  
  const updateCompanyInfo = (info: typeof INITIAL_INFO) => {
    setCompanyInfo(info);
    api.save('companyInfo', info);
  };

  const addCategory = (category: Category) => {
    const newData = [...categories, category];
    setCategories(newData);
    api.save('categories', newData);
  };
  const updateCategory = (category: Category) => {
    const newData = categories.map(c => c.id === category.id ? category : c);
    setCategories(newData);
    api.save('categories', newData);
  };
  const deleteCategory = (id: string) => {
    const newData = categories.filter(c => c.id !== id);
    setCategories(newData);
    api.save('categories', newData);
  };

  const addProduct = (product: Product) => {
    const newData = [...products, product];
    setProducts(newData);
    api.save('products', newData);
  };
  const updateProduct = (updatedProduct: Product) => {
    const newData = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    setProducts(newData);
    api.save('products', newData);
  };
  const deleteProduct = (id: string) => {
    const newData = products.filter(p => p.id !== id);
    setProducts(newData);
    api.save('products', newData);
  };

  const updatePlaylist = (categoryId: string, playlistId: string) => {
    const newData = { ...playlists, [categoryId]: playlistId };
    setPlaylists(newData);
    api.save('playlists', newData);
  };

  const updateFaqs = (newFaqs: typeof INITIAL_FAQS) => {
    setFaqs(newFaqs);
    api.save('faqs', newFaqs);
  };

  const addCertification = (cert: Certification) => {
    const newData = [...certifications, cert];
    setCertifications(newData);
    api.save('certifications', newData);
  };
  const updateCertification = (cert: Certification) => {
    const newData = certifications.map(c => c.id === cert.id ? cert : c);
    setCertifications(newData);
    api.save('certifications', newData);
  };
  const deleteCertification = (id: string) => {
    const newData = certifications.filter(c => c.id !== id);
    setCertifications(newData);
    api.save('certifications', newData);
  };

  const addLabEquipment = (item: LabEquipment) => {
    const newData = [...labEquipment, item];
    setLabEquipment(newData);
    api.save('labEquipment', newData);
  };
  const updateLabEquipment = (item: LabEquipment) => {
    const newData = labEquipment.map(l => l.id === item.id ? item : l);
    setLabEquipment(newData);
    api.save('labEquipment', newData);
  };
  const deleteLabEquipment = (id: string) => {
    const newData = labEquipment.filter(l => l.id !== id);
    setLabEquipment(newData);
    api.save('labEquipment', newData);
  };

  const addHeroSlide = (slide: HeroSlide) => {
    const newData = [...heroSlides, slide];
    setHeroSlides(newData);
    api.save('heroSlides', newData);
  };
  const updateHeroSlide = (slide: HeroSlide) => {
    const newData = heroSlides.map(s => s.id === slide.id ? slide : s);
    setHeroSlides(newData);
    api.save('heroSlides', newData);
  };
  const deleteHeroSlide = (id: string) => {
    const newData = heroSlides.filter(s => s.id !== id);
    setHeroSlides(newData);
    api.save('heroSlides', newData);
  };

  const updateLogoSettings = (settings: LogoSettings) => {
    setLogoSettings(settings);
    api.save('logoSettings', settings);
  };
  const updateDesignSettings = (settings: DesignSettings) => {
    setDesignSettings(settings);
    api.save('designSettings', settings);
  };
  const updateAppSettings = (settings: AppSettings) => {
    setAppSettings(settings);
    api.save('appSettings', settings);
  };

  const addCertificationMark = (mark: CertificationMark) => {
    const newData = [...certificationMarks, mark];
    setCertificationMarks(newData);
    api.save('certificationMarks', newData);
  };
  const updateCertificationMark = (mark: CertificationMark) => {
    const newData = certificationMarks.map(m => m.id === mark.id ? mark : m);
    setCertificationMarks(newData);
    api.save('certificationMarks', newData);
  };
  const deleteCertificationMark = (id: string) => {
    const newData = certificationMarks.filter(m => m.id !== id);
    setCertificationMarks(newData);
    api.save('certificationMarks', newData);
  };

  const updateCalculatorSettings = (settings: CalculatorSettings) => {
    setCalculatorSettings(settings);
    api.save('calculatorSettings', settings);
  };

  const addBranch = (branch: Branch) => {
    const newData = [...branches, branch];
    setBranches(newData);
    api.save('branches', newData);
  };
  const updateBranch = (branch: Branch) => {
    const newData = branches.map(b => b.id === branch.id ? branch : b);
    setBranches(newData);
    api.save('branches', newData);
  };
  const deleteBranch = (id: string) => {
    const newData = branches.filter(b => b.id !== id);
    setBranches(newData);
    api.save('branches', newData);
  };

  const resetToDefaults = () => {
    if(window.confirm('모든 데이터를 초기값으로 되돌리시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      // Just clear backend data? or Reset to DEFAULT constants?
      // For now, let's just reload with defaults in memory and save everything.
      // A better approach might be to have a backend endpoint /api/reset
      setCompanyInfo(INITIAL_INFO); api.save('companyInfo', INITIAL_INFO);
      setCategories(INITIAL_CATEGORIES); api.save('categories', INITIAL_CATEGORIES);
      setProducts(INITIAL_PRODUCTS); api.save('products', INITIAL_PRODUCTS);
      setPlaylists(INITIAL_PLAYLISTS); api.save('playlists', INITIAL_PLAYLISTS);
      setFaqs(INITIAL_FAQS); api.save('faqs', INITIAL_FAQS);
      setCertifications(INITIAL_CERTS); api.save('certifications', INITIAL_CERTS);
      setLabEquipment(INITIAL_LAB); api.save('labEquipment', INITIAL_LAB);
      setHeroSlides(INITIAL_SLIDES); api.save('heroSlides', INITIAL_SLIDES);
      setLogoSettings(INITIAL_LOGO); api.save('logoSettings', INITIAL_LOGO);
      setDesignSettings(INITIAL_DESIGN); api.save('designSettings', INITIAL_DESIGN);
      setCertificationMarks(INITIAL_CERT_MARKS); api.save('certificationMarks', INITIAL_CERT_MARKS);
      setCalculatorSettings(INITIAL_CALCULATOR); api.save('calculatorSettings', INITIAL_CALCULATOR);
      setBranches(INITIAL_BRANCHES); api.save('branches', INITIAL_BRANCHES);
      setAppSettings({ youtubeApiKey: '' }); api.save('appSettings', { youtubeApiKey: '' });
      
      window.location.reload();
    }
  };

  return (
    <ContentContext.Provider value={{
      companyInfo, updateCompanyInfo,
      categories, addCategory, updateCategory, deleteCategory,
      products, addProduct, updateProduct, deleteProduct,
      playlists, updatePlaylist,
      faqs, updateFaqs,
      certifications, addCertification, updateCertification, deleteCertification,
      labEquipment, addLabEquipment, updateLabEquipment, deleteLabEquipment,
      heroSlides, addHeroSlide, updateHeroSlide, deleteHeroSlide,
      logoSettings, updateLogoSettings,
      designSettings, updateDesignSettings,
      appSettings, updateAppSettings,
      certificationMarks, addCertificationMark, updateCertificationMark, deleteCertificationMark,
      calculatorSettings, updateCalculatorSettings,
      branches, addBranch, updateBranch, deleteBranch,
      currentLang, toggleLanguage,
      resetToDefaults,
      isLoading
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};