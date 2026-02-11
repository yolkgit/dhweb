import React from 'react';
import { AVAILABLE_ICONS, IconRenderer } from '../utils/iconMap';

interface IconPickerProps {
  selectedIcon: string;
  onSelect: (iconName: string) => void;
}

const IconPicker: React.FC<IconPickerProps> = ({ selectedIcon, onSelect }) => {
  return (
    <div className="grid grid-cols-6 gap-2 p-2 border border-slate-200 rounded-lg max-h-40 overflow-y-auto bg-slate-50">
      {AVAILABLE_ICONS.map((iconName) => (
        <button
          key={iconName}
          type="button"
          onClick={() => onSelect(iconName)}
          className={`p-2 rounded flex items-center justify-center transition-all ${
            selectedIcon === iconName 
              ? 'bg-emerald-600 text-white shadow-md scale-110' 
              : 'bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-600'
          }`}
          title={iconName}
        >
          <IconRenderer name={iconName} size={20} />
        </button>
      ))}
    </div>
  );
};

export default IconPicker;