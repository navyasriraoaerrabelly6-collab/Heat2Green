import React from 'react';
import { Leaf, SunMedium, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#12304A] text-white border-t border-[#1e4566] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-[#224769]">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-[#0B6B3A] text-white flex items-center justify-center relative overflow-hidden border border-[#2E7D32]">
                <SunMedium className="w-5 h-5 text-amber-300 absolute -top-1 -right-1 opacity-80" />
                <Leaf className="w-5 h-5 text-white relative z-10" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white font-serif">
                  HEAT2GREEN
                </span>
                <p className="text-[11px] text-slate-300">
                  Urban Heat Intelligence & Smart Green Planning Platform
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              AI-assisted urban heat analysis, hotspot detection, and GIS-powered green infrastructure optimization designed to empower Indian urban development authorities, municipal corporations, researchers, and citizens.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Aligned with National Mission on Sustainable Habitat (NMSH)</span>
            </div>
          </div>

          {/* Col 2: Platform */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
              GIS Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button onClick={() => onNavigate('heatmap')} className="hover:text-white transition-colors">
                  Urban Heat Map
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('optimizer')} className="hover:text-white transition-colors">
                  Smart Green Optimizer
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('planner')} className="hover:text-white transition-colors">
                  Intervention Planner
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('analytics')} className="hover:text-white transition-colors">
                  Spatial Analytics
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('compare')} className="hover:text-white transition-colors">
                  Compare Cities
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('reports')} className="hover:text-white transition-colors">
                  Executive Reports
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Information */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
              Information
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  About Platform
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  Scientific Methodology
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Project Office & Support
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('feedback')} className="hover:text-white transition-colors">
                  Citizen & Planner Feedback
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Data Governance */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
              Data & Ethics
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-1.5 text-slate-300">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Decision-Support Portal</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Open Data Standards</span>
              </li>
              <li className="pt-2 text-[11px] text-slate-400 leading-tight">
                Simulated data are calibrated on sample satellite thermal anomalies and municipal ward boundaries.
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="py-4 text-[11px] text-slate-400 border-b border-[#224769] leading-relaxed">
          <strong className="text-slate-200">Disclaimer:</strong> Heat2Green is a technical decision-support and planning portal. The thermal indices, green suitability scores, and projected CO₂ sequestration values are computational estimates designed to prioritize field assessments. They do not replace statutory Environmental Impact Assessments (EIA), ground botanical surveys, or formal state urban master-planning procedures.
        </div>

        {/* Bottom row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <div>
            © {new Date().getFullYear()} HEAT2GREEN. Urban Heat Intelligence & Smart Green Planning Platform.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('about')} className="hover:text-slate-200">Privacy Policy</button>
            <span>·</span>
            <button onClick={() => onNavigate('about')} className="hover:text-slate-200">Terms of Service</button>
            <span>·</span>
            <button onClick={() => onNavigate('faq')} className="hover:text-slate-200">Data Guidelines</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
