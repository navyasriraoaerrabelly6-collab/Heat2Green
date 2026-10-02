import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    q: 'What is an Urban Heat Island (UHI)?',
    a: 'An Urban Heat Island occurs when urbanized areas experience significantly warmer temperatures than surrounding rural or natural zones. Dense concentrations of concrete, asphalt, vehicular exhaust, and reflective building facades trap solar thermal energy during the day and re-radiate it slowly at night, creating severe microclimate heat pockets.'
  },
  {
    q: 'What is the difference between Air Temperature and Land Surface Temperature (LST)?',
    a: 'Air temperature measures ambient atmospheric thermal levels typically recorded by standard weather stations 2 meters above ground. Land Surface Temperature (LST) measures how hot the actual surface of the earth feels to the touch (e.g. concrete roads, metal roofs, or tree canopies) measured via satellite thermal infrared sensors. During summer afternoons in India, asphalt LST can reach 46°C while ambient air temperature is 39°C.'
  },
  {
    q: 'How are heat hotspots detected on the Heat2Green platform?',
    a: 'Hotspots are detected using automated spatial thresholding across municipal wards. Wards exhibiting surface thermal anomalies in the 90th percentile (typically ≥40°C), combined with built-up impervious surface exceeding 75% and tree canopy under 10%, are automatically flagged and classified as Critical or High-Risk hotspots.'
  },
  {
    q: 'How are priority green zones identified by the Smart Green Optimizer?',
    a: 'The Smart Green Optimizer applies a Multi-Criteria Evaluation (MCE) matrix. It factors in Heat Risk (35%), Vegetation Deficit (25%), Open Public Space Availability (20%), Demographic Population Exposure (10%), and Walking Distance to Existing Public Parks (10%). Locations with high heat stress, low existing shade, and viable public land score highest for immediate intervention.'
  },
  {
    q: 'How is the annual CO₂ sequestration benefit calculated?',
    a: 'Carbon sequestration is computed through a standardized urban forestry model: Number of Planted Trees × Configurable Annual CO₂ Factor (default: 21.8 kg CO₂/tree/year for mature Indian native broad-leaved species such as Neem, Peepal, Jamun, and Banyan). Results are transparently expressed in metric tonnes of CO₂ captured annually upon canopy maturity.'
  },
  {
    q: 'Where does the data on the platform originate?',
    a: 'The platform integrates multi-spectral satellite thermal infrared imagery (calibrated from Landsat-8/9 TIRS and Sentinel-3), optical vegetation indices (NDVI), and municipal ward spatial boundaries from municipal open datasets and GIS portals. The current live demo version runs on a curated high-fidelity sample GIS dataset calibrated to Indian metropolitan baseline figures.'
  },
  {
    q: 'Can citizens and researchers use Heat2Green?',
    a: 'Yes! Heat2Green is an open public-benefit portal. Citizens can inspect their local wards, report neighborhood heat anomalies, assess green cover deficits, and submit feedback for municipal tree planting drives.'
  },
  {
    q: 'Can municipal corporations and state government agencies use this platform?',
    a: 'Yes. The platform is designed specifically for Municipal Commissioners, Town Planning Departments, and Urban Development Authorities to prioritize CSR and municipal greening funds, design Miyawaki urban micro-forests, generate executive reports, and formulate Urban Heat Action Plans (UHAP).'
  },
  {
    q: 'How accurate are the before-and-after scenario simulations?',
    a: 'Scenario simulations are computational planning models based on peer-reviewed microclimate cooling coefficients (e.g. 0.08°C–0.12°C surface temperature attenuation per 1% added canopy density). While they provide reliable relative indicators for comparing greening scenarios, actual ground temperatures will depend on sapling survival rates, irrigation, and wind corridors.'
  },
  {
    q: 'What types of green interventions does Heat2Green recommend?',
    a: 'Heat2Green recommends 6 targeted interventions tailored to site morphology: Native Tree Plantation (for wide avenues/buffers), Miyawaki Pocket Forests (for dense residential clusters), Linear Green Corridors (along transit boulevards), Cool/Green Roofs (for flat commercial terraces), Shaded Solar Parking (for asphalt transit hubs), and Permeable Vegetated Pavements (for pedestrian plazas).'
  }
];

export const FaqView: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-[#EAF6EE] text-[#0B6B3A]">
            <HelpCircle className="w-4 h-4" />
          </span>
          <h2 className="text-xl font-bold text-slate-900 font-serif">
            Frequently Asked Questions (FAQ)
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          Clarifications on urban heat science, GIS data sources, scoring formulas, and municipal planning workflows.
        </p>
      </div>

      {/* Accordion list */}
      <div className="space-y-3">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs transition-colors"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors focus:outline-none"
              >
                <span className="text-sm font-semibold text-slate-900">
                  {item.q}
                </span>
                <span className="text-slate-400 p-1">
                  {isOpen ? <ChevronUp className="w-4 h-4 text-[#0B6B3A]" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-[#F5F8F6]/50">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
