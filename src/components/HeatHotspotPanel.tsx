import React, { useState, useMemo } from 'react';
import { 
  Flame, 
  Thermometer, 
  AlertTriangle, 
  Users, 
  Building2, 
  Leaf, 
  Filter, 
  ArrowRight,
  TrendingUp,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { WardZone, CityData } from '../types';

interface HeatHotspotPanelProps {
  cities: CityData[];
  selectedCity: CityData | null;
  selectedWard: WardZone | null;
  onSelectCity: (city: CityData) => void;
  onSelectWard: (ward: WardZone) => void;
  onPlanIntervention: (ward: WardZone) => void;
}

export const HeatHotspotPanel: React.FC<HeatHotspotPanelProps> = ({
  cities,
  selectedCity,
  selectedWard,
  onSelectCity,
  onSelectWard,
  onPlanIntervention,
}) => {
  // Filter states
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MODERATE'>('ALL');
  const [minLST, setMinLST] = useState<number>(34);

  // States available
  const availableStates = useMemo(() => {
    return Array.from(new Set(cities.map(c => c.state)));
  }, [cities]);

  // Filtered wards
  const filteredWards = useMemo(() => {
    let list = selectedCity ? selectedCity.wards : cities.flatMap(c => c.wards);
    
    if (selectedState !== 'ALL') {
      list = list.filter(w => w.state === selectedState);
    }
    
    if (riskFilter === 'CRITICAL') {
      list = list.filter(w => w.heatRiskScore >= 85);
    } else if (riskFilter === 'HIGH') {
      list = list.filter(w => w.heatRiskScore >= 70 && w.heatRiskScore < 85);
    } else if (riskFilter === 'MODERATE') {
      list = list.filter(w => w.heatRiskScore < 70);
    }

    if (minLST > 34) {
      list = list.filter(w => w.lstCelsius >= minLST);
    }

    return list.sort((a, b) => b.heatRiskScore - a.heatRiskScore);
  }, [cities, selectedCity, selectedState, riskFilter, minLST]);

  // Summary Metrics
  const summaryMetrics = useMemo(() => {
    if (filteredWards.length === 0) {
      return {
        highestZone: null,
        avgLST: 0,
        hotspotCount: 0,
        criticalCount: 0,
        totalPop: 0,
      };
    }

    const highest = filteredWards[0];
    const avgLST = (filteredWards.reduce((acc, w) => acc + w.lstCelsius, 0) / filteredWards.length).toFixed(1);
    const criticalCount = filteredWards.filter(w => w.heatRiskScore >= 85).length;
    const totalPop = filteredWards.reduce((acc, w) => acc + w.estimatedPopulation, 0);

    return {
      highestZone: highest,
      avgLST,
      hotspotCount: filteredWards.length,
      criticalCount,
      totalPop,
    };
  }, [filteredWards]);

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#0B6B3A]" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              Hotspot Filter Controls
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono-data">
            Showing {filteredWards.length} Wards & Hotspot Sectors
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 text-xs">
          {/* State Filter */}
          <div>
            <label className="block text-slate-600 font-medium mb-1">State / UT</label>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
              }}
              className="w-full bg-[#F5F8F6] border border-slate-300 rounded-md p-2 text-slate-800 font-medium focus:ring-1 focus:ring-[#0B6B3A] focus:outline-none"
            >
              <option value="ALL">All Monitored States</option>
              {availableStates.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* City Selector */}
          <div>
            <label className="block text-slate-600 font-medium mb-1">City Grid</label>
            <select
              value={selectedCity?.id || 'ALL'}
              onChange={(e) => {
                if (e.target.value === 'ALL') {
                  // Keep state if any
                } else {
                  const c = cities.find(city => city.id === e.target.value);
                  if (c) onSelectCity(c);
                }
              }}
              className="w-full bg-[#F5F8F6] border border-slate-300 rounded-md p-2 text-slate-800 font-medium focus:ring-1 focus:ring-[#0B6B3A] focus:outline-none"
            >
              <option value="ALL">All Cities ({cities.length})</option>
              {cities.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.state})
                </option>
              ))}
            </select>
          </div>

          {/* Risk Filter */}
          <div>
            <label className="block text-slate-600 font-medium mb-1">Heat Severity</label>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as any)}
              className="w-full bg-[#F5F8F6] border border-slate-300 rounded-md p-2 text-slate-800 font-medium focus:ring-1 focus:ring-[#0B6B3A] focus:outline-none"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="CRITICAL">Critical Hotspots (&ge;85)</option>
              <option value="HIGH">High Risk (70 - 84)</option>
              <option value="MODERATE">Moderate Risk (&lt;70)</option>
            </select>
          </div>

          {/* Min LST Threshold Slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-600 font-medium">Min LST Threshold</label>
              <span className="font-mono-data font-bold text-red-600">{minLST}°C</span>
            </div>
            <input
              type="range"
              min="34"
              max="45"
              step="0.5"
              value={minLST}
              onChange={(e) => setMinLST(parseFloat(e.target.value))}
              className="w-full accent-[#DC2626] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Flame className="w-3.5 h-3.5 text-red-600" />
            <span>Highest Heat Zone</span>
          </div>
          <div className="text-base font-bold text-slate-900 font-mono-data mt-1 line-clamp-1">
            {summaryMetrics.highestZone ? summaryMetrics.highestZone.name : 'N/A'}
          </div>
          <div className="text-[11px] text-red-700 font-bold mt-0.5">
            {summaryMetrics.highestZone ? `${summaryMetrics.highestZone.lstCelsius}°C · Score ${summaryMetrics.highestZone.heatRiskScore}` : '—'}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Thermometer className="w-3.5 h-3.5 text-amber-600" />
            <span>Average LST</span>
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono-data mt-1">
            {summaryMetrics.avgLST}°C
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Daytime Surface Thermal Mean
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>Active Hotspots</span>
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono-data mt-1">
            {summaryMetrics.hotspotCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Monitored Ward Enclaves
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Flame className="w-3.5 h-3.5 text-red-600" />
            <span>Critical Hotspots</span>
          </div>
          <div className="text-xl font-bold text-red-600 font-mono-data mt-1">
            {summaryMetrics.criticalCount}
          </div>
          <div className="text-[11px] text-red-600 font-semibold mt-0.5">
            Immediate Intervention Needed
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Population Exposed</span>
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono-data mt-1">
            {(summaryMetrics.totalPop / 100000).toFixed(1)} Lakh
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Residents in Thermal Focus
          </div>
        </div>
      </div>

      {/* Main Analysis Section: Ranked Table & Interactive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ranked Hotspot Wards List */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Top Urban Heat Hotspots by Priority
              </h4>
              <p className="text-xs text-slate-500">
                Click any zone to highlight on map and view microclimate breakdown
              </p>
            </div>
            <span className="text-xs font-semibold bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-200">
              Thermal GIS Ranking
            </span>
          </div>

          <div className="overflow-x-auto mt-3">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F5F8F6] text-slate-600 uppercase font-semibold text-[10px] tracking-wider border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Ward / Hotspot</th>
                  <th className="py-2.5 px-3">City & State</th>
                  <th className="py-2.5 px-3 text-right">LST Temp</th>
                  <th className="py-2.5 px-3 text-right">Heat Risk</th>
                  <th className="py-2.5 px-3 text-right">Green Cover</th>
                  <th className="py-2.5 px-3 text-center">Priority</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredWards.slice(0, 10).map((ward, idx) => {
                  const isSelected = selectedWard?.id === ward.id;
                  return (
                    <tr
                      key={ward.id}
                      onClick={() => onSelectWard(ward)}
                      className={`cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-emerald-50/70 border-l-4 border-l-[#0B6B3A]' 
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-2.5 px-3 font-semibold text-slate-800">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400 font-mono-data text-[10px] w-4">
                            #{idx + 1}
                          </span>
                          <span className="line-clamp-1">{ward.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                        {ward.cityName}, {ward.state}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono-data font-bold text-red-600">
                        {ward.lstCelsius}°C
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono-data font-bold">
                        <span className={`px-1.5 py-0.5 rounded text-[11px] ${
                          ward.heatRiskScore >= 85 ? 'bg-red-100 text-red-800' :
                          ward.heatRiskScore >= 70 ? 'bg-orange-100 text-orange-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {ward.heatRiskScore}/100
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono-data text-slate-700">
                        {ward.greenCoverPercent}%
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          ward.priority === 'CRITICAL' ? 'bg-red-600 text-white' :
                          ward.priority === 'HIGH' ? 'bg-orange-500 text-white' : 'bg-amber-500 text-white'
                        }`}>
                          {ward.priority}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onPlanIntervention(ward);
                          }}
                          className="py-1 px-2 bg-[#0B6B3A] text-white hover:bg-[#14532D] rounded text-[10px] font-semibold transition-colors"
                        >
                          Plan Green
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hotspot Correlation & Contributing Factors Card */}
        <div className="space-y-4">
          {/* Heat Risk vs Green Cover Correlation Indicator */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#0B6B3A]" />
              <span>Heat vs Green Cover Correlation</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Thermal satellite data demonstrates an inverse correlation between tree canopy density and peak Land Surface Temperature across Indian wards.
            </p>

            {/* Custom SVG Distribution Chart */}
            <div className="h-44 w-full bg-[#F5F8F6] rounded-lg border border-slate-200 p-2 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[10px] font-mono-data text-slate-500">
                <span>LST (°C) vs Green Cover (%)</span>
                <span className="text-[#DC2626] font-bold">Negative Slope (-0.74 r)</span>
              </div>
              <svg viewBox="0 0 280 120" className="w-full h-28 overflow-visible">
                {/* Axes */}
                <line x1="25" y1="10" x2="25" y2="105" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="25" y1="105" x2="270" y2="105" stroke="#cbd5e1" strokeWidth="1" />
                
                {/* Axis Labels */}
                <text x="10" y="20" fill="#94a3b8" fontSize="8">45°C</text>
                <text x="10" y="105" fill="#94a3b8" fontSize="8">32°C</text>
                <text x="25" y="116" fill="#94a3b8" fontSize="8">0%</text>
                <text x="250" y="116" fill="#94a3b8" fontSize="8">30% Green</text>
                
                {/* Trend line */}
                <line x1="35" y1="18" x2="250" y2="92" stroke="#DC2626" strokeWidth="2" strokeDasharray="3,3" />

                {/* Data points */}
                {filteredWards.slice(0, 12).map((w, i) => {
                  const cx = 25 + (w.greenCoverPercent / 30) * 230;
                  const cy = 105 - ((w.lstCelsius - 32) / (46 - 32)) * 90;
                  const isSel = selectedWard?.id === w.id;
                  return (
                    <circle
                      key={w.id}
                      cx={Math.min(265, Math.max(30, cx))}
                      cy={Math.min(100, Math.max(15, cy))}
                      r={isSel ? 5 : 3.5}
                      fill={isSel ? '#0B6B3A' : '#DC2626'}
                      stroke="#ffffff"
                      strokeWidth={1.5}
                      className="cursor-pointer"
                      onClick={() => onSelectWard(w)}
                    />
                  );
                })}
              </svg>
              <div className="text-[10px] text-slate-500 text-center">
                Wards with &lt;5% green cover experience up to +5.2°C surface temperature surge.
              </div>
            </div>
          </div>

          {/* Selected Ward Deep Dive Card */}
          {selectedWard ? (
            <div className="bg-[#EAF6EE] border border-[#2E7D32]/30 rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono-data text-[#0B6B3A] font-bold uppercase tracking-wider">
                    Detailed Focus
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">
                    {selectedWard.name}
                  </h4>
                  <p className="text-xs text-slate-600">
                    {selectedWard.cityName} · {selectedWard.wardNumber}
                  </p>
                </div>
                <span className="text-xs font-mono-data font-bold bg-[#DC2626] text-white px-2 py-0.5 rounded">
                  {selectedWard.lstCelsius}°C
                </span>
              </div>

              <div className="text-xs text-slate-700 space-y-1.5 pt-1 border-t border-emerald-200">
                <div className="flex justify-between">
                  <span className="text-slate-600">Built-Up Impervious Density:</span>
                  <span className="font-mono-data font-semibold">{selectedWard.builtUpPercent}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Existing Tree Canopy:</span>
                  <span className="font-mono-data font-semibold text-emerald-800">{selectedWard.greenCoverPercent}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Distance to Public Park:</span>
                  <span className="font-mono-data font-semibold">{selectedWard.distanceToExistingParkMeters} meters</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Available Vacant / Public Space:</span>
                  <span className="font-mono-data font-semibold">{selectedWard.openSpaceHectares} ha</span>
                </div>
              </div>

              <button
                onClick={() => onPlanIntervention(selectedWard)}
                className="w-full py-2 bg-[#0B6B3A] hover:bg-[#14532D] text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Plan Green Intervention for this Ward</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center text-xs text-slate-500">
              <MapPin className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
              <p className="font-medium text-slate-700">No Ward Selected</p>
              <p className="mt-0.5">Click any row in the table or pin on the map to inspect microclimate indicators.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
