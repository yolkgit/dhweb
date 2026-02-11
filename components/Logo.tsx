import React from 'react';
import { useContent } from '../context/ContentContext';

interface LogoProps {
  className?: string;
  variant?: 'color' | 'white';
}

const Logo: React.FC<LogoProps> = ({ className = "h-8", variant = 'color' }) => {
  const { logoSettings } = useContent();
  const isWhite = variant === 'white';
  
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

  // 2. Default SVG Mode
  // Brand Colors
  const darkColor = isWhite ? '#ffffff' : '#0f172a'; // Slate-900 or White
  const primaryColor = '#059669'; // Emerald-600
  const accentColor = '#10b981'; // Emerald-500

  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      aria-label="Dahyeon Industry Logo"
    >
      {/* Hexagon Container representing Stability & Technology */}
      <path 
        d="M50 5 L93.3 30 V80 L50 105 L6.7 80 V30 L50 5Z" 
        fill={isWhite ? 'rgba(255,255,255,0.1)' : 'rgba(5, 150, 105, 0.1)'}
        stroke={isWhite ? '#ffffff' : primaryColor}
        strokeWidth="2"
      />

      {/* Stylized Road Path / 'D' Shape */}
      <path 
        d="M35 35 L45 35 L65 75 L55 75 Z" 
        fill={isWhite ? '#ffffff' : primaryColor} 
      />
      <path 
        d="M45 35 L55 35 L75 75 L65 75 Z" 
        fill={isWhite ? '#e2e8f0' : accentColor} 
        opacity="0.8"
      />
      
      {/* Center Line (Road Mark) */}
      <rect x="48" y="50" width="4" height="15" rx="2" fill={isWhite ? primaryColor : '#ffffff'} transform="skewX(-20)" />

      {/* Small accent dot/sun */}
      <circle cx="70" cy="30" r="5" fill={isWhite ? '#fbbf24' : '#f59e0b'} />
    </svg>
  );
};

export default Logo;