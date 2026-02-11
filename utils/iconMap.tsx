import React from 'react';
import * as Lucide from 'lucide-react';

// A curated list of icons suitable for this industry
export const AVAILABLE_ICONS = [
  'ShieldCheck', 'CheckCircle2', 'Clock', 'Truck', 'Tag', 'Leaf', 
  'Award', 'Beaker', 'ClipboardCheck', 'Microscope', 'MapPin', 
  'Phone', 'Printer', 'Send', 'MessageSquare', 'Wrench', 'Hammer',
  'HardHat', 'Cone', 'Droplets', 'Sun', 'Snowflake', 'Zap'
];

export const IconRenderer = ({ name, className, size = 24 }: { name: string; className?: string; size?: number }) => {
  const IconComponent = (Lucide as any)[name];
  
  if (!IconComponent) {
    return <Lucide.HelpCircle size={size} className={className} />;
  }

  return <IconComponent size={size} className={className} />;
};