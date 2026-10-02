import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Maximize2, 
  RotateCcw, 
  Layers, 
  Flame, 
  Leaf, 
  Building2, 
  Users, 
  Check, 
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { WardZone, CityData, MapLayerVisibility } from '../types';

interface MapComponentProps {
  cities: CityData[];
  selectedCity: CityData | null;
  selectedWard: WardZone | null;
  onSelectWard: (ward: WardZone) => void;
  onSelectCity: (city: CityData) => void;
  onAnalyzeArea: (ward: WardZone) => void;
  onPlanIntervention: (ward: WardZone) => void;
  onAddToReport?: (ward: WardZone) => void;
  mode?: 'heatmap' | 'optimizer';
}

export const MapComponent: React.FC<MapComponentProps> = ({
  cities,
  selectedCity,
  selectedWard,
  onSelectWard,
  onSelectCity,
  onAnalyzeArea,
  onPlanIntervention,
  onAddToReport,
  mode = 'heatmap',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const layerGroupsRef = useRef<{ [key: string]: L.LayerGroup }>({});
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [layersOpen, setLayersOpen] = useState(false);
  
  const [layers, setLayers] = useState<MapLayerVisibility>({
    heatRisk: true,
    lstTemperature: mode === 'heatmap',
    greenCover: mode === 'optimizer',
    builtUpArea: false,
    populationDensity: false,
    waterBodies: false,
    recommendedGreenZones: mode === 'optimizer',
  });

  // Color helper for Heat Risk
  const getHeatColor = (score: number) => {
    if (score >= 85) return '#DC2626'; // Very High Red
    if (score >= 70) return '#EA580C'; // High Orange-Red
    if (score >= 50) return '#F59E0B'; // Moderate Amber
    return '#16A34A';                 // Low Green
  };

  // Color helper for Green Suitability
  const getGreenColor = (score: number) => {
    if (score >= 85) return '#0B6B3A'; // Very High Opportunity (Deep Green)
    if (score >= 70) return '#2E7D32'; // High (Environmental Green)
    if (score >= 50) return '#EAB308'; // Moderate Yellow
    return '#94A3B8';                 // Low Slate
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (leafletMapRef.current) return;

    // Centered on India
    const map = L.map(mapContainerRef.current, {
      center: selectedCity ? [selectedCity.lat, selectedCity.lng] : [20.5937, 78.9629],
      zoom: selectedCity ? selectedCity.zoom : 5,
      zoomControl: false,
      attributionControl: false,
    });

    // Clean government GIS base layer (CartoDB Positron / OSM)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Zoom control at top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Create layer groups
    layerGroupsRef.current = {
      heatRisk: L.layerGroup().addTo(map),
      lstTemperature: L.layerGroup().addTo(map),
      greenCover: L.layerGroup().addTo(map),
      builtUpArea: L.layerGroup().addTo(map),
      populationDensity: L.layerGroup().addTo(map),
      recommendedGreenZones: L.layerGroup().addTo(map),
      cityPins: L.layerGroup().addTo(map),
    };

    leafletMapRef.current = map;

    return () => {
      map.remove();
      leafletMapRef.current = null;
    };
  }, []);

  // Update center when selected city changes
  useEffect(() => {
    if (!leafletMapRef.current) return;
    if (selectedCity) {
      leafletMapRef.current.flyTo([selectedCity.lat, selectedCity.lng], selectedCity.zoom, {
        duration: 1.2,
      });
    } else {
      leafletMapRef.current.flyTo([20.5937, 78.9629], 5, { duration: 1.2 });
    }
  }, [selectedCity]);

  // Update center if a specific ward is selected
  useEffect(() => {
    if (!leafletMapRef.current || !selectedWard) return;
    leafletMapRef.current.flyTo([selectedWard.lat, selectedWard.lng], 14, {
      duration: 1.0,
    });
  }, [selectedWard]);

  // Render Markers and GIS Layers
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    const { 
      heatRisk, 
      lstTemperature, 
      greenCover, 
      builtUpArea, 
      populationDensity, 
      recommendedGreenZones, 
      cityPins 
    } = layerGroupsRef.current;

    // Clear previous layers
    heatRisk?.clearLayers();
    lstTemperature?.clearLayers();
    greenCover?.clearLayers();
    builtUpArea?.clearLayers();
    populationDensity?.clearLayers();
    recommendedGreenZones?.clearLayers();
    cityPins?.clearLayers();

    // Render City Pins for all-India overview
    cities.forEach((city) => {
      const isSelected = selectedCity?.id === city.id;
      const cityIcon = L.divIcon({
        className: 'city-portal-pin',
        html: `
          <div class="cursor-pointer group flex items-center gap-1.5 transform transition-transform hover:scale-110 ${
            isSelected ? 'scale-110' : ''
          }">
            <div class="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] text-white shadow-md border-2 ${
              isSelected ? 'bg-[#0B6B3A] border-amber-300 ring-2 ring-[#0B6B3A]' : 'bg-[#12304A] border-white'
            }">
              ${city.totalHotspots}
            </div>
            <div class="bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded shadow-xs border border-slate-300 text-[11px] font-bold text-slate-800 whitespace-nowrap">
              ${city.name}
            </div>
          </div>
        `,
        iconSize: [100, 30],
        iconAnchor: [12, 15],
      });

      const marker = L.marker([city.lat, city.lng], { icon: cityIcon });
      marker.on('click', () => {
        onSelectCity(city);
      });
      cityPins?.addLayer(marker);
    });

    // Collect wards to display
    const activeWards: WardZone[] = selectedCity
      ? selectedCity.wards
      : cities.flatMap((c) => c.wards);

    activeWards.forEach((ward) => {
      const isWardSelected = selectedWard?.id === ward.id;

      // 1. Heat Risk Layer
      if (layers.heatRisk && heatRisk) {
        const radius = ward.heatRiskScore > 85 ? 1200 : ward.heatRiskScore > 70 ? 950 : 700;
        const circle = L.circle([ward.lat, ward.lng], {
          radius: radius,
          color: getHeatColor(ward.heatRiskScore),
          weight: isWardSelected ? 3 : 1.5,
          fillColor: getHeatColor(ward.heatRiskScore),
          fillOpacity: isWardSelected ? 0.6 : 0.35,
          dashArray: isWardSelected ? '4, 4' : undefined,
        });

        circle.on('click', () => {
          onSelectWard(ward);
        });

        circle.bindTooltip(`
          <div class="text-xs p-1">
            <strong>${ward.name}</strong><br/>
            <span>Heat Risk: <b style="color:${getHeatColor(ward.heatRiskScore)}">${ward.heatRiskScore}/100</b></span><br/>
            <span>LST: <b>${ward.lstCelsius}°C</b></span>
          </div>
        `, { sticky: true });

        heatRisk.addLayer(circle);
      }

      // 2. LST Temperature Layer (labeled badge)
      if (layers.lstTemperature && lstTemperature) {
        const tempIcon = L.divIcon({
          className: 'temp-label-icon',
          html: `
            <div class="px-1.5 py-0.5 rounded bg-white text-[#DC2626] font-mono-data text-[10px] font-bold border border-red-200 shadow-xs whitespace-nowrap">
              ${ward.lstCelsius}°C
            </div>
          `,
          iconSize: [45, 20],
          iconAnchor: [22, 10],
        });
        const marker = L.marker([ward.lat + 0.005, ward.lng], { icon: tempIcon });
        marker.on('click', () => onSelectWard(ward));
        lstTemperature.addLayer(marker);
      }

      // 3. Existing Green Cover Layer
      if (layers.greenCover && greenCover) {
        const greenRadius = Math.max(300, ward.greenCoverPercent * 40);
        const greenCircle = L.circle([ward.lat - 0.003, ward.lng - 0.003], {
          radius: greenRadius,
          color: '#15803D',
          fillColor: '#22C55E',
          fillOpacity: 0.35,
          weight: 1,
        });
        greenCircle.on('click', () => onSelectWard(ward));
        greenCover.addLayer(greenCircle);
      }

      // 4. Built-Up Area Layer
      if (layers.builtUpArea && builtUpArea) {
        const builtCircle = L.circle([ward.lat, ward.lng], {
          radius: 800,
          color: '#64748B',
          fillColor: '#94A3B8',
          fillOpacity: 0.25,
          weight: 1,
        });
        builtCircle.on('click', () => onSelectWard(ward));
        builtUpArea.addLayer(builtCircle);
      }

      // 5. Recommended Green Zones Layer (High Green Suitability)
      if (layers.recommendedGreenZones && recommendedGreenZones && ward.greenSuitabilityScore >= 70) {
        const greenSuitabilityRadius = 650;
        const priorityCircle = L.circle([ward.lat + 0.002, ward.lng + 0.002], {
          radius: greenSuitabilityRadius,
          color: '#0B6B3A',
          fillColor: '#0B6B3A',
          fillOpacity: 0.45,
          weight: 2,
        });
        
        priorityCircle.on('click', () => onSelectWard(ward));
        priorityCircle.bindTooltip(`
          <div class="text-xs p-1">
            <strong>${ward.name}</strong><br/>
            <span>Green Suitability: <b style="color:#0B6B3A">${ward.greenSuitabilityScore}/100</b></span><br/>
            <span>Intervention: <b>${ward.recommendedIntervention.replace('_', ' ')}</b></span>
          </div>
        `, { sticky: true });

        recommendedGreenZones.addLayer(priorityCircle);
      }
    });

  }, [selectedCity, selectedWard, layers, cities, onSelectCity, onSelectWard]);

  const handleResetToIndia = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.flyTo([20.5937, 78.9629], 5, { duration: 1.2 });
    }
  };

  const handleResetToCity = () => {
    if (leafletMapRef.current && selectedCity) {
      leafletMapRef.current.flyTo([selectedCity.lat, selectedCity.lng], selectedCity.zoom, { duration: 1 });
    }
  };

  return (
    <div className={`relative w-full rounded-xl border border-slate-300 overflow-hidden bg-slate-100 shadow-sm transition-all ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-[540px] lg:h-[620px]'
    }`}>
      {/* Map DOM Target */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Top Banner Notice */}
      <div className="absolute top-3 left-3 z-20 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-sm border border-slate-300 rounded-md shadow-xs px-3 py-1.5 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0B6B3A] animate-ping"></span>
          <span className="text-xs font-semibold text-slate-800">
            {selectedCity ? `${selectedCity.name}, ${selectedCity.state}` : 'National Heat GIS Grid — India'}
          </span>
          <span className="text-[10px] text-slate-500 font-mono-data border-l border-slate-200 pl-2">
            Sample GIS Dataset
          </span>
        </div>
      </div>

      {/* Floating Map Action Controls (Top-Left under notice) */}
      <div className="absolute top-14 left-3 z-20 flex flex-col gap-1.5">
        {/* Layer Controls Toggle Button */}
        <div className="relative">
          <button
            onClick={() => setLayersOpen(!layersOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-800 text-xs font-medium rounded-md shadow-xs hover:bg-slate-50 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-[#0B6B3A]" />
            <span>Map Layers</span>
            <span className="text-[10px] bg-slate-100 px-1 rounded text-slate-600">
              {Object.values(layers).filter(Boolean).length}
            </span>
          </button>

          {/* Layer Options Dropdown Card */}
          {layersOpen && (
            <div className="absolute top-9 left-0 w-64 bg-white border border-slate-300 rounded-lg shadow-lg p-3 z-30 space-y-2 text-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                <span className="font-semibold text-slate-800">GIS Layer Controls</span>
                <button 
                  onClick={() => setLayersOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                >
                  ×
                </button>
              </div>

              <label className="flex items-center justify-between cursor-pointer py-1 hover:bg-slate-50 rounded px-1">
                <div className="flex items-center gap-2 text-slate-700">
                  <Flame className="w-3.5 h-3.5 text-red-500" />
                  <span>Heat Risk Score</span>
                </div>
                <input
                  type="checkbox"
                  checked={layers.heatRisk}
                  onChange={(e) => setLayers({ ...layers, heatRisk: e.target.checked })}
                  className="rounded text-[#0B6B3A] focus:ring-[#0B6B3A]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1 hover:bg-slate-50 rounded px-1">
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="font-mono-data text-[10px] text-red-600 font-bold">LST</span>
                  <span>Land Surface Temp</span>
                </div>
                <input
                  type="checkbox"
                  checked={layers.lstTemperature}
                  onChange={(e) => setLayers({ ...layers, lstTemperature: e.target.checked })}
                  className="rounded text-[#0B6B3A] focus:ring-[#0B6B3A]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1 hover:bg-slate-50 rounded px-1">
                <div className="flex items-center gap-2 text-slate-700">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Existing Green Cover</span>
                </div>
                <input
                  type="checkbox"
                  checked={layers.greenCover}
                  onChange={(e) => setLayers({ ...layers, greenCover: e.target.checked })}
                  className="rounded text-[#0B6B3A] focus:ring-[#0B6B3A]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1 hover:bg-slate-50 rounded px-1">
                <div className="flex items-center gap-2 text-slate-700">
                  <Building2 className="w-3.5 h-3.5 text-slate-600" />
                  <span>Built-up Density</span>
                </div>
                <input
                  type="checkbox"
                  checked={layers.builtUpArea}
                  onChange={(e) => setLayers({ ...layers, builtUpArea: e.target.checked })}
                  className="rounded text-[#0B6B3A] focus:ring-[#0B6B3A]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1 hover:bg-slate-50 rounded px-1">
                <div className="flex items-center gap-2 text-slate-700">
                  <Leaf className="w-3.5 h-3.5 text-[#0B6B3A]" />
                  <span className="font-semibold text-[#0B6B3A]">Recommended Green Zones</span>
                </div>
                <input
                  type="checkbox"
                  checked={layers.recommendedGreenZones}
                  onChange={(e) => setLayers({ ...layers, recommendedGreenZones: e.target.checked })}
                  className="rounded text-[#0B6B3A] focus:ring-[#0B6B3A]"
                />
              </label>
            </div>
          )}
        </div>

        {/* Reset / Navigation Shortcuts */}
        <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-md p-0.5 shadow-xs">
          <button
            onClick={handleResetToIndia}
            className="px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 rounded transition-colors flex items-center gap-1"
            title="View entire India map"
          >
            <RotateCcw className="w-3 h-3 text-slate-500" />
            <span>India</span>
          </button>
          {selectedCity && (
            <button
              onClick={handleResetToCity}
              className="px-2 py-1 text-[11px] font-semibold text-[#0B6B3A] hover:bg-emerald-50 rounded transition-colors border-l border-slate-200"
              title={`Zoom to ${selectedCity.name}`}
            >
              {selectedCity.name}
            </button>
          )}
        </div>
      </div>

      {/* Map Control: Fullscreen Toggle (Top-Right under Zoom) */}
      <div className="absolute top-20 right-3 z-20">
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 bg-white border border-slate-300 text-slate-700 rounded-md shadow-xs hover:bg-slate-50"
          title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
          aria-label="Toggle Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Clear Legend (Bottom-Left) */}
      <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-sm border border-slate-300 rounded-lg shadow-sm p-2.5 max-w-xs text-[11px]">
        <div className="font-semibold text-slate-800 mb-1 flex items-center justify-between">
          <span>Map Scale & Legend</span>
          <Info className="w-3 h-3 text-slate-400" />
        </div>
        
        {/* Heat Scale */}
        <div className="mb-2">
          <div className="text-[10px] text-slate-500 font-medium mb-1">Heat Risk Category:</div>
          <div className="grid grid-cols-4 gap-1 text-[9px] font-semibold text-center text-white">
            <div className="bg-[#16A34A] py-0.5 rounded px-1">Low &lt;50</div>
            <div className="bg-[#F59E0B] py-0.5 rounded px-1">Mod 50-69</div>
            <div className="bg-[#EA580C] py-0.5 rounded px-1">High 70-84</div>
            <div className="bg-[#DC2626] py-0.5 rounded px-1">Very High ≥85</div>
          </div>
        </div>

        {/* Green Opportunity Scale */}
        <div>
          <div className="text-[10px] text-slate-500 font-medium mb-1">Green Suitability:</div>
          <div className="flex items-center gap-2 text-[10px] text-slate-700">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0B6B3A] inline-block"></span>
              High Priority Green Zone
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] inline-block"></span>
              Existing Canopy
            </span>
          </div>
        </div>
      </div>

      {/* Selected Ward Inspection Card (Bottom-Right / Side Overlay) */}
      {selectedWard && (
        <div className="absolute bottom-3 right-3 z-20 w-80 max-w-[calc(100vw-24px)] bg-white border border-slate-300 rounded-lg shadow-lg p-3.5 space-y-2.5">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono-data uppercase font-semibold text-slate-500">
                {selectedWard.cityName} · {selectedWard.wardNumber}
              </span>
              <h4 className="text-sm font-bold text-slate-900 leading-tight">
                {selectedWard.name}
              </h4>
              <p className="text-[11px] text-slate-600">
                District: {selectedWard.district}
              </p>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider text-white ${
              selectedWard.priority === 'CRITICAL' ? 'bg-[#DC2626]' :
              selectedWard.priority === 'HIGH' ? 'bg-[#EA580C]' : 'bg-[#F59E0B]'
            }`}>
              {selectedWard.priority}
            </span>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-1.5 py-1.5 border-y border-slate-100 text-center font-mono-data text-xs">
            <div className="bg-red-50 p-1.5 rounded">
              <div className="text-[10px] text-red-700">LST Temp</div>
              <div className="font-bold text-red-900">{selectedWard.lstCelsius}°C</div>
            </div>
            <div className="bg-amber-50 p-1.5 rounded">
              <div className="text-[10px] text-amber-800">Heat Risk</div>
              <div className="font-bold text-amber-900">{selectedWard.heatRiskScore}/100</div>
            </div>
            <div className="bg-emerald-50 p-1.5 rounded">
              <div className="text-[10px] text-emerald-800">Green Cover</div>
              <div className="font-bold text-emerald-900">{selectedWard.greenCoverPercent}%</div>
            </div>
          </div>

          {/* Contributing Factors & Recommendation */}
          <div className="text-[11px] space-y-1 text-slate-700">
            <div>
              <span className="text-slate-500 font-medium">Built-up Surface:</span>{' '}
              <span className="font-mono-data font-semibold">{selectedWard.builtUpPercent}%</span>
              {' · '}
              <span className="text-slate-500 font-medium">Open Space:</span>{' '}
              <span className="font-mono-data font-semibold">{selectedWard.openSpaceHectares} ha</span>
            </div>
            <div className="bg-emerald-50/60 p-2 rounded border border-emerald-100 text-slate-800">
              <div className="text-[10px] font-bold text-[#0B6B3A] uppercase tracking-wider mb-0.5">
                Recommended Green Intervention:
              </div>
              <div className="font-semibold text-xs text-[#0B6B3A]">
                {selectedWard.recommendedIntervention.replace('_', ' ')}
              </div>
              <div className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                {selectedWard.interventionReason}
              </div>
            </div>
          </div>

          {/* Interactive Action Buttons */}
          <div className="flex items-center gap-1.5 pt-1">
            <button
              onClick={() => onAnalyzeArea(selectedWard)}
              className="flex-1 py-1.5 px-2 bg-[#12304A] hover:bg-[#0B5CAB] text-white rounded text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1"
            >
              <span>Analyze Area</span>
              <ChevronRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => onPlanIntervention(selectedWard)}
              className="flex-1 py-1.5 px-2 bg-[#0B6B3A] hover:bg-[#14532D] text-white rounded text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1"
            >
              <Leaf className="w-3 h-3" />
              <span>Plan Green</span>
            </button>
            {onAddToReport && (
              <button
                onClick={() => onAddToReport(selectedWard)}
                className="p-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded text-xs font-medium"
                title="Add this ward to planning report"
              >
                +Report
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
