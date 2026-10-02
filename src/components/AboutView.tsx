import React from 'react';
import { 
  ShieldCheck, 
  Leaf, 
  Flame, 
  Compass, 
  Cpu, 
  AlertCircle, 
  Trees, 
  ArrowRight,
  Database,
  LineChart,
  Target
} from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title Hero */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-3">
        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#EAF6EE] text-[#0B6B3A] border border-[#2E7D32]/20 uppercase tracking-wider">
          Platform Governance & Science
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif tracking-tight">
          About Heat2Green
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          Heat2Green is an open GIS-assisted urban heat intelligence and smart green planning platform engineered to help Indian municipal corporations, urban planners, forestry departments, and citizens understand urban thermal anomalies and prioritize targeted green infrastructure.
        </p>
      </div>

      {/* Visual Pipeline Flow (Data -> Analysis -> Hotspot Detection -> Green Optimization -> Planning) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
          End-to-End Decision Support Architecture
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
          {/* Step 1 */}
          <div className="bg-[#F5F8F6] p-3.5 rounded-lg border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono-data text-slate-400 font-bold block">STEP 01</span>
              <div className="font-bold text-xs text-slate-900 mt-1 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#0B5CAB]" />
                <span>Data Ingestion</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Satellite thermal LST, optical NDVI, and municipal ward vectors.
              </p>
            </div>
            <div className="text-[9px] text-slate-400 mt-2 font-mono-data">Landsat / Sentinel / Bhuvan</div>
          </div>

          {/* Step 2 */}
          <div className="bg-[#F5F8F6] p-3.5 rounded-lg border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono-data text-slate-400 font-bold block">STEP 02</span>
              <div className="font-bold text-xs text-slate-900 mt-1 flex items-center gap-1.5">
                <LineChart className="w-3.5 h-3.5 text-amber-600" />
                <span>Analysis</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Thermal normalization, built-up density, and canopy deficit indexing.
              </p>
            </div>
            <div className="text-[9px] text-slate-400 mt-2 font-mono-data">Multi-Criteria Evaluation</div>
          </div>

          {/* Step 3 */}
          <div className="bg-[#F5F8F6] p-3.5 rounded-lg border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono-data text-slate-400 font-bold block">STEP 03</span>
              <div className="font-bold text-xs text-slate-900 mt-1 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-red-600" />
                <span>Hotspots</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Spatial clustering of severe daytime thermal anomalies &gt;40°C.
              </p>
            </div>
            <div className="text-[9px] text-slate-400 mt-2 font-mono-data">Ward Risk Scoring (0–100)</div>
          </div>

          {/* Step 4 */}
          <div className="bg-[#F5F8F6] p-3.5 rounded-lg border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono-data text-slate-400 font-bold block">STEP 04</span>
              <div className="font-bold text-xs text-slate-900 mt-1 flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-[#0B6B3A]" />
                <span>Optimizer</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Matching heat stress with vacant plots and public right-of-ways.
              </p>
            </div>
            <div className="text-[9px] text-slate-400 mt-2 font-mono-data">Suitability Algorithm</div>
          </div>

          {/* Step 5 */}
          <div className="bg-[#EAF6EE] p-3.5 rounded-lg border border-[#2E7D32]/40 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono-data text-[#0B6B3A] font-bold block">STEP 05</span>
              <div className="font-bold text-xs text-[#0B6B3A] mt-1 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                <span>Planning Action</span>
              </div>
              <p className="text-[11px] text-slate-700 mt-1">
                Before/after microclimate simulation, tree budgets, and municipal reports.
              </p>
            </div>
            <div className="text-[9px] text-emerald-800 mt-2 font-mono-data">Actionable Dossier</div>
          </div>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Why Urban Heat Matters */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-600" />
            <span>Why Urban Heat Matters in Indian Cities</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Rapid concretization, loss of native tree canopy, glass facade reflections, and automotive emissions create severe Urban Heat Islands (UHIs). In cities like Delhi, Hyderabad, and Ahmedabad, daytime land surface temperatures often exceed 44°C during peak pre-monsoon heatwaves, endangering vulnerable outdoor workers, elderly populations, and elevating municipal air-conditioning energy demand.
          </p>
        </div>

        {/* Our Objective */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Leaf className="w-4 h-4 text-[#0B6B3A]" />
            <span>Our Objective & Vision</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Rather than planting trees ad-hoc, Heat2Green introduces scientific equity into greening. We pinpoint the exact micro-wards where high heat coincides with low vegetation and dense human exposure, ensuring every rupee of municipal greening budget delivers maximum cooling relief and carbon sequestration.
          </p>
        </div>

        {/* Heat Risk Methodology */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-600" />
            <span>Heat Risk Scoring Methodology</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            The Heat Risk Score (0–100) is a multi-criteria weighted index:
            <br />
            • <strong>35%</strong> Land Surface Temperature (LST in °C)
            <br />
            • <strong>25%</strong> Built-Up Density & Impervious Concrete Ratio
            <br />
            • <strong>20%</strong> Canopy Deficit (100 - Green Cover %)
            <br />
            • <strong>10%</strong> Impervious Road Surfaces
            <br />
            • <strong>10%</strong> Population Exposure & Demographics
          </p>
        </div>

        {/* Carbon Sequestration Methodology */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Trees className="w-4 h-4 text-emerald-700" />
            <span>Environmental & Carbon Sequestration Model</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Carbon sequestration uses an annual absorption factor of <strong>21.8 kg CO₂/tree/year</strong>, derived from standard Indian forestry benchmarks for mature broad-leaved native species (Neem, Peepal, Banyan, Jamun, Mahua). The model factor is configurable in the application settings to accommodate regional species variations.
          </p>
        </div>
      </div>

      {/* Limitations & Legal Transparency Notice */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 space-y-2">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
          <AlertCircle className="w-4 h-4 text-amber-700" />
          <span>Statutory Disclaimer & Limitations</span>
        </div>
        <p className="text-xs text-amber-800 leading-relaxed">
          Heat2Green is a technical decision-support and planning platform. It does NOT replace detailed civil engineering assessments, ground botanical surveys, statutory Environmental Impact Assessments (EIA), or official state urban master-planning procedures. All demo datasets, boundary coordinates, and simulation figures represent sample planning benchmarks.
        </p>
      </div>
    </div>
  );
};
