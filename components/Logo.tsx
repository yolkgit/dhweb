import React from 'react';
import { useContent } from '../context/ContentContext';

interface LogoProps {
  className?: string;
  variant?: 'color' | 'white';
}

const Logo: React.FC<LogoProps> = ({ className = "h-8", variant = 'color' }) => {
  const { logoSettings, isLoading } = useContent();
  const isWhite = variant === 'white';

  if (isLoading) return null;
  
  // 1. Custom Image Mode
  if (logoSettings.useCustomLabel) {
    const imageUrl = isWhite && logoSettings.whiteUrl ? logoSettings.whiteUrl : logoSettings.defaultUrl;
    
    if (imageUrl) {
      return (
        <img 
          src={imageUrl} 
          alt="Company Logo" 
          className={`object-contain ${className}`} 
        />
      );
    }
    // Fallback to SVG if image url is missing even in custom mode
  }

  // 2. Default SVG Mode - REMOVED
  // If no custom logo is configured, or if waiting for data, render nothing.
  return null;
};

export default Logo;