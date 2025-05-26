import { NextResponse, NextRequest } from "next/server";
import {
  Simulation,
  simulationSchema,
} from "@/repositories/Simulation/ISimulationRepository";
import SimulationRepository from "@/repositories/Simulation/SimulationRepository";
import fs, { promises } from "fs";
import { validate } from "uuid";
import * as hdf5 from "jsfive";
import path from "path";
import { stringify } from "csv";
import { deserializeSimulationHeader, stringifyKeys } from "@/utils";

const simulationRepository = new SimulationRepository();

async function getH5File(simulation: Simulation) {
  const readPath = path.join(
    __dirname,
    `../../../../../../public/files/simulations/${simulation.id}.h5`,
  );

  return await promises.readFile(readPath);
}

async function convertH5ToCSV(simulation: Simulation) {
  const readPath = path.join(
    __dirname,
    `../../../../../../public/files/simulations/${simulation.id}.h5`,
  );

  const file = await promises.readFile(readPath);
  const h5 = new hdf5.File(file.buffer, "r");
  const headers = h5.get("1/meta").value;
  const rawData = h5.get("1/data").value;
  const data = [...headers].map((header, i) => {
    return [
      stringifyKeys(deserializeSimulationHeader(header)) || header,
      ...rawData.slice(
        i * (simulation.properties.duration + 1),
        (i + 1) * (simulation.properties.duration + 1),
      ),
    ];
  });

  const asyncStringify = (data: unknown[]) =>
    new Promise((resolve, reject) =>
      stringify(data, { delimiter: ";" }, (err, result) => {
        if (err) {
          reject(err);
        } else resolve(result);
      }),
    );

  const csvString = (await asyncStringify(data)) as string;

  return Buffer.from(csvString);
}

export async function GET(
  _: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  const paramId = id.split(".");

  if (!validate(paramId[0])) {
    throw new Error("Bad id format");
  }

  id = paramId[0];

  if (paramId[1] && !["csv", "h5"].includes(paramId[1])) {
    throw new Error("Extension not supported");
  }

  const extension = paramId[1] || null;

  if (!id) {
    return NextResponse.json<{ errors: unknown }>(
      {
        errors: {
          message: `Missing id in query`,
        },
      },
      { status: 500 },
    );
  }

  const simulation = await simulationRepository.findById(id);

  if (!simulation) {
    return NextResponse.json<{ errors: unknown }>(
      {
        errors: {
          message: `No simulation with id: ${id}`,
        },
      },
      { status: 500 },
    );
  }

  if (extension === "csv") {
    const headers = new Headers();
    headers.set("Content-Type", "text/csv");
    headers.set(
      "Content-Disposition",
      `attachment; filename=${simulation.name}.${extension}`,
    );
    const blob = await convertH5ToCSV(simulation);
    return new NextResponse(blob, { status: 200, statusText: "OK", headers });
  }

  if (extension === "h5") {
    const headers = new Headers();
    headers.set("Content-Type", "application/x-hdf5");
    headers.set(
      "Content-Disposition",
      `attachment; filename=${simulation.id}.${extension}`,
    );
    const blob = await getH5File(simulation);
    return new NextResponse(blob, { status: 200, statusText: "OK", headers });
  }

  return NextResponse.json<Simulation>(simulation, { status: 200 });
}

export async function POST(
  req: Request,
  { params: { id } }: { params: { id: string } },
) {
  if (!id) {
    return NextResponse.json<{ errors: unknown }>(
      {
        errors: {
          message: `Missing id in query`,
        },
      },
      { status: 500 },
    );
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  await promises.writeFile(`./public/files/simulations/${file.name}`, buffer);

  await simulationRepository.update(id, {
    status: "Done",
  });

  return NextResponse.json("ok", { status: 200 });
}

export async function PUT(
  req: Request,
  { params: { id } }: { params: { id: string } },
) {
  const body = await req.formData();

  const parseBody = simulationSchema.partial().safeParse({
    status: body.get("status") as unknown as string,
    message: body.get("message") as string,
  });

  if (!parseBody.success) {
    return NextResponse.json<{ errors: unknown }>(
      { errors: parseBody.error.issues },
      { status: 500 },
    );
  }

  const { updated, old } = await simulationRepository.update(
    id,
    parseBody.data,
  );

  return NextResponse.json<{ updated: Simulation; old: Simulation }>(
    { updated, old },
    { status: 200 },
  );
}

export async function DELETE(
  _: Request,
  { params: { id } }: { params: { id: string } },
) {
  await simulationRepository.delete(id);

  const path = `./public/files/simulations/${id}.h5`;
  const exists = fs.existsSync(path);
  if (exists) {
    await promises.unlink(path);
  }

  return NextResponse.json("ok", { status: 200 });
}
