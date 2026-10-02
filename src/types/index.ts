export type Language = 'en' | 'hi' | 'te';

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

export type InterventionType = 
  | 'TREE_PLANTATION'
  | 'POCKET_PARK'
  | 'GREEN_CORRIDOR'
  | 'GREEN_ROOF'
  | 'SHADED_PARKING'
  | 'PERMEABLE_SURFACE';

export interface WardZone {
  id: string;
  name: string;
  wardNumber: string;
  district: string;
  cityId: string;
  cityName: string;
  state: string;
  lat: number;
  lng: number;
  polygon?: [number, number][];
  
  // Thermal & Land Cover Metrics
  lstCelsius: number;             // Land Surface Temp in °C
  airTempCelsius: number;          // Ambient Temp in °C
  heatRiskScore: number;           // 0 to 100
  greenCoverPercent: number;       // 0 to 100%
  builtUpPercent: number;          // 0 to 100%
  imperviousPercent: number;       // 0 to 100%
  waterBodiesPercent: number;      // 0 to 100%
  
  // Demographic & Urban Exposure
  populationExposure: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  estimatedPopulation: number;
  vulnerablePopPercent: number;    // Elderly & children %
  
  // Green Infrastructure Potential
  openSpaceHectares: number;
  distanceToExistingParkMeters: number;
  greenSuitabilityScore: number;   // 0 to 100
  recommendedIntervention: InterventionType;
  interventionReason: string;
  priority: PriorityLevel;
  estimatedTreeCapacity: number;
  potentialCoolingDelta: number;   // Expected °C reduction with planned greening
}

export interface CityData {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  zoom: number;
  totalAreaSqKm: number;
  totalPopulation: number;
  avgLSTCelsius: number;
  avgHeatRiskScore: number;
  avgGreenCoverPercent: number;
  avgBuiltUpPercent: number;
  totalHotspots: number;
  criticalHotspots: number;
  potentialGreenHectares: number;
  wards: WardZone[];
}

export interface MapLayerVisibility {
  heatRisk: boolean;
  lstTemperature: boolean;
  greenCover: boolean;
  builtUpArea: boolean;
  populationDensity: boolean;
  waterBodies: boolean;
  recommendedGreenZones: boolean;
}

export interface ScoringWeights {
  lstWeight: number;            // default 0.35
  builtUpWeight: number;        // default 0.25
  vegetationDeficitWeight: number; // default 0.20
  imperviousWeight: number;     // default 0.10
  populationWeight: number;     // default 0.10
}

export interface GreenSuitabilityWeights {
  heatRiskWeight: number;       // default 0.35
  vegetationDeficitWeight: number; // default 0.25
  openSpaceWeight: number;      // default 0.20
  populationExposureWeight: number; // default 0.10
  distanceToParkWeight: number; // default 0.10
}

export interface SimulationParameters {
  currentGreenCover: number;
  proposedAdditionalGreenCover: number;
  interventionType: InterventionType;
  treeCount: number;
  interventionAreaHectares: number;
  co2FactorKgPerTree: number; // Configurable annual factor, default 21.8 kg
}

export interface SimulationResults {
  originalLST: number;
  simulatedLST: number;
  originalHeatRisk: number;
  simulatedHeatRisk: number;
  originalGreenCover: number;
  simulatedGreenCover: number;
  annualCo2SequesteredTonnes: number;
  coolingDeltaCelsius: number;
  populationBenefited: number;
  mitigatedHotspots: number;
}

export interface ReportItem {
  ward: WardZone;
  timestamp: string;
  interventionSelected: InterventionType;
  proposedTrees: number;
  notes?: string;
}
