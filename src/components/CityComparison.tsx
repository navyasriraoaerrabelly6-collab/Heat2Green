import React, { useState } from 'react';
import { Scale, Check, Plus, X, Thermometer, Flame, Leaf, Building2, AlertTriangle, TreePine } from 'lucide-react';
import { CityData } from '../types';

interface CityComparisonProps {
  cities: CityData[];
  onSelectCity: (city: CityData) => void;
  onNavigateToMap: () => void;
}

export const CityComparison: React.FC<CityComparisonProps> = ({
  cities,
  onSelectCity,
  onNavigateToMap,
}) => {
  // Select default 3 cities for comparison: Hyderabad, Delhi, Bengaluru
  const [selectedCityIds, setSelectedCityIds] = useState<string[]>([
    'hyderabad',
    'delhi',
    'bengaluru',
  ]);

  const toggleCity = (cityId: string) => {
    if (selectedCityIds.includes(cityId)) {
      if (selectedCityIds.length > 2) {
        setSelectedCityIds(selectedCityIds.filter(id => id !== cityId));
      }
    } else {
      if (selectedCityIds.length < 4) {
        setSelectedCityIds([...selectedCityIds, cityId]);
      }
    }
  };

  const comparedCities = cities.filter(c => selectedCityIds.includes(c.id));

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-[#EAF3FA] text-[#0B5CAB]">
                <Scale className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-slate-900 font-serif">
                Comparative Urban Heat & Green Infrastructure Analytics
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Select 2 to 4 Indian metropolitan centers for cross-jurisdictional environmental benchmarking. Factual comparative metrics without ordinal ranking.
            </p>
          </div>

          <div className="text-xs text-slate-600 font-medium">
            Active: <span className="font-bold text-[#0B6B3A]">{selectedCityIds.length}/4</span> Cities
          </div>
        </div>

        {/* City Selection Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-3 text-xs">
          <span className="text-slate-600 font-medium mr-1">Available Cities:</span>
          {cities.map((city) => {
            const isSelected = selectedCityIds.includes(city.id);
            return (
              <button
                key={city.id}
                onClick={() => toggleCity(city.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all ${
                  isSelected
                    ? 'bg-[#EAF6EE] text-[#0B6B3A] border-[#2E7D32]/40 font-semibold shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {isSelected ? <Check className="w-3.5 h-3.5 text-[#0B6B3A]" /> : <Plus className="w-3.5 h-3.5 text-slate-400" />}
                <span>{city.name}</span>
                <span className="text-[10px] text-slate-500">({city.state})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Comparison Cards Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${comparedCities.length} gap-4`}>
        {comparedCities.map((city) => (
          <div
            key={city.id}
            className="bg-white border border-slate-200 rounded-xl p-4.5 shadow-xs space-y-4 hover:border-slate-300 transition-colors"
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono-data text-slate-500 uppercase font-bold">
                  {city.state}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {city.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Area: {city.totalAreaSqKm} sq km · {(city.totalPopulation / 100000).toFixed(0)} Lakh Pop
                </p>
              </div>

              {selectedCityIds.length > 2 && (
                <button
                  onClick={() => toggleCity(city.id)}
                  className="text-slate-400 hover:text-red-500 p-1 rounded"
                  title="Remove from comparison"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Key Comparison Indicators */}
            <div className="space-y-2.5 text-xs">
              {/* LST */}
              <div className="flex items-center justify-between p-2 rounded bg-red-50/70 border border-red-100">
                <span className="flex items-center gap-1.5 text-red-900 font-medium">
                  <Thermometer className="w-3.5 h-3.5 text-red-600" />
                  <span>Mean LST Temp</span>
                </span>
                <span className="font-mono-data font-bold text-red-700 text-sm">
                  {city.avgLSTCelsius}°C
                </span>
              </div>

              {/* Heat Risk Score */}
              <div className="flex items-center justify-between p-2 rounded bg-amber-50/70 border border-amber-100">
                <span className="flex items-center gap-1.5 text-amber-900 font-medium">
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                  <span>Avg Heat Risk Score</span>
                </span>
                <span className="font-mono-data font-bold text-amber-900 text-sm">
                  {city.avgHeatRiskScore}/100
                </span>
              </div>

              {/* Green Cover */}
              <div className="flex items-center justify-between p-2 rounded bg-emerald-50/70 border border-emerald-100">
                <span className="flex items-center gap-1.5 text-emerald-900 font-medium">
                  <Leaf className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Tree Canopy Cover</span>
                </span>
                <span className="font-mono-data font-bold text-emerald-800 text-sm">
                  {city.avgGreenCoverPercent}%
                </span>
              </div>

              {/* Built-up density */}
              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Built-up Surface</span>
                </span>
                <span className="font-mono-data font-bold text-slate-800 text-sm">
                  {city.avgBuiltUpPercent}%
                </span>
              </div>

              {/* Critical Hotspots */}
              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                  <span>Critical Hotspots</span>
                </span>
                <span className="font-mono-data font-bold text-red-600 text-sm">
                  {city.criticalHotspots} of {city.totalHotspots}
                </span>
              </div>

              {/* Potential Green Intervention Area */}
              <div className="flex items-center justify-between p-2 rounded bg-[#EAF6EE] border border-emerald-200">
                <span className="flex items-center gap-1.5 text-[#0B6B3A] font-medium">
                  <TreePine className="w-3.5 h-3.5 text-[#0B6B3A]" />
                  <span>Intervention Land Potential</span>
                </span>
                <span className="font-mono-data font-bold text-[#0B6B3A] text-sm">
                  {city.potentialGreenHectares} ha
                </span>
              </div>
            </div>

            {/* City Action */}
            <button
              onClick={() => {
                onSelectCity(city);
                onNavigateToMap();
              }}
              className="w-full py-2 bg-[#12304A] hover:bg-[#0B5CAB] text-white rounded text-xs font-semibold text-center transition-colors block mt-2"
            >
              Zoom to {city.name} Map
            </button>
          </div>
        ))}
      </div>

      {/* Comparative Analytical Matrix Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3">
          Cross-City Comparative Parameter Matrix
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F5F8F6] text-slate-600 uppercase font-semibold text-[10px] tracking-wider border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Environmental Parameter</th>
                {comparedCities.map(c => (
                  <th key={c.id} className="py-2.5 px-3 text-right font-bold text-slate-800">
                    {c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono-data">
              <tr>
                <td className="py-2 px-3 font-sans text-slate-700">Mean Land Surface Temp (°C)</td>
                {comparedCities.map(c => (
                  <td key={c.id} className="py-2 px-3 text-right text-red-600 font-bold">
                    {c.avgLSTCelsius}°C
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2 px-3 font-sans text-slate-700">Composite Heat Risk Index (0-100)</td>
                {comparedCities.map(c => (
                  <td key={c.id} className="py-2 px-3 text-right text-amber-800 font-bold">
                    {c.avgHeatRiskScore}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2 px-3 font-sans text-slate-700">Existing Green Tree Canopy (%)</td>
                {comparedCities.map(c => (
                  <td key={c.id} className="py-2 px-3 text-right text-emerald-800 font-bold">
                    {c.avgGreenCoverPercent}%
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2 px-3 font-sans text-slate-700">Built-Up Impervious Density (%)</td>
                {comparedCities.map(c => (
                  <td key={c.id} className="py-2 px-3 text-right text-slate-700">
                    {c.avgBuiltUpPercent}%
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2 px-3 font-sans text-slate-700">Identified Hotspot Clusters</td>
                {comparedCities.map(c => (
                  <td key={c.id} className="py-2 px-3 text-right text-slate-800">
                    {c.totalHotspots}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2 px-3 font-sans text-slate-700">Available Green Intervention Land (Hectares)</td>
                {comparedCities.map(c => (
                  <td key={c.id} className="py-2 px-3 text-right text-[#0B6B3A] font-bold">
                    {c.potentialGreenHectares} ha
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
