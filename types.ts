// Dynamic Category Type (replaced enum)
export interface Category {
  id: string;
  label: string;
}

export type ProductCategory = string; // Alias for string IDs

export interface CertificationMark {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
}

export interface CalculatorSettings {
  bagImageUrl: string;
  palletImageUrl: string;
  density: number; // kg/m^3 (default approx 2300)
}

export interface Product {
  id: string;
  name: string;
  category: string; // Refers to Category.id
  description: string;
  features: string[];
  specs?: Record<string, string>;
  specTable?: {
    headers: string[];
    rows: string[][];
  };
  imageUrl: string;
  isNew?: boolean;
  isEco?: boolean;
  specUrl?: string; // 시방서 URL (Base64 or Link)
  msdsUrl?: string; // MSDS URL (Base64 or Link)
  certificationMarkIds?: string[]; // Array of CertificationMark IDs
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  type: 'PATENT' | 'CERTIFICATE' | 'TEST_REPORT';
  pdfUrl?: string;
}

export interface LabEquipment {
  id: string;
  title: string;
  desc: string;
  iconName: string;
  imageUrl?: string;
}

export interface NavItem {
  label: string;
  path: string;
}

export interface AppSettings {
  youtubeApiKey: string;
}

// Hero Slide for Landing Page
export interface HeroSlide {
  id: string;
  type: 'image' | 'video';
  src: string;       // Image URL or Video URL
  poster?: string;   // For videos
  title: string;     // Small top title
  subtitle: string;  // Main big title
  desc: string;      // Description
  order: number;
  fadeOutDuration?: number; // Seconds before end to start transition (Video)
  duration?: number; // Duration in seconds (Image)
}

// Logo Configuration
export interface LogoSettings {
  useCustomLabel: boolean; // If true, use custom images. If false, use default SVG.
  defaultUrl?: string;     // Standard Logo (Color)
  whiteUrl?: string;       // White Logo (for dark backgrounds)
}

// Design Settings (Font & Size)
export interface DesignSettings {
  fontFamily: string; // Global Body Font
  fontSize: 'small' | 'medium' | 'large'; // Global Base Size
  headerFontFamily: string; // Header Brand Font
  headerTitleSize: 'small' | 'medium' | 'large' | 'xlarge'; // Header Brand Size
  headerFontSize: 'small' | 'medium' | 'large'; // Header Nav Size
  footerFontFamily: string; // Footer Brand Font
  footerFontSize: 'small' | 'medium' | 'large'; // Footer Text Size
}

// Maps Category ID to YouTube Playlist ID
export type CategoryPlaylists = Record<string, string>;