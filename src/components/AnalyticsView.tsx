import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Flame, 
  Leaf, 
  Building2, 
  Users, 
  Calendar,
  Layers,
  PieChart
} from 'lucide-react';
import { CityData, WardZone } from '../types';

interface AnalyticsViewProps {
  cities: CityData[];
  onSelectWard: (ward: WardZone) => void;
  onNavigateToMap: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  cities,
  onSelectWard,
  onNavigateToMap,
}) => {
  const [timeframe, setTimeframe] = useState<'ANNUAL' | 'SUMMER_PEAK' | 'POST_MONSOON'>('SUMMER_PEAK');

  const allWards = cities.flatMap(c => c.wards);
  const avgTemp = (cities.reduce((acc, c) => acc + c.avgLSTCelsius, 0) / cities.length).toFixed(1);
  const avgRisk = Math.round(cities.reduce((acc, c) => acc + c.avgHeatRiskScore, 0) / cities.length);
  const avgGreen = (cities.reduce((acc, c) => acc + c.avgGreenCoverPercent, 0) / cities.length).toFixed(1);
  const totalHotspots = cities.reduce((acc, c) => acc + c.totalHotspots, 0);
  const totalPotentialHa = cities.reduce((acc, c) => acc + c.potentialGreenHectares, 0);

  // Intervention type distribution
  const interventionCounts = {
    TREE_PLANTATION: allWards.filter(w => w.recommendedIntervention === 'TREE_PLANTATION').length,
    POCKET_PARK: allWards.filter(w => w.recommendedIntervention === 'POCKET_PARK').length,
    GREEN_CORRIDOR: allWards.filter(w => w.recommendedIntervention === 'GREEN_CORRIDOR').length,
    GREEN_ROOF: allWards.filter(w => w.recommendedIntervention === 'GREEN_ROOF').length,
    SHADED_PARKING: allWards.filter(w => w.recommendedIntervention === 'SHADED_PARKING').length,
    PERMEABLE_SURFACE: allWards.filter(w => w.recommendedIntervention === 'PERMEABLE_SURFACE').length,
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-[#EAF6EE] text-[#0B6B3A]">
                <BarChart3 className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-slate-900 font-serif">
                Spatial Environmental Analytics Dashboard
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Macro thermal telemetry, canopy deficit trends, and intervention capacity across 8 Indian metropolises.
            </p>
          </div>

          {/* Timeframe Filter */}
          <div className="flex items-center bg-[#F5F8F6] rounded-lg p-1 border border-slate-200 text-xs">
            <button
              onClick={() => setTimeframe('SUMMER_PEAK')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                timeframe === 'SUMMER_PEAK' ? 'bg-[#0B6B3A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Summer Peak (Apr–Jun)
            </button>
            <button
              onClick={() => setTimeframe('POST_MONSOON')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                timeframe === 'POST_MONSOON' ? 'bg-[#0B6B3A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Post-Monsoon (Oct–Nov)
            </button>
            <button
              onClick={() => setTimeframe('ANNUAL')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                timeframe === 'ANNUAL' ? 'bg-[#0B6B3A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Annual Mean
            </button>
          </div>
        </div>

        {/* Top Analytics Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-4 font-mono-data">
          <div className="bg-[#F5F8F6] p-3 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-500 font-sans uppercase font-bold block">Avg Surface Temp</span>
            <span className="text-xl font-bold text-red-600 mt-0.5 block">{avgTemp}°C</span>
            <span className="text-[10px] text-slate-500 font-sans">8 City LST Median</span>
          </div>

          <div className="bg-[#F5F8F6] p-3 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-500 font-sans uppercase font-bold block">Avg Heat Risk</span>
            <span className="text-xl font-bold text-amber-800 mt-0.5 block">{avgRisk}/100</span>
            <span className="text-[10px] text-slate-500 font-sans">Weighted Thermal Risk</span>
          </div>

          <div className="bg-[#F5F8F6] p-3 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-500 font-sans uppercase font-bold block">Avg Green Cover</span>
            <span className="text-xl font-bold text-emerald-800 mt-0.5 block">{avgGreen}%</span>
            <span className="text-[10px] text-slate-500 font-sans">Target: ≥25% Canopy</span>
          </div>

          <div className="bg-[#F5F8F6] p-3 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-500 font-sans uppercase font-bold block">Total Hotspots</span>
            <span className="text-xl font-bold text-slate-900 mt-0.5 block">{totalHotspots}</span>
            <span className="text-[10px] text-red-600 font-semibold font-sans">48 Critical Zones</span>
          </div>

          <div className="bg-[#F5F8F6] p-3 rounded-lg border border-slate-200 col-span-2 md:col-span-1">
            <span className="text-[10px] text-slate-500 font-sans uppercase font-bold block">Intervention Land</span>
            <span className="text-xl font-bold text-[#0B6B3A] mt-0.5 block">{totalPotentialHa} ha</span>
            <span className="text-[10px] text-slate-500 font-sans">Vacant / Buffer Sites</span>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Heat Risk by City Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-red-600" />
              <span>Comparative Heat Risk Index by City</span>
            </h3>
            <span className="text-[10px] font-mono-data text-slate-500">Scale: 0–100</span>
          </div>

          {/* SVG Bar Chart */}
          <div className="space-y-2.5">
            {cities.map((city) => (
              <div key={city.id} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">{city.name}</span>
                  <span className="font-mono-data font-bold text-slate-800">
                    {city.avgHeatRiskScore} / 100 ({city.avgLSTCelsius}°C LST)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      city.avgHeatRiskScore >= 80 ? 'bg-[#DC2626]' :
                      city.avgHeatRiskScore >= 70 ? 'bg-[#EA580C]' : 'bg-[#F59E0B]'
                    }`}
                    style={{ width: `${city.avgHeatRiskScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Green Cover vs Target Deficit */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-emerald-700" />
              <span>Existing Canopy vs Sustainable 25% Target</span>
            </h3>
            <span className="text-[10px] font-mono-data text-emerald-700 font-semibold">URDPFI Norms</span>
          </div>

          <div className="space-y-2.5">
            {cities.map((city) => {
              const deficit = Math.max(0, 25 - city.avgGreenCoverPercent);
              return (
                <div key={city.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">{city.name}</span>
                    <span className="font-mono-data font-semibold text-slate-800">
                      <span className="text-emerald-800 font-bold">{city.avgGreenCoverPercent}%</span>
                      <span className="text-slate-400"> / 25% (Deficit: {deficit.toFixed(1)}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex relative">
                    {/* 25% benchmark marker line */}
                    <div className="absolute top-0 bottom-0 left-[25%] w-0.5 bg-slate-400 z-10" />
                    <div
                      className="h-full bg-[#0B6B3A] rounded-full transition-all duration-500"
                      style={{ width: `${city.avgGreenCoverPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 3: Recommended Intervention Distribution */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <PieChart className="w-3.5 h-3.5 text-[#0B5CAB]" />
              <span>Intervention Strategy Allocation</span>
            </h3>
            <span className="text-[10px] font-mono-data text-slate-500">Across Sample Wards</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 rounded bg-[#F5F8F6]">
              <span className="text-slate-700 font-medium">Tree Plantation & Urban Forest:</span>
              <span className="font-mono-data font-bold text-[#0B6B3A]">{interventionCounts.TREE_PLANTATION} Wards</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-[#F5F8F6]">
              <span className="text-slate-700 font-medium">Miyawaki Pocket Green Space:</span>
              <span className="font-mono-data font-bold text-emerald-800">{interventionCounts.POCKET_PARK} Wards</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-[#F5F8F6]">
              <span className="text-slate-700 font-medium">Transit Linear Green Corridor:</span>
              <span className="font-mono-data font-bold text-teal-800">{interventionCounts.GREEN_CORRIDOR} Wards</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-[#F5F8F6]">
              <span className="text-slate-700 font-medium">Vegetated Cool Roofs:</span>
              <span className="font-mono-data font-bold text-blue-800">{interventionCounts.GREEN_ROOF} Wards</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-[#F5F8F6]">
              <span className="text-slate-700 font-medium">Permeable Surface Recharge:</span>
              <span className="font-mono-data font-bold text-slate-800">{interventionCounts.PERMEABLE_SURFACE} Wards</span>
            </div>
          </div>
        </div>

        {/* Chart 4: Population Vulnerability Matrix */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-purple-600" />
              <span>Demographic Thermal Vulnerability Exposure</span>
            </h3>
            <span className="text-[10px] font-mono-data text-slate-500">Demographic Grid</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono-data">
            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
              <div className="text-[10px] text-red-700 font-sans font-bold">Critical Exposure</div>
              <div className="text-xl font-bold text-red-900 mt-1">11 Wards</div>
              <div className="text-[10px] text-red-600 font-sans mt-0.5">&gt;2.5 Lakh vulnerable residents each</div>
            </div>
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
              <div className="text-[10px] text-amber-800 font-sans font-bold">High Exposure</div>
              <div className="text-xl font-bold text-amber-900 mt-1">14 Wards</div>
              <div className="text-[10px] text-amber-700 font-sans mt-0.5">Dense residential & transit hubs</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="text-[10px] text-blue-800 font-sans font-bold">Moderate Exposure</div>
              <div className="text-xl font-bold text-blue-900 mt-1">6 Wards</div>
              <div className="text-[10px] text-blue-700 font-sans mt-0.5">Suburban residential planned zones</div>
            </div>
            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
              <div className="text-[10px] text-emerald-800 font-sans font-bold">Low Exposure</div>
              <div className="text-xl font-bold text-emerald-900 mt-1">2 Wards</div>
              <div className="text-[10px] text-emerald-700 font-sans mt-0.5">High existing forest / ridge reserves</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
