import { NextResponse } from "next/server";
import fs, { promises } from "fs";
import { updateSimulationStatus } from "@/lib/serverutils";

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;
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
    const dir = "public/files/simulations/" + id;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    await promises.writeFile(`./public/files/simulations/${id}/${file.name}`, buffer);

    // Update simulation status to "Done"
    await updateSimulationStatus(id, "Done");

    return NextResponse.json("ok", { status: 200 });
}

export async function PUT(){   
}