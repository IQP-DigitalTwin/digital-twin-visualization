// Types for categorical data
export type Supplier = string;
export type Plan = string;
export type Habitat = string;

// Single row of CSV data
export interface SimulationDataRow {
  time: number;
  id: string;
  green_sensitivity: number;
  reputation_sensitivity: number;
  price_sensitivity: number;
  supplier: Supplier;
  plan: Plan;
  satisfaction_threshold: number;
  age: number;
  HABITAT: Habitat;
  CP: number;  
  Revenu: number;
}

// Parsed data structure for aggregated chart data
export interface ParsedSimulationData {
  timeData: number[];
  greenSensitivity: number[];
  reputationSensitivity: number[];
  priceSensitivity: number[];
  supplierDistribution: Map<Supplier, number>;
  planDistribution: Map<Plan, number>;
  ageDistribution: number[];
  habitatDistribution: Map<Habitat, number>;
  consumptionPatterns: number[];
  revenueDistribution: number[];
}

