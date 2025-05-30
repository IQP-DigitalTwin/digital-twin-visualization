import { z } from "zod";
import moment from "moment";
import { weatherRepository } from "../Weather/WeatherRepository";

const ref = weatherRepository.getRef();

export enum SimulationStatues {
  Initialized,
  Created,
  InProgress,
  Error,
  Done,
  Failed,
}

export const simulationSchema = z.object({
  id: z.string().uuid().default(""),
  name: z.string().default(""),
  initial_population: z
    .object({
      file: z.string(),
      day: z.string(),
      week: z.number(),
      department: z.string(),
    })
    .default({
      file: "",
      day: ref.day,
      week: moment(ref.day).isoWeek(),
      department: ref.department,
    }),
  properties: z
    .object({
      final_population_number: z.number(),
      cut_week_number: z.number(),
      duration: z.number(),
      temperature_target: z.number(),
      temperature_sensibility: z.number(),
      climat_sensibility: z.number(),
      seed: z.number(),
      mode: z.number(),
    })
    .default({
      mode: 0,
      final_population_number: 26000,
      temperature_sensibility: 1,
      climat_sensibility: 1,
      cut_week_number: ref.week,
      temperature_target: Math.round(ref.temperatures.tmoy * 10) / 10,
      duration: 1,
      seed: Math.floor(Math.random() * 1000),
    }),
  status: z
    .enum(Object.keys(SimulationStatues) as [keyof typeof SimulationStatues])
    .default("Initialized"),
  message: z.string().default(""),
  lastTaskId: z.string().optional().nullable().default(null),
  createdAt: z.date().default(new Date(new Date().toUTCString())),
  updatedAt: z.date().default(new Date(new Date().toUTCString())),
});

export type Simulation = z.infer<typeof simulationSchema>;

export interface ISimulationRepository {
  findAll(): Promise<Simulation[]>;
  findById(id: string): Promise<Simulation | undefined>;
  create(simulation: Simulation): Promise<Simulation>;
  update(
    id: string,
    properties: Omit<Partial<Simulation>, "id">,
  ): Promise<{ updated: Simulation; old: Simulation }>;
}
