import { NextResponse, NextRequest } from "next/server";

import fs, { promises } from "fs";

export async function POST(
	req: Request,
	{ params: { id } }: { params: { id: string } }
) {
	if (!id) {
		return NextResponse.json<{ errors: unknown }>(
			{
				errors: {
					message: `Missing id in query`,
				},
			},
			{ status: 500 }
		);
	}

	const formData = await req.formData();
	const file = formData.get("file") as File;
	const arrayBuffer = await file.arrayBuffer();
	const buffer = new Uint8Array(arrayBuffer);

	await promises.writeFile(`./public/files/simulations/${file.name}`, buffer);

	return NextResponse.json("ok", { status: 200 });
}