import React, { useState } from 'react';
import { 
  SunMedium, 
  Leaf, 
  Search, 
  Eye, 
  UserCheck, 
  Menu, 
  X,
  FileText,
  Sliders,
  Flame,
  BarChart3,
  Scale
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenSearch: () => void;
  onOpenLogin: () => void;
  isLoggedIn: boolean;
  loggedInRole: string | null;
  highContrast: boolean;
  onToggleHighContrast: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  language,
  onLanguageChange,
  onOpenSearch,
  onOpenLogin,
  isLoggedIn,
  loggedInRole,
  highContrast,
  onToggleHighContrast,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[language];

  const navLinks = [
    { id: 'home', label: t.navHome },
    { id: 'heatmap', label: t.navHeatMap, icon: Flame },
    { id: 'optimizer', label: t.navGreenOptimizer, icon: Leaf },
    { id: 'planner', label: t.navPlanner, icon: Sliders },
    { id: 'analytics', label: t.navAnalytics, icon: BarChart3 },
    { id: 'compare', label: t.navCompare, icon: Scale },
    { id: 'reports', label: t.navReports, icon: FileText },
    { id: 'about', label: t.navAbout },
    { id: 'faq', label: t.navFaq },
    { id: 'contact', label: t.navContact },
  ];

  const handleNavClick = (id: string) => {
    onTabChange(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#e2e8e4] shadow-xs">
      {/* Government Announcement Strip */}
      <div className="bg-[#12304A] text-white text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse"></span>
            <span className="font-medium tracking-wide">
              {t.announcement}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono-data">
            <span className="hidden sm:inline text-slate-300">
              National Urban Heat Intelligence Initiative
            </span>
            <div className="h-3 w-px bg-slate-600 hidden sm:block"></div>
            {/* Accessibility Contrast Toggle */}
            <button
              onClick={onToggleHighContrast}
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors ${
                highContrast ? 'bg-amber-400 text-slate-900 font-bold' : 'text-slate-200 hover:text-white'
              }`}
              title="Toggle High Contrast Mode"
              aria-label="Toggle High Contrast"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{highContrast ? 'Standard' : 'High Contrast'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-18">
          {/* Logo Brand Lockup */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left focus:outline-none group"
            aria-label="Go to Home"
          >
            <div className="w-11 h-11 rounded-lg bg-[#0B6B3A] text-white flex items-center justify-center shadow-xs border border-[#14532D] relative overflow-hidden group-hover:bg-[#14532D] transition-colors">
              <SunMedium className="w-7 h-7 text-amber-300 absolute -top-1 -right-1 opacity-80" />
              <Leaf className="w-6 h-6 text-white relative z-10" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-[#0B6B3A] font-serif">
                  HEAT2GREEN
                </span>
                <span className="text-[10px] font-semibold bg-[#EAF6EE] text-[#0B6B3A] px-1.5 py-0.5 rounded border border-[#2E7D32]/20 uppercase tracking-wider">
                  GIS Portal
                </span>
              </div>
              <div className="text-[11px] text-[#12304A]/80 font-medium tracking-tight">
                Urban Heat Intelligence Platform
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-[#EAF6EE] text-[#0B6B3A] border-b-2 border-[#0B6B3A]'
                      : 'text-[#12304A] hover:text-[#0B6B3A] hover:bg-[#F5F8F6]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Global Search Button */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-[#12304A] hover:text-[#0B6B3A] hover:bg-[#F5F8F6] rounded-md transition-colors"
              title="Search Wards, Hotspots, or Cities"
              aria-label="Search Cities or Hotspots"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Language Selector */}
            <div className="hidden sm:flex items-center bg-[#F5F8F6] rounded border border-slate-200 p-0.5 text-xs font-medium">
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-1 rounded transition-colors ${
                  language === 'en' ? 'bg-[#0B6B3A] text-white shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-2 py-1 rounded transition-colors ${
                  language === 'hi' ? 'bg-[#0B6B3A] text-white shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => onLanguageChange('te')}
                className={`px-2 py-1 rounded transition-colors ${
                  language === 'te' ? 'bg-[#0B6B3A] text-white shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                తెలుగు
              </button>
            </div>

            {/* Planner Login CTA */}
            <button
              onClick={onOpenLogin}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border transition-all ${
                isLoggedIn 
                  ? 'bg-[#EAF3FA] text-[#0B5CAB] border-[#0B5CAB]/30' 
                  : 'bg-[#0B6B3A] text-white border-[#14532D] hover:bg-[#14532D] shadow-xs'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden md:inline">
                {isLoggedIn ? (loggedInRole || 'Officer Active') : t.loginButton}
              </span>
              <span className="md:hidden">
                {isLoggedIn ? 'Officer' : 'Login'}
              </span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-[#0B6B3A] hover:bg-slate-100 rounded-md"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Navigation Menu
            </span>
            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-0.5 rounded ${language === 'en' ? 'bg-[#0B6B3A] text-white' : 'text-slate-600'}`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-2 py-0.5 rounded ${language === 'hi' ? 'bg-[#0B6B3A] text-white' : 'text-slate-600'}`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => onLanguageChange('te')}
                className={`px-2 py-0.5 rounded ${language === 'te' ? 'bg-[#0B6B3A] text-white' : 'text-slate-600'}`}
              >
                తెలుగు
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {navLinks.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 text-xs font-medium rounded text-left transition-colors ${
                    active
                      ? 'bg-[#EAF6EE] text-[#0B6B3A] font-semibold border-l-2 border-[#0B6B3A]'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
