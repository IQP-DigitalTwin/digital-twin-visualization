"use client";

import { SimulationAgentRow } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<SimulationAgentRow>[] = [
	{
		accessorKey: "id",
		header: "id",
	},
	{
		accessorKey: "num_times_switched",
		header: "Times Switched",
	},
	{
		accessorKey: "supplier",
		header: "Supplier",
	},
	{
		accessorKey: "plan",
		header: "Plan",
	},
];
