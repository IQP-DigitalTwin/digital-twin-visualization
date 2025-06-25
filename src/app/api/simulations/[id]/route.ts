import { NextResponse } from "next/server";

import fs, { promises } from "fs";

export async function POST(
	req: Request,
	context: {params: {id: string}}
) {
    const { id } = context.params;
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
    const dir = "public/files/simulations/"+id
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
	await promises.writeFile(`./public/files/simulations/${id}/${file.name}`, buffer);

	return NextResponse.json("ok", { status: 200 });
}

export async function PUT(){   
}