import { NextResponse, NextRequest } from "next/server";
import { promises } from "fs";
import path from "path";

async function getCsv(filename: string) {
  const readPath = path.join(
    __dirname,
    `../../../../../../public/files/populations/${filename}`,
  );

  return await promises.readFile(readPath);
}

export async function GET(
  _: NextRequest,
  { params: { filename } }: { params: { filename: string } },
) {
  const paramFilename = filename.split(".");
  if (paramFilename[1] && !["csv"].includes(paramFilename[1])) {
    throw new Error("Extension not supported");
  }

  const headers = new Headers();
  headers.set("Content-Type", "text/csv");
  headers.set("Content-Disposition", `attachment; filename=${filename}`);
  const blob = await getCsv(filename);
  return new NextResponse(blob, { status: 200, statusText: "OK", headers });
}
