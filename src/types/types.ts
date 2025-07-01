
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

export interface SimulationParameters {
    id: string;
    name: string;
    final_population_number: number;
    duration: number;
    future_duration: number;
    future_trv_z: number;
    env_weight: number;
    w2s_mult: number;
    seed: number;
}

export interface SimulationResults {
    id: string;
    name: string;
    status: string;
    createdAt: Date;
    parameters: SimulationParameters;
}

export interface SimulationAgentRow {
    CP: string;
    HABITAT: string;
    Revenu: number;
    age: number;
    change_prob: number;
    green_sensitivity: number;
    id: number;
    num_times_switched: number;
    plan: string;
    price_sensitivity: number;
    satisfaction_threshold: number;
    supplier: string;
}

export type SimulationPlanRow = {
    time: number;
    [key: string]: number; // All other columns are numbers
};
