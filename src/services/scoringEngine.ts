import { 
  WardZone, 
  ScoringWeights, 
  GreenSuitabilityWeights, 
  SimulationParameters, 
  SimulationResults,
  InterventionType
} from '../types';

export const DEFAULT_HEAT_WEIGHTS: ScoringWeights = {
  lstWeight: 0.35,
  builtUpWeight: 0.25,
  vegetationDeficitWeight: 0.20,
  imperviousWeight: 0.10,
  populationWeight: 0.10,
};

export const DEFAULT_GREEN_WEIGHTS: GreenSuitabilityWeights = {
  heatRiskWeight: 0.35,
  vegetationDeficitWeight: 0.25,
  openSpaceWeight: 0.20,
  populationExposureWeight: 0.10,
  distanceToParkWeight: 0.10,
};

// Default annual carbon sequestration factor per mature indigenous tree
// (Source: Indian Council of Forestry Research and Education / urban forestry benchmark)
export const DEFAULT_CO2_FACTOR_KG_PER_TREE = 21.8;

/**
 * Calculates Heat Risk Score (0-100) using configurable multi-criteria weighting.
 */
export function calculateHeatRisk(
  ward: WardZone,
  weights: ScoringWeights = DEFAULT_HEAT_WEIGHTS
): number {
  // Normalize LST: 30°C -> 0, 48°C -> 100
  const normalizedLST = Math.min(100, Math.max(0, ((ward.lstCelsius - 30) / (48 - 30)) * 100));
  
  // Built-up density
  const normalizedBuiltUp = ward.builtUpPercent;
  
  // Vegetation deficit (100 - green cover %)
  const normalizedVegDeficit = Math.max(0, 100 - ward.greenCoverPercent);
  
  // Impervious surface %
  const normalizedImpervious = ward.imperviousPercent;
  
  // Population exposure score
  const popScores = { CRITICAL: 95, HIGH: 75, MODERATE: 50, LOW: 25 };
  const normalizedPop = popScores[ward.populationExposure] || 50;

  const total = 
    (normalizedLST * weights.lstWeight) +
    (normalizedBuiltUp * weights.builtUpWeight) +
    (normalizedVegDeficit * weights.vegetationDeficitWeight) +
    (normalizedImpervious * weights.imperviousWeight) +
    (normalizedPop * weights.populationWeight);

  return Math.round(Math.min(100, Math.max(0, total)));
}

/**
 * Calculates Green Suitability / Priority Score (0-100).
 */
export function calculateGreenSuitability(
  ward: WardZone,
  weights: GreenSuitabilityWeights = DEFAULT_GREEN_WEIGHTS
): number {
  const heatScore = ward.heatRiskScore;
  const vegDeficit = Math.max(0, 100 - ward.greenCoverPercent);
  
  // Normalize open space (capped at 50 ha)
  const normalizedOpenSpace = Math.min(100, (ward.openSpaceHectares / 50) * 100);
  
  const popScores = { CRITICAL: 95, HIGH: 75, MODERATE: 50, LOW: 25 };
  const normalizedPop = popScores[ward.populationExposure] || 50;

  // Distance to nearest park (further away = higher priority for new greening)
  // 3000m -> 100 score, 300m -> 10 score
  const normalizedDistance = Math.min(100, Math.max(10, (ward.distanceToExistingParkMeters / 3000) * 100));

  const total = 
    (heatScore * weights.heatRiskWeight) +
    (vegDeficit * weights.vegetationDeficitWeight) +
    (normalizedOpenSpace * weights.openSpaceWeight) +
    (normalizedPop * weights.populationExposureWeight) +
    (normalizedDistance * weights.distanceToParkWeight);

  return Math.round(Math.min(100, Math.max(0, total)));
}

/**
 * Simulates microclimate scenario cooling and CO2 benefits.
 */
export function runScenarioSimulation(
  ward: WardZone,
  params: SimulationParameters
): SimulationResults {
  const { proposedAdditionalGreenCover, treeCount, interventionType, co2FactorKgPerTree } = params;

  // Intervention cooling multipliers
  const coolingFactors: Record<InterventionType, number> = {
    TREE_PLANTATION: 0.12,   // ~0.12°C cooling per 1% additional green cover
    POCKET_PARK: 0.10,
    GREEN_CORRIDOR: 0.11,
    GREEN_ROOF: 0.08,
    SHADED_PARKING: 0.07,
    PERMEABLE_SURFACE: 0.06,
  };

  const factor = coolingFactors[interventionType] || 0.10;
  const potentialCooling = Math.min(4.5, (proposedAdditionalGreenCover * factor) + (treeCount * 0.00015));
  
  const simulatedLST = Math.max(28, Number((ward.lstCelsius - potentialCooling).toFixed(1)));
  const simulatedGreenCover = Math.min(60, Number((ward.greenCoverPercent + proposedAdditionalGreenCover).toFixed(1)));
  
  // Heat risk reduction proportional to cooling & greening
  const riskReduction = Math.round((potentialCooling / ward.lstCelsius) * 120 + (proposedAdditionalGreenCover * 0.6));
  const simulatedHeatRisk = Math.max(15, ward.heatRiskScore - riskReduction);

  // Carbon sequestered annually in metric tonnes (1 tonne = 1000 kg)
  const effectiveCo2Factor = co2FactorKgPerTree > 0 ? co2FactorKgPerTree : DEFAULT_CO2_FACTOR_KG_PER_TREE;
  const annualCo2SequesteredTonnes = Number(((treeCount * effectiveCo2Factor) / 1000).toFixed(2));

  // Benefited population (portion of ward exposed to cooler microclimate)
  const populationBenefited = Math.round(ward.estimatedPopulation * Math.min(0.95, (proposedAdditionalGreenCover / 30) + 0.25));

  // Mitigated hotspots (1 if critical/high risk dropped below 70)
  const mitigatedHotspots = simulatedHeatRisk < 70 && ward.heatRiskScore >= 70 ? 1 : 0;

  return {
    originalLST: ward.lstCelsius,
    simulatedLST,
    originalHeatRisk: ward.heatRiskScore,
    simulatedHeatRisk,
    originalGreenCover: ward.greenCoverPercent,
    simulatedGreenCover,
    annualCo2SequesteredTonnes,
    coolingDeltaCelsius: Number(potentialCooling.toFixed(1)),
    populationBenefited,
    mitigatedHotspots,
  };
}

export function formatInterventionName(type: InterventionType): string {
  switch (type) {
    case 'TREE_PLANTATION':
      return 'Tree Plantation & Urban Forest';
    case 'POCKET_PARK':
      return 'Miyawaki Pocket Green Space';
    case 'GREEN_CORRIDOR':
      return 'Linear Green Corridor';
    case 'GREEN_ROOF':
      return 'Cool / Vegetated Green Roof';
    case 'SHADED_PARKING':
      return 'Canopy Shaded / Solar Green Parking';
    case 'PERMEABLE_SURFACE':
      return 'Permeable Vegetated Pavement';
  }
}
