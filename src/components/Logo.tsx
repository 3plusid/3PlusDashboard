import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  lightText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showSubtitle = true, lightText = true }) => {
  const sizeClasses = {
    sm: { box: 'w-7 h-7 text-xs', text: 'text-sm', sub: 'text-[9px]' },
    md: { box: 'w-8 h-8 text-sm', text: 'text-base', sub: 'text-[10px]' },
    lg: { box: 'w-11 h-11 text-lg', text: 'text-xl', sub: 'text-xs' },
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* 3Plus Symbol Badge */}
      <div className={`${sizeClasses.box} bg-orange-500 rounded-md flex items-center justify-center font-black text-white shadow-sm shadow-orange-500/20 shrink-0`}>
        3+
      </div>

      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1">
          <span className={`font-bold tracking-tight ${lightText ? 'text-white' : 'text-slate-900'} ${sizeClasses.text} leading-none`}>
            PT 3Plus Indonesia
          </span>
        </div>
        {showSubtitle && (
          <span className={`text-[10px] uppercase font-bold tracking-widest ${lightText ? 'text-slate-400' : 'text-slate-500'} mt-0.5`}>
            Management System
          </span>
        )}
      </div>
    </div>
  );
};
