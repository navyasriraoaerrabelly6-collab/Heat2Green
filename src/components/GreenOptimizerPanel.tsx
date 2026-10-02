import React, { useState, useMemo } from 'react';
import { 
  Leaf, 
  Sliders, 
  Sparkles, 
  TreePine, 
  ArrowRight, 
  FilePlus, 
  CheckCircle, 
  Info,
  Maximize2,
  Building,
  RotateCcw
} from 'lucide-react';
import { WardZone, CityData, GreenSuitabilityWeights } from '../types';
import { 
  DEFAULT_GREEN_WEIGHTS, 
  calculateGreenSuitability, 
  formatInterventionName 
} from '../services/scoringEngine';

interface GreenOptimizerPanelProps {
  cities: CityData[];
  selectedCity: CityData | null;
  selectedWard: WardZone | null;
  onSelectWard: (ward: WardZone) => void;
  onPlanIntervention: (ward: WardZone) => void;
  onAddToReport: (ward: WardZone) => void;
}

export const GreenOptimizerPanel: React.FC<GreenOptimizerPanelProps> = ({
  cities,
  selectedCity,
  selectedWard,
  onSelectWard,
  onPlanIntervention,
  onAddToReport,
}) => {
  // Configurable weights state
  const [weights, setWeights] = useState<GreenSuitabilityWeights>(DEFAULT_GREEN_WEIGHTS);
  const [scoreTierFilter, setScoreTierFilter] = useState<'ALL' | 'VERY_HIGH' | 'HIGH' | 'MODERATE'>('ALL');
  const [interventionFilter, setInterventionFilter] = useState<string>('ALL');

  // Wards with live recalculated Green Suitability scores
  const optimizedWards = useMemo(() => {
    const list = selectedCity ? selectedCity.wards : cities.flatMap(c => c.wards);

    return list.map(ward => {
      const liveScore = calculateGreenSuitability(ward, weights);
      return {
        ...ward,
        calculatedSuitability: liveScore,
      };
    }).filter(ward => {
      if (scoreTierFilter === 'VERY_HIGH' && ward.calculatedSuitability < 85) return false;
      if (scoreTierFilter === 'HIGH' && (ward.calculatedSuitability < 70 || ward.calculatedSuitability >= 85)) return false;
      if (scoreTierFilter === 'MODERATE' && ward.calculatedSuitability >= 70) return false;
      
      if (interventionFilter !== 'ALL' && ward.recommendedIntervention !== interventionFilter) return false;

      return true;
    }).sort((a, b) => b.calculatedSuitability - a.calculatedSuitability);
  }, [cities, selectedCity, weights, scoreTierFilter, interventionFilter]);

  const handleResetWeights = () => {
    setWeights(DEFAULT_GREEN_WEIGHTS);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0B6B3A] to-[#14532D] text-white rounded-xl p-6 shadow-xs border border-[#14532D]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-md bg-white/10 text-emerald-300">
                <Leaf className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold tracking-tight font-serif">
                Smart Green Optimizer
              </h2>
              <span className="text-[10px] font-semibold bg-emerald-400/20 text-emerald-200 px-2 py-0.5 rounded border border-emerald-300/30">
                Decision Support Matrix
              </span>
            </div>
            <p className="text-xs text-emerald-100 max-w-2xl leading-relaxed">
              Multi-criteria spatial algorithm that identifies and ranks urban wards where tree plantation, pocket parks, and green corridors produce the highest cooling relief per square meter.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono-data bg-black/20 p-2.5 rounded-lg border border-white/10">
            <TreePine className="w-4 h-4 text-emerald-300" />
            <div>
              <div className="text-[10px] text-emerald-200">Recommended Zones</div>
              <div className="font-bold text-white text-base">
                {optimizedWards.length} High-Yield Sectors
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scoring Weight Configurator Accordion / Panel */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#0B6B3A]" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              Configurable Scoring Weights (Multi-Criteria Evaluation)
            </h3>
          </div>
          <button
            onClick={handleResetWeights}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-[#0B6B3A] font-medium transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset to Standard Norms</span>
          </button>
        </div>

        {/* 5 Configurable Criteria Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-3 text-xs">
          <div>
            <div className="flex justify-between mb-1 font-medium">
              <span className="text-slate-600">Heat Risk Weight</span>
              <span className="font-mono-data font-bold text-[#DC2626]">
                {(weights.heatRiskWeight * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.60"
              step="0.05"
              value={weights.heatRiskWeight}
              onChange={(e) => setWeights({ ...weights, heatRiskWeight: parseFloat(e.target.value) })}
              className="w-full accent-[#DC2626] cursor-pointer"
            />
            <span className="text-[10px] text-slate-400">Surface temp & hotspot severity</span>
          </div>

          <div>
            <div className="flex justify-between mb-1 font-medium">
              <span className="text-slate-600">Vegetation Deficit</span>
              <span className="font-mono-data font-bold text-emerald-700">
                {(weights.vegetationDeficitWeight * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.50"
              step="0.05"
              value={weights.vegetationDeficitWeight}
              onChange={(e) => setWeights({ ...weights, vegetationDeficitWeight: parseFloat(e.target.value) })}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400">Absence of canopy cover</span>
          </div>

          <div>
            <div className="flex justify-between mb-1 font-medium">
              <span className="text-slate-600">Open Space Feasibility</span>
              <span className="font-mono-data font-bold text-blue-700">
                {(weights.openSpaceWeight * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.40"
              step="0.05"
              value={weights.openSpaceWeight}
              onChange={(e) => setWeights({ ...weights, openSpaceWeight: parseFloat(e.target.value) })}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400">Municipal land & buffers</span>
          </div>

          <div>
            <div className="flex justify-between mb-1 font-medium">
              <span className="text-slate-600">Population Exposure</span>
              <span className="font-mono-data font-bold text-purple-700">
                {(weights.populationExposureWeight * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.30"
              step="0.05"
              value={weights.populationExposureWeight}
              onChange={(e) => setWeights({ ...weights, populationExposureWeight: parseFloat(e.target.value) })}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400">Density & vulnerable groups</span>
          </div>

          <div>
            <div className="flex justify-between mb-1 font-medium">
              <span className="text-slate-600">Distance to Public Park</span>
              <span className="font-mono-data font-bold text-amber-700">
                {(weights.distanceToParkWeight * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.30"
              step="0.05"
              value={weights.distanceToParkWeight}
              onChange={(e) => setWeights({ ...weights, distanceToParkWeight: parseFloat(e.target.value) })}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400">Park equity & walking deficit</span>
          </div>
        </div>
      </div>

      {/* Filters Bar for Optimizer Results */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Filter By Suitability:</span>
          <button
            onClick={() => setScoreTierFilter('ALL')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              scoreTierFilter === 'ALL' ? 'bg-[#0B6B3A] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Tiers
          </button>
          <button
            onClick={() => setScoreTierFilter('VERY_HIGH')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              scoreTierFilter === 'VERY_HIGH' ? 'bg-[#0B6B3A] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Very High (85–100)
          </button>
          <button
            onClick={() => setScoreTierFilter('HIGH')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              scoreTierFilter === 'HIGH' ? 'bg-[#0B6B3A] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            High (70–84)
          </button>
          <button
            onClick={() => setScoreTierFilter('MODERATE')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              scoreTierFilter === 'MODERATE' ? 'bg-[#0B6B3A] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Moderate (&lt;70)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-600 font-medium">Intervention:</span>
          <select
            value={interventionFilter}
            onChange={(e) => setInterventionFilter(e.target.value)}
            className="bg-[#F5F8F6] border border-slate-300 rounded px-2 py-1 text-slate-800 font-medium focus:ring-1 focus:ring-[#0B6B3A]"
          >
            <option value="ALL">All Types</option>
            <option value="TREE_PLANTATION">Tree Plantation</option>
            <option value="POCKET_PARK">Pocket Park</option>
            <option value="GREEN_CORRIDOR">Green Corridor</option>
            <option value="GREEN_ROOF">Green Roof</option>
            <option value="SHADED_PARKING">Shaded Parking</option>
            <option value="PERMEABLE_SURFACE">Permeable Surface</option>
          </select>
        </div>
      </div>

      {/* Grid of Recommended Intervention Wards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {optimizedWards.map((ward) => {
          const isSelected = selectedWard?.id === ward.id;
          const score = ward.calculatedSuitability;

          return (
            <div
              key={ward.id}
              className={`bg-white border rounded-xl p-4.5 shadow-xs transition-all flex flex-col justify-between ${
                isSelected 
                  ? 'border-[#0B6B3A] ring-2 ring-[#0B6B3A]/20' 
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <div>
                {/* Top header row */}
                <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-mono-data text-slate-500 font-semibold uppercase">
                      {ward.cityName} · {ward.wardNumber}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {ward.name}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono-data font-bold px-2 py-0.5 rounded bg-[#EAF6EE] text-[#0B6B3A] border border-[#2E7D32]/30">
                      Score {score}/100
                    </span>
                  </div>
                </div>

                {/* Score breakdown metrics */}
                <div className="grid grid-cols-3 gap-2 py-3 text-center text-xs font-mono-data">
                  <div className="bg-red-50/70 p-1.5 rounded">
                    <span className="text-[10px] text-red-700 block">Heat Risk</span>
                    <span className="font-bold text-red-800">{ward.heatRiskScore}/100</span>
                  </div>
                  <div className="bg-emerald-50/70 p-1.5 rounded">
                    <span className="text-[10px] text-emerald-800 block">Green Cover</span>
                    <span className="font-bold text-emerald-900">{ward.greenCoverPercent}%</span>
                  </div>
                  <div className="bg-blue-50/70 p-1.5 rounded">
                    <span className="text-[10px] text-blue-700 block">Open Land</span>
                    <span className="font-bold text-blue-900">{ward.openSpaceHectares} ha</span>
                  </div>
                </div>

                {/* Recommended Intervention Block */}
                <div className="bg-[#F5F8F6] p-3 rounded-lg border border-slate-200 text-xs space-y-1 my-1">
                  <div className="flex items-center gap-1.5 text-[#0B6B3A] font-bold">
                    <TreePine className="w-3.5 h-3.5" />
                    <span>{formatInterventionName(ward.recommendedIntervention)}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {ward.interventionReason}
                  </p>
                  <div className="pt-1.5 flex items-center justify-between text-[10px] text-slate-500 font-mono-data border-t border-slate-200">
                    <span>Tree Capacity: ~{ward.estimatedTreeCapacity} trees</span>
                    <span className="text-emerald-700 font-bold">
                      Est. Cooling: -{ward.potentialCoolingDelta}°C
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100 mt-2">
                <button
                  onClick={() => onSelectWard(ward)}
                  className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-semibold transition-colors text-center"
                >
                  View Details
                </button>
                <button
                  onClick={() => onPlanIntervention(ward)}
                  className="flex-1 py-1.5 px-2 bg-[#0B6B3A] hover:bg-[#14532D] text-white rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                >
                  <Leaf className="w-3 h-3" />
                  <span>Plan Intervention</span>
                </button>
                <button
                  onClick={() => onAddToReport(ward)}
                  className="p-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs transition-colors"
                  title="Add to Municipal Report"
                  aria-label="Add to Report"
                >
                  <FilePlus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
