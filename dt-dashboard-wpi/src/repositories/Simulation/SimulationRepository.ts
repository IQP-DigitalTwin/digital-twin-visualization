import { LowSync } from "lowdb";
import { ISimulationRepository, Simulation } from "./ISimulationRepository";
import { JSONFileSyncPreset } from "lowdb/node";
import { validate } from "uuid";

export default class SimulationRepository implements ISimulationRepository {
  private db: LowSync<{ simulations: Simulation[] }>;

  constructor() {
    this.db = JSONFileSyncPreset<{ simulations: Simulation[] }>(
      "public/files/simulations/index.json",
      {
        simulations: [],
      },
    );
  }

  async findAll() {
    this.db.read();
    return this.db.data.simulations;
  }

  async findById(id: string): Promise<Simulation | undefined> {
    this.db.read();
    return this.db.data.simulations.find((simulation) => simulation.id === id);
  }

  async create(simulation: Simulation): Promise<Simulation> {
    if (await this.findById(simulation.id)) {
      throw new Error(`The simulation ${simulation.id} already exists`);
    }

    if (!validate(simulation.id)) {
      throw new Error(`Bad uuid format`);
    }

    this.db.read();
    this.db.data.simulations.push(simulation);
    this.db.write();

    return simulation;
  }

  async update(
    id: string,
    properties: Omit<Partial<Simulation>, "id">,
  ): Promise<{ updated: Simulation; old: Simulation }> {
    const oldSimulation = await this.findById(id);
    if (!oldSimulation) {
      throw new Error(`The simulation ${id} not exists`);
    }

    const updatedSimulation = {
      ...oldSimulation,
      ...properties,
      updatedAt: new Date(new Date().toUTCString()),
    };

    this.db.data.simulations = this.db.data.simulations.map((oldSimulation) =>
      id === oldSimulation.id ? updatedSimulation : oldSimulation,
    );

    this.db.write();

    return {
      old: oldSimulation,
      updated: updatedSimulation,
    };
  }

  async delete(id: string): Promise<void> {
    if (!(await this.findById(id))) {
      throw new Error(`The simulation ${id} not exists`);
    }

    this.db.read();
    this.db.data.simulations = this.db.data.simulations.filter(
      (sim) => sim.id !== id,
    );
    this.db.write();
  }
}
