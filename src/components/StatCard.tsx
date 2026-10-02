import React from 'react';
import { LucideIcon, ArrowUpRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  explanation: string;
  icon: LucideIcon;
  badgeText?: string;
  badgeType?: 'warning' | 'success' | 'info' | 'danger' | 'neutral';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  explanation,
  icon: Icon,
  badgeText,
  badgeType = 'neutral',
  onClick,
}) => {
  const badgeStyles = {
    danger: 'bg-red-50 text-red-700 border-red-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    neutral: 'bg-slate-50 text-slate-700 border-slate-200',
  };

  const iconColors = {
    danger: 'text-red-600 bg-red-50',
    warning: 'text-amber-600 bg-amber-50',
    success: 'text-emerald-700 bg-emerald-50',
    info: 'text-blue-700 bg-blue-50',
    neutral: 'text-slate-700 bg-slate-100',
  };

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:shadow-md transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-[#0B6B3A]/40' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold text-[#12304A] font-mono-data tracking-tight">
              {value}
            </span>
            {unit && (
              <span className="text-xs font-medium text-slate-500">
                {unit}
              </span>
            )}
          </div>
        </div>

        <div className={`p-2.5 rounded-lg ${iconColors[badgeType]} border border-slate-100 shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
        <span className="text-slate-500 line-clamp-1">
          {explanation}
        </span>
        {badgeText && (
          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border shrink-0 ${badgeStyles[badgeType]}`}>
            {badgeText}
          </span>
        )}
      </div>

      {onClick && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 group-hover:text-[#0B6B3A]">
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      )}
    </div>
  );
};
