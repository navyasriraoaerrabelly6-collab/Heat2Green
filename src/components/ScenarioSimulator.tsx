import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  ArrowRight, 
  Leaf, 
  Flame, 
  TreePine, 
  ShieldCheck, 
  CloudSun, 
  Users, 
  FilePlus, 
  HelpCircle,
  TrendingDown
} from 'lucide-react';
import { WardZone, CityData, InterventionType, SimulationParameters } from '../types';
import { runScenarioSimulation, formatInterventionName, DEFAULT_CO2_FACTOR_KG_PER_TREE } from '../services/scoringEngine';

interface ScenarioSimulatorProps {
  cities: CityData[];
  selectedCity: CityData | null;
  selectedWard: WardZone | null;
  onSelectWard: (ward: WardZone) => void;
  onAddToReport: (ward: WardZone, simDetails?: any) => void;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  cities,
  selectedCity,
  selectedWard,
  onSelectWard,
  onAddToReport,
}) => {
  // Available wards
  const allWards = selectedCity ? selectedCity.wards : cities.flatMap(c => c.wards);
  const activeWard = selectedWard || allWards[0];

  // Simulation controls state
  const [proposedGreenDelta, setProposedGreenDelta] = useState<number>(8); // +8%
  const [interventionType, setInterventionType] = useState<InterventionType>(activeWard.recommendedIntervention);
  const [treeCount, setTreeCount] = useState<number>(activeWard.estimatedTreeCapacity || 2500);
  const [interventionArea, setInterventionArea] = useState<number>(activeWard.openSpaceHectares > 0 ? Number((activeWard.openSpaceHectares * 0.6).toFixed(1)) : 15);
  const [co2Factor, setCo2Factor] = useState<number>(DEFAULT_CO2_FACTOR_KG_PER_TREE);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync when active ward changes
  useEffect(() => {
    if (activeWard) {
      setInterventionType(activeWard.recommendedIntervention);
      setTreeCount(activeWard.estimatedTreeCapacity || 2500);
      setInterventionArea(activeWard.openSpaceHectares > 0 ? Number((activeWard.openSpaceHectares * 0.6).toFixed(1)) : 15);
    }
  }, [activeWard.id]);

  // Run simulation calculation
  const simParams: SimulationParameters = {
    currentGreenCover: activeWard.greenCoverPercent,
    proposedAdditionalGreenCover: proposedGreenDelta,
    interventionType,
    treeCount,
    interventionAreaHectares: interventionArea,
    co2FactorKgPerTree: co2Factor,
  };

  const results = runScenarioSimulation(activeWard, simParams);

  const handleSaveToReport = () => {
    onAddToReport(activeWard, {
      simParams,
      results,
    });
    setToastMessage('Simulation scenario added to official municipal report package.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notice */}
      {toastMessage && (
        <div className="bg-[#0B6B3A] text-white px-4 py-2.5 rounded-lg shadow-md flex items-center justify-between text-xs animate-in fade-in">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-white hover:text-slate-200 font-bold ml-2">×</button>
        </div>
      )}

      {/* Title & Ward Selector Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-[#EAF6EE] text-[#0B6B3A]">
                <Sliders className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-slate-900 font-serif">
                Green Intervention Scenario Simulator
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate microclimate cooling outcomes, thermal risk reductions, and carbon capture before municipal budget sanction.
            </p>
          </div>

          {/* Active Ward Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600">Select Ward:</label>
            <select
              value={activeWard.id}
              onChange={(e) => {
                const found = allWards.find(w => w.id === e.target.value);
                if (found) onSelectWard(found);
              }}
              className="bg-[#F5F8F6] border border-slate-300 rounded-md px-3 py-1.5 text-xs font-semibold text-slate-800 focus:ring-1 focus:ring-[#0B6B3A]"
            >
              {allWards.map(w => (
                <option key={w.id} value={w.id}>
                  {w.cityName} — {w.name} ({w.wardNumber})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Simulator Input Controls Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 text-xs">
          {/* Slider: Proposed Additional Green Cover */}
          <div>
            <div className="flex justify-between mb-1 font-semibold">
              <span className="text-slate-700">Additional Green Cover</span>
              <span className="font-mono-data text-[#0B6B3A] text-sm font-bold">
                +{proposedGreenDelta}%
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              step="1"
              value={proposedGreenDelta}
              onChange={(e) => setProposedGreenDelta(parseInt(e.target.value))}
              className="w-full accent-[#0B6B3A] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>+1% Micro</span>
              <span>+25% Intensive</span>
            </div>
          </div>

          {/* Dropdown: Intervention Type */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Intervention Strategy
            </label>
            <select
              value={interventionType}
              onChange={(e) => setInterventionType(e.target.value as InterventionType)}
              className="w-full bg-[#F5F8F6] border border-slate-300 rounded-md p-2 text-slate-800 font-medium focus:ring-1 focus:ring-[#0B6B3A]"
            >
              <option value="TREE_PLANTATION">Tree Plantation (Indigenous Canopy)</option>
              <option value="POCKET_PARK">Miyawaki Pocket Forest</option>
              <option value="GREEN_CORRIDOR">Transit Green Corridor</option>
              <option value="GREEN_ROOF">Vegetated Cool Roofs</option>
              <option value="SHADED_PARKING">Canopy Shaded / Solar Parking</option>
              <option value="PERMEABLE_SURFACE">Permeable Grass Pavements</option>
            </select>
          </div>

          {/* Number Input: Tree Count */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Estimated Planted Trees
            </label>
            <input
              type="number"
              min="100"
              max="50000"
              step="100"
              value={treeCount}
              onChange={(e) => setTreeCount(parseInt(e.target.value) || 0)}
              className="w-full bg-[#F5F8F6] border border-slate-300 rounded-md p-2 text-slate-800 font-mono-data font-bold focus:ring-1 focus:ring-[#0B6B3A]"
            />
            <span className="text-[10px] text-slate-400">Recommended native species (Neem, Peepal, Jamun)</span>
          </div>

          {/* Number Input: Intervention Area */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Intervention Land Area (Hectares)
            </label>
            <input
              type="number"
              min="1"
              max="100"
              step="0.5"
              value={interventionArea}
              onChange={(e) => setInterventionArea(parseFloat(e.target.value) || 0)}
              className="w-full bg-[#F5F8F6] border border-slate-300 rounded-md p-2 text-slate-800 font-mono-data font-bold focus:ring-1 focus:ring-[#0B6B3A]"
            />
            <span className="text-[10px] text-slate-400">Total vacant/public plot allocation</span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Simulation Comparison: CURRENT vs SCENARIO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CURRENT BASELINE COLUMN */}
        <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-mono-data uppercase font-bold text-slate-500">
                Ground Reality Status
              </span>
              <h3 className="text-base font-bold text-slate-900">
                CURRENT BASELINE
              </h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
              Field Monitored
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono-data text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Existing Green Cover</span>
              <span className="text-xl font-bold text-slate-800">
                {results.originalGreenCover}%
              </span>
            </div>
            <div className="bg-red-50 p-3 rounded-lg border border-red-100">
              <span className="text-[11px] text-red-700 block">Land Surface Temp (LST)</span>
              <span className="text-xl font-bold text-red-800">
                {results.originalLST}°C
              </span>
            </div>
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
              <span className="text-[11px] text-amber-800 block">Heat Risk Index</span>
              <span className="text-xl font-bold text-amber-900">
                {results.originalHeatRisk}/100
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Hotspot Status</span>
              <span className="text-base font-bold text-red-600">
                Active Hotspot
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1">
            <div className="flex justify-between">
              <span>Built-up Concrete Coverage:</span>
              <span className="font-mono-data font-semibold">{activeWard.builtUpPercent}%</span>
            </div>
            <div className="flex justify-between">
              <span>Population Exposure:</span>
              <span className="font-mono-data font-semibold">{activeWard.populationExposure}</span>
            </div>
          </div>
        </div>

        {/* SCENARIO / SIMULATION COLUMN */}
        <div className="bg-[#EAF6EE] border-2 border-[#0B6B3A] rounded-xl p-5 shadow-xs space-y-4 relative">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
            <div>
              <span className="text-[10px] font-mono-data uppercase font-bold text-[#0B6B3A]">
                Model Simulation Forecast
              </span>
              <h3 className="text-base font-bold text-[#0B6B3A]">
                PROPOSED SCENARIO
              </h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#0B6B3A] text-white">
              Estimated Scenario
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono-data text-xs">
            <div className="bg-white p-3 rounded-lg border border-emerald-200 shadow-2xs">
              <span className="text-[11px] text-emerald-700 block">Simulated Green Cover</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-[#0B6B3A]">
                  {results.simulatedGreenCover}%
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">
                  (+{proposedGreenDelta}%)
                </span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-emerald-200 shadow-2xs">
              <span className="text-[11px] text-emerald-700 block">Simulated LST Temp</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-emerald-900">
                  {results.simulatedLST}°C
                </span>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center">
                  <TrendingDown className="w-3 h-3 inline" /> -{results.coolingDeltaCelsius}°C
                </span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-emerald-200 shadow-2xs">
              <span className="text-[11px] text-emerald-700 block">Simulated Heat Risk</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-emerald-900">
                  {results.simulatedHeatRisk}/100
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">
                  (-{results.originalHeatRisk - results.simulatedHeatRisk} pts)
                </span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-emerald-200 shadow-2xs">
              <span className="text-[11px] text-emerald-700 block">Hotspot Mitigation</span>
              <span className="text-sm font-bold text-[#0B6B3A]">
                {results.mitigatedHotspots > 0 ? 'Mitigated / De-escalated' : 'Reduced Severity'}
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-700 bg-white/80 p-3 rounded-lg border border-emerald-200 space-y-1">
            <div className="flex justify-between">
              <span>Direct Population Benefited:</span>
              <span className="font-mono-data font-bold text-[#0B6B3A]">
                {(results.populationBenefited / 1000).toFixed(0)}k Residents
              </span>
            </div>
            <div className="flex justify-between">
              <span>Projected Microclimate Cooling:</span>
              <span className="font-mono-data font-bold text-emerald-800">
                Up to -{results.coolingDeltaCelsius}°C surface cooling
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Environmental & Carbon Sequestration Module */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-[#0B6B3A]" />
              <span>Estimated Environmental & Carbon Sequestration Benefit</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Transparent computational calculation based on mature urban indigenous trees.
            </p>
          </div>

          {/* Configurable CO2 factor */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-600 font-medium">CO₂ Factor:</span>
            <input
              type="number"
              min="10"
              max="40"
              step="0.5"
              value={co2Factor}
              onChange={(e) => setCo2Factor(parseFloat(e.target.value) || DEFAULT_CO2_FACTOR_KG_PER_TREE)}
              className="w-16 bg-[#F5F8F6] border border-slate-300 rounded px-2 py-1 font-mono-data text-right font-bold text-slate-800"
            />
            <span className="text-slate-500">kg/tree/yr</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono-data">
          <div className="bg-[#EAF6EE] p-4 rounded-xl border border-emerald-200">
            <div className="text-xs text-emerald-800 font-medium font-sans">
              Annual CO₂ Sequestered
            </div>
            <div className="text-2xl font-bold text-[#0B6B3A] mt-1">
              {results.annualCo2SequesteredTonnes}
              <span className="text-xs font-normal text-slate-600 ml-1">Tonnes / Year</span>
            </div>
            <div className="text-[10px] text-emerald-700 font-sans mt-1">
              ≈ {(results.annualCo2SequesteredTonnes * 1000).toLocaleString()} kg CO₂ captured annually
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <div className="text-xs text-blue-800 font-medium font-sans">
              Intervention Canopy Added
            </div>
            <div className="text-2xl font-bold text-[#0B5CAB] mt-1">
              {interventionArea}
              <span className="text-xs font-normal text-slate-600 ml-1">Hectares</span>
            </div>
            <div className="text-[10px] text-blue-700 font-sans mt-1">
              ≈ {treeCount.toLocaleString()} shade canopy trees
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
            <div className="text-xs text-amber-900 font-medium font-sans">
              Citizen Thermal Relief
            </div>
            <div className="text-2xl font-bold text-amber-800 mt-1">
              {((results.populationBenefited / activeWard.estimatedPopulation) * 100).toFixed(0)}%
              <span className="text-xs font-normal text-slate-600 ml-1">of Ward Population</span>
            </div>
            <div className="text-[10px] text-amber-800 font-sans mt-1">
              {results.populationBenefited.toLocaleString()} residents shielded from peak heat
            </div>
          </div>
        </div>

        {/* Scientific Transparency Disclaimer */}
        <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
          <strong className="text-slate-700">Scientific Methodology Note:</strong> Estimated carbon benefits are computed using the formula: <code className="bg-slate-200 px-1 rounded text-slate-800">Tree Count × Annual Factor ({co2Factor} kg/tree/yr) ÷ 1,000</code>. Actual carbon uptake and microclimate cooling vary with species selection (e.g. Azadirachta indica, Ficus religiosa, Syzygium cumini), sapling survival rate, soil health, irrigation, and local urban canyon geometry. All simulation figures are planning forecasts and do not represent guaranteed statutory outcomes.
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSaveToReport}
            className="py-2.5 px-5 bg-[#0B6B3A] hover:bg-[#14532D] text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center gap-2"
          >
            <FilePlus className="w-4 h-4" />
            <span>Add Simulation to Municipal Report Package</span>
          </button>
        </div>
      </div>
    </div>
  );
};
