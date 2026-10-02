/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Flame, 
  Leaf, 
  MapPin, 
  ArrowRight, 
  Layers, 
  Sliders, 
  BarChart3, 
  FileText, 
  CheckCircle2, 
  Trees, 
  ShieldCheck, 
  Compass,
  AlertTriangle,
  Globe2,
  TreePine,
  ThermometerSun
} from 'lucide-react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MapComponent } from './components/MapComponent';
import { StatCard } from './components/StatCard';
import { HeatHotspotPanel } from './components/HeatHotspotPanel';
import { GreenOptimizerPanel } from './components/GreenOptimizerPanel';
import { ScenarioSimulator } from './components/ScenarioSimulator';
import { CityComparison } from './components/CityComparison';
import { AnalyticsView } from './components/AnalyticsView';
import { ReportGenerator } from './components/ReportGenerator';
import { AboutView } from './components/AboutView';
import { FaqView } from './components/FaqView';
import { ContactView } from './components/ContactView';
import { FeedbackView } from './components/FeedbackView';
import { SearchModal } from './components/SearchModal';
import { PlannerLoginModal } from './components/PlannerLoginModal';

import { INDIAN_CITIES_DATA } from './data/indianCitiesData';
import { CityData, WardZone, Language, ReportItem } from './types';
import { TRANSLATIONS } from './data/translations';

// High-fidelity generated imagery
import heroSkylineImg from './assets/images/indian_urban_heat_skyline_1790958928089.jpg';
import greenAerialImg from './assets/images/urban_green_intervention_aerial_1790958942792.jpg';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [language, setLanguage] = useState<Language>('en');
  const [highContrast, setHighContrast] = useState<boolean>(false);

  // Active City & Ward Selection
  const [selectedCity, setSelectedCity] = useState<CityData | null>(INDIAN_CITIES_DATA[0]); // Default Hyderabad
  const [selectedWard, setSelectedWard] = useState<WardZone | null>(INDIAN_CITIES_DATA[0].wards[0]);

  // Modals & User state
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loggedInRole, setLoggedInRole] = useState<string | null>(null);

  // Municipal Report Queue
  const [reportQueue, setReportQueue] = useState<ReportItem[]>([]);

  const t = TRANSLATIONS[language];

  // Aggregate Stats across cities
  const totalArea = INDIAN_CITIES_DATA.reduce((acc, c) => acc + c.totalAreaSqKm, 0);
  const totalHotspots = INDIAN_CITIES_DATA.reduce((acc, c) => acc + c.totalHotspots, 0);
  const totalCritical = INDIAN_CITIES_DATA.reduce((acc, c) => acc + c.criticalHotspots, 0);
  const avgGreen = (INDIAN_CITIES_DATA.reduce((acc, c) => acc + c.avgGreenCoverPercent, 0) / INDIAN_CITIES_DATA.length).toFixed(1);
  const totalPotentialHa = INDIAN_CITIES_DATA.reduce((acc, c) => acc + c.potentialGreenHectares, 0);
  const totalCO2Tonnes = Math.round(totalPotentialHa * 6.5); // Derived annual CO2 capacity

  const handleToggleContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    if (next) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  };

  const handleLogin = (role: string) => {
    setIsLoggedIn(true);
    setLoggedInRole(role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoggedInRole(null);
  };

  const handleAddToReport = (ward: WardZone, simDetails?: any) => {
    const item: ReportItem = {
      ward,
      timestamp: new Date().toISOString(),
      interventionSelected: ward.recommendedIntervention,
      proposedTrees: ward.estimatedTreeCapacity,
      notes: simDetails ? `Simulated cooling: -${simDetails.results.coolingDeltaCelsius}°C` : undefined,
    };
    setReportQueue(prev => [item, ...prev]);
  };

  const handleSelectWardAndNavigate = (ward: WardZone, targetTab: string) => {
    setSelectedWard(ward);
    const parentCity = INDIAN_CITIES_DATA.find(c => c.id === ward.cityId);
    if (parentCity) setSelectedCity(parentCity);
    setCurrentTab(targetTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8F6] text-[#12304A]">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        language={language}
        onLanguageChange={setLanguage}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        isLoggedIn={isLoggedIn}
        loggedInRole={loggedInRole}
        highContrast={highContrast}
        onToggleHighContrast={handleToggleContrast}
      />

      {/* Main Content Viewport */}
      <main className="flex-1">
        {/* ======================================================== */}
        {/* 1. HOME VIEW */}
        {/* ======================================================== */}
        {currentTab === 'home' && (
          <div className="space-y-12">
            {/* Hero Section with realistic Indian urban skyline backdrop */}
            <section className="relative overflow-hidden bg-[#12304A] text-white">
              {/* Background Image with Dark Gradient Scrim */}
              <div className="absolute inset-0 z-0">
                <img
                  src={heroSkylineImg}
                  alt="Indian Urban Skyline with Heat Atmosphere"
                  className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#12304A]/95 via-[#12304A]/85 to-[#12304A]/70" />
              </div>

              {/* Hero Content */}
              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
                <div className="max-w-3xl space-y-6">
                  {/* Trust / Domain Badges */}
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                    <span className="bg-[#0B6B3A] text-white px-2.5 py-1 rounded shadow-xs border border-emerald-400/30">
                      National GIS Portal
                    </span>
                    <span className="bg-white/10 backdrop-blur-xs text-slate-200 px-2.5 py-1 rounded border border-white/15">
                      Urban Heat Analytics
                    </span>
                    <span className="bg-white/10 backdrop-blur-xs text-slate-200 px-2.5 py-1 rounded border border-white/15">
                      Smart Green Infrastructure Planning
                    </span>
                    <span className="bg-white/10 backdrop-blur-xs text-amber-300 px-2.5 py-1 rounded border border-amber-300/20">
                      India Focused (8 Metropolitan Centers)
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-bold tracking-tight font-serif text-white leading-tight">
                    {t.tagline}
                  </h1>

                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl font-normal">
                    {t.supportingText}
                  </p>

                  {/* Primary CTA Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        setCurrentTab('heatmap');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-5 py-3 bg-[#0B6B3A] hover:bg-[#14532D] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-md transition-all flex items-center gap-2 group cursor-pointer"
                    >
                      <Flame className="w-4 h-4 text-amber-300" />
                      <span>{t.exploreHeatMap}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                      onClick={() => {
                        setCurrentTab('optimizer');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/30 text-xs sm:text-sm font-semibold rounded-lg backdrop-blur-xs transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Leaf className="w-4 h-4 text-emerald-400" />
                      <span>{t.findPriority}</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* City Selector Quick Strip */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 relative z-20">
              <div className="bg-white border border-slate-300 rounded-xl p-3 shadow-md flex items-center justify-between gap-3 overflow-x-auto text-xs">
                <div className="flex items-center gap-2 text-slate-700 font-bold shrink-0">
                  <MapPin className="w-4 h-4 text-[#0B6B3A]" />
                  <span>Select City Grid:</span>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {INDIAN_CITIES_DATA.map(city => {
                    const active = selectedCity?.id === city.id;
                    return (
                      <button
                        key={city.id}
                        onClick={() => setSelectedCity(city)}
                        className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                          active
                            ? 'bg-[#0B6B3A] text-white shadow-xs font-semibold'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {city.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Home Page Live Statistics Dashboard Cards */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    National Urban Thermal & Green Cover Indicators
                  </h2>
                  <p className="text-xs text-slate-500">
                    Live aggregate indicators across monitored Indian metropolitan centers. Click any card to view detailed GIS breakdown.
                  </p>
                </div>
                <span className="hidden sm:inline-block text-[11px] font-mono-data text-slate-500">
                  Updated: Q2 2026 Baseline
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                  title={t.totalStudyArea}
                  value={totalArea.toLocaleString()}
                  unit="Sq. Km"
                  explanation="Total municipal and peripheral study area across 8 cities"
                  icon={Globe2}
                  badgeText="Monitored"
                  badgeType="info"
                  onClick={() => setCurrentTab('analytics')}
                />
                <StatCard
                  title={t.heatHotspots}
                  value={totalHotspots}
                  unit="Wards"
                  explanation="Urban sectors with Land Surface Temp exceeding 40°C"
                  icon={Flame}
                  badgeText="Thermal Anomalies"
                  badgeType="danger"
                  onClick={() => setCurrentTab('heatmap')}
                />
                <StatCard
                  title={t.highPriorityZones}
                  value={totalCritical}
                  unit="Wards"
                  explanation="Critical heat stress combined with severe tree canopy deficit"
                  icon={AlertTriangle}
                  badgeText="Critical Priority"
                  badgeType="warning"
                  onClick={() => setCurrentTab('optimizer')}
                />
                <StatCard
                  title={t.existingGreenCover}
                  value={avgGreen}
                  unit="%"
                  explanation="Current tree canopy coverage (Target: ≥25% canopy density)"
                  icon={Leaf}
                  badgeText="Canopy Deficit"
                  badgeType="neutral"
                  onClick={() => setCurrentTab('analytics')}
                />
                <StatCard
                  title={t.potentialGreenArea}
                  value={totalPotentialHa.toLocaleString()}
                  unit="Hectares"
                  explanation="Vacant municipal plots, transit buffers, and institutional open spaces"
                  icon={TreePine}
                  badgeText="High Feasibility"
                  badgeType="success"
                  onClick={() => setCurrentTab('optimizer')}
                />
                <StatCard
                  title={t.estimatedCo2Benefit}
                  value={totalCO2Tonnes.toLocaleString()}
                  unit="Tonnes / Yr"
                  explanation="Potential annual carbon sequestration upon full tree canopy maturity"
                  icon={ShieldCheck}
                  badgeText="Carbon Benefit"
                  badgeType="success"
                  onClick={() => setCurrentTab('planner')}
                />
              </div>
            </section>

            {/* Interactive GIS Map Section on Home */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Interactive Geospatial Thermal Grid
                  </h3>
                  <p className="text-xs text-slate-500">
                    Explore satellite land surface temperatures and municipal hotspots in real time.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentTab('heatmap')}
                    className="px-3 py-1.5 bg-[#12304A] hover:bg-[#0B5CAB] text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <span>Full Heat Map View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Map Component */}
              <MapComponent
                cities={INDIAN_CITIES_DATA}
                selectedCity={selectedCity}
                selectedWard={selectedWard}
                onSelectWard={(ward) => setSelectedWard(ward)}
                onSelectCity={(city) => setSelectedCity(city)}
                onAnalyzeArea={(ward) => handleSelectWardAndNavigate(ward, 'heatmap')}
                onPlanIntervention={(ward) => handleSelectWardAndNavigate(ward, 'planner')}
                onAddToReport={handleAddToReport}
                mode="heatmap"
              />
            </section>

            {/* Feature Spotlight: Smart Green Planning with Satellite Aerial Asset */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="bg-white border border-slate-300 rounded-2xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-2">
                <div className="p-8 sm:p-10 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-[#0B6B3A] uppercase tracking-wider">
                      Core Technology
                    </span>
                    <h3 className="text-2xl font-bold font-serif text-slate-900 tracking-tight">
                      Smart Green Infrastructure Decision Support
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Heat2Green transforms satellite thermal anomalies into actionable municipal planting plans. By overlaying demographic exposure, road networks, open parcel GIS data, and vegetation indices, urban authorities can simulate cooling impacts before planting a single sapling.
                    </p>
                  </div>

                  <div className="space-y-2 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0B6B3A]" />
                      <span>Prioritize tree plantations in severe heatwave hotspots</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0B6B3A]" />
                      <span>Transparent, configurable multi-criteria suitability scoring</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0B6B3A]" />
                      <span>Before-and-after microclimate simulation with CO₂ estimates</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setCurrentTab('optimizer')}
                      className="px-5 py-2.5 bg-[#0B6B3A] hover:bg-[#14532D] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2"
                    >
                      <Leaf className="w-4 h-4" />
                      <span>Launch Green Optimizer</span>
                    </button>
                  </div>
                </div>

                <div className="relative min-h-[300px] lg:min-h-full bg-slate-900">
                  <img
                    src={greenAerialImg}
                    alt="Aerial view of urban greening and tree canopy cooling concrete city"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                    <div className="text-white text-xs space-y-1">
                      <div className="font-semibold text-emerald-300">
                        Smart City Green Canopy Deployment
                      </div>
                      <div className="text-slate-300 text-[11px]">
                        Targeted Miyawaki micro-forests and shaded transit corridors lower surface heat by up to 3.2°C.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. HEAT MAP VIEW */}
        {/* ======================================================== */}
        {currentTab === 'heatmap' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
                  Urban Heat Hotspot GIS Map
                </h1>
                <p className="text-xs text-slate-500">
                  Identify daytime Land Surface Temperature anomalies, built-up density, and population vulnerability.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-mono-data">
                  Active City: <strong>{selectedCity?.name}</strong>
                </span>
              </div>
            </div>

            {/* Map Viewport */}
            <MapComponent
              cities={INDIAN_CITIES_DATA}
              selectedCity={selectedCity}
              selectedWard={selectedWard}
              onSelectWard={(ward) => setSelectedWard(ward)}
              onSelectCity={(city) => setSelectedCity(city)}
              onAnalyzeArea={(ward) => setSelectedWard(ward)}
              onPlanIntervention={(ward) => handleSelectWardAndNavigate(ward, 'planner')}
              onAddToReport={handleAddToReport}
              mode="heatmap"
            />

            {/* Heat Hotspot Analytics & Ranked Wards */}
            <HeatHotspotPanel
              cities={INDIAN_CITIES_DATA}
              selectedCity={selectedCity}
              selectedWard={selectedWard}
              onSelectCity={(city) => setSelectedCity(city)}
              onSelectWard={(ward) => setSelectedWard(ward)}
              onPlanIntervention={(ward) => handleSelectWardAndNavigate(ward, 'planner')}
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. GREEN OPTIMIZER VIEW */}
        {/* ======================================================== */}
        {currentTab === 'optimizer' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            {/* Map showing Green Suitability Overlay */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Spatial Green Opportunity Map
              </h3>
              <MapComponent
                cities={INDIAN_CITIES_DATA}
                selectedCity={selectedCity}
                selectedWard={selectedWard}
                onSelectWard={(ward) => setSelectedWard(ward)}
                onSelectCity={(city) => setSelectedCity(city)}
                onAnalyzeArea={(ward) => setSelectedWard(ward)}
                onPlanIntervention={(ward) => handleSelectWardAndNavigate(ward, 'planner')}
                onAddToReport={handleAddToReport}
                mode="optimizer"
              />
            </div>

            {/* Green Optimizer Panel */}
            <GreenOptimizerPanel
              cities={INDIAN_CITIES_DATA}
              selectedCity={selectedCity}
              selectedWard={selectedWard}
              onSelectWard={(ward) => setSelectedWard(ward)}
              onPlanIntervention={(ward) => handleSelectWardAndNavigate(ward, 'planner')}
              onAddToReport={handleAddToReport}
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* 4. INTERVENTION PLANNER & SCENARIO SIMULATOR */}
        {/* ======================================================== */}
        {currentTab === 'planner' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <ScenarioSimulator
              cities={INDIAN_CITIES_DATA}
              selectedCity={selectedCity}
              selectedWard={selectedWard}
              onSelectWard={(ward) => setSelectedWard(ward)}
              onAddToReport={handleAddToReport}
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* 5. ANALYTICS VIEW */}
        {/* ======================================================== */}
        {currentTab === 'analytics' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <AnalyticsView
              cities={INDIAN_CITIES_DATA}
              onSelectWard={(ward) => handleSelectWardAndNavigate(ward, 'heatmap')}
              onNavigateToMap={() => setCurrentTab('heatmap')}
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* 6. COMPARE CITIES */}
        {/* ======================================================== */}
        {currentTab === 'compare' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <CityComparison
              cities={INDIAN_CITIES_DATA}
              onSelectCity={(city) => setSelectedCity(city)}
              onNavigateToMap={() => setCurrentTab('heatmap')}
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* 7. REPORTS VIEW */}
        {/* ======================================================== */}
        {currentTab === 'reports' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <ReportGenerator
              cities={INDIAN_CITIES_DATA}
              selectedCity={selectedCity}
              reportQueue={reportQueue}
              onSelectCity={(city) => setSelectedCity(city)}
              onClearQueue={() => setReportQueue([])}
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* 8. ABOUT VIEW */}
        {/* ======================================================== */}
        {currentTab === 'about' && (
          <div className="px-4 sm:px-6 py-8">
            <AboutView />
          </div>
        )}

        {/* ======================================================== */}
        {/* 9. FAQ VIEW */}
        {/* ======================================================== */}
        {currentTab === 'faq' && (
          <div className="px-4 sm:px-6 py-8">
            <FaqView />
          </div>
        )}

        {/* ======================================================== */}
        {/* 10. CONTACT VIEW */}
        {/* ======================================================== */}
        {currentTab === 'contact' && (
          <div className="px-4 sm:px-6 py-8">
            <ContactView />
          </div>
        )}

        {/* ======================================================== */}
        {/* 11. FEEDBACK VIEW */}
        {/* ======================================================== */}
        {currentTab === 'feedback' && (
          <div className="px-4 sm:px-6 py-8">
            <FeedbackView />
          </div>
        )}
      </main>

      {/* Global Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        cities={INDIAN_CITIES_DATA}
        onSelectCity={(city) => {
          setSelectedCity(city);
          setCurrentTab('heatmap');
        }}
        onSelectWard={(ward) => handleSelectWardAndNavigate(ward, 'heatmap')}
      />

      <PlannerLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        isLoggedIn={isLoggedIn}
        loggedInRole={loggedInRole}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Official Government Portal Footer */}
      <Footer
        onNavigate={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
