import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin, Flame, Leaf, ChevronRight } from 'lucide-react';
import { CityData, WardZone } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  cities: CityData[];
  onSelectCity: (city: CityData) => void;
  onSelectWard: (ward: WardZone) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  cities,
  onSelectCity,
  onSelectWard,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  // Search in cities
  const matchingCities = normalizedQuery
    ? cities.filter(c => 
        c.name.toLowerCase().includes(normalizedQuery) || 
        c.state.toLowerCase().includes(normalizedQuery)
      )
    : [];

  // Search in wards
  const allWards = cities.flatMap(c => c.wards);
  const matchingWards = normalizedQuery
    ? allWards.filter(w => 
        w.name.toLowerCase().includes(normalizedQuery) ||
        w.wardNumber.toLowerCase().includes(normalizedQuery) ||
        w.district.toLowerCase().includes(normalizedQuery) ||
        w.cityName.toLowerCase().includes(normalizedQuery)
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by City, Ward, District (e.g. Kukatpally, Delhi, Anand Vihar)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded font-medium ml-1"
          >
            Esc
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 text-xs divide-y divide-slate-100">
          {!normalizedQuery && (
            <div className="p-4 text-center text-slate-400">
              Type a location name or ward to jump directly to GIS thermal coordinates.
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
                <span className="text-slate-500">Popular:</span>
                {['Hyderabad', 'Delhi', 'Kukatpally', 'Dharavi', 'Connaught Place', 'Peenya'].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => setQuery(chip)}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {normalizedQuery && matchingCities.length === 0 && matchingWards.length === 0 && (
            <div className="p-6 text-center text-slate-500">
              No thermal GIS monitoring records found for "{query}". Try checking the spelling or search another city.
            </div>
          )}

          {/* Cities Section */}
          {matchingCities.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-1 font-semibold text-[10px] uppercase text-slate-400 tracking-wider">
                Matching Cities ({matchingCities.length})
              </div>
              {matchingCities.map(city => (
                <button
                  key={city.id}
                  onClick={() => {
                    onSelectCity(city);
                    onClose();
                  }}
                  className="w-full px-3 py-2 text-left rounded-md hover:bg-slate-50 flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-[#0B6B3A]" />
                    <div>
                      <span className="font-semibold text-slate-900 group-hover:text-[#0B6B3A]">
                        {city.name}
                      </span>
                      <span className="text-slate-500 text-[11px] ml-1.5">
                        {city.state} · {city.totalHotspots} hotspots
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ))}
            </div>
          )}

          {/* Wards Section */}
          {matchingWards.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-1 font-semibold text-[10px] uppercase text-slate-400 tracking-wider">
                Matching Wards & Hotspot Sectors ({matchingWards.length})
              </div>
              {matchingWards.map(ward => (
                <button
                  key={ward.id}
                  onClick={() => {
                    const parentCity = cities.find(c => c.id === ward.cityId);
                    if (parentCity) onSelectCity(parentCity);
                    onSelectWard(ward);
                    onClose();
                  }}
                  className="w-full px-3 py-2 text-left rounded-md hover:bg-[#EAF6EE]/50 flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-start gap-2.5">
                    <Flame className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900 group-hover:text-[#0B6B3A]">
                        {ward.name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono-data">
                        {ward.cityName} ({ward.district}) · LST: <b className="text-red-600">{ward.lstCelsius}°C</b> · Risk: {ward.heatRiskScore}/100
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white ${
                    ward.priority === 'CRITICAL' ? 'bg-red-600' : 'bg-orange-500'
                  }`}>
                    {ward.priority}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
