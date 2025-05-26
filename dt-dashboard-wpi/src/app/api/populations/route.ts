import { NextResponse } from "next/server";
import { promises } from "fs";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  await promises.writeFile(`./public/files/populations/${file.name}`, buffer);

  return NextResponse.json("ok", { status: 200 });
}

export async function GET(_: Request) {
  const files = await promises.readdir(`./public/files/populations/`);
  return NextResponse.json(files, { status: 200 });
}
