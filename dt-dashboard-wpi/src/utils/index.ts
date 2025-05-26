import { z } from "zod";
import { v4 } from "uuid";
export function getZodDefaultValues<Schema extends z.AnyZodObject>(
	schema: Schema,
): z.infer<typeof schema> {
	return Object.fromEntries(
		Object.entries(schema.shape).map(([key, value]) => {
			if (value instanceof z.ZodDefault) {
				if (key === "id") {
					return [key, v4()];
				}
				return [key, value._def.defaultValue()];
			}
			return [key, undefined];
		}),
	);
}

export function getErrorMessage(error: unknown) {
	if (error instanceof Error) return error.message;
	return String(error);
}

export function msToTime(duration: number): string {
	let seconds = Math.floor((duration / 1000) % 60),
		minutes = Math.floor((duration / (1000 * 60)) % 60),
		hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

	const h = hours < 10 ? "0" + hours : hours;
	const m = minutes < 10 ? "0" + minutes : minutes;
	const s = seconds < 10 ? "0" + seconds : seconds;

	return h + ":" + m + ":" + s;
}

export function groupBy<T>(
	array: T[],
	predicate: (value: T, index: number, array: T[]) => string,
) {
	array.reduce(
		(acc, value, index, array) => {
			(acc[predicate(value, index, array)] ||= []).push(value);
			return acc;
		},
		{} as { [key: string]: T[] },
	);
}

export function deserializeSimulationHeader(
	header: string,
): Record<string, string> {
	return header
		.split("_")
		.map((i) => i.split("=").map((i) => i.split("#").slice(-1)))
		.filter((a) => isNaN(Number(a[0])))
		.reduce<Record<string, string>>((acc, i) => {
			if (i[0] && i[1]) {
				acc[i[0][0]] = i[1][0];
			}
			if (i.length === 1) {
				acc["name"] = i[0][0];
			}
			return acc;
		}, {});
}

export function stringifyKeys(data: Record<string, unknown>): string {
	return Object.values(data).join("-");
}

export function createNuances({
	color,
	globalInterval,
}: {
	color?: string;
	globalInterval: { min: number; max: number };
}): (value: number) => string {
	let colors: string[] = [
		"#1423dc",
		"#6048e3",
		"#896bea",
		"#aa8ff0",
		"#c8b3f6",
		"#e4d9fb",
		"#ffffff",
	];

	if (color === "green") {
		colors = [
			"#93c90e",
			"#a8d249",
			"#bcdb70",
			"#cee494",
			"#dfedb8",
			"#f0f6db",
			"#ffffff",
		];
	}

	if (color === "red") {
		colors = [
			"#fb5454",
			"#ff756e",
			"#ff938a",
			"#ffafa6",
			"#ffcac3",
			"#ffe4e1",
			"#ffffff",
		];
	}

	if (color === "meteo") {
		colors = [
			"#F1515E",
			"#CE6375",
			"#AA758B",
			"#8787A2",
			"#6499B9",
			"#40ABCF",
			"#1DBDE6",
		];
	}

	const globalIntervalSize = globalInterval.max - globalInterval.min;
	const gradientStepsNumber = colors.length - 1;
	const interval = globalIntervalSize / gradientStepsNumber;
	const intervals = colors.map((_, i) => i * interval + globalInterval.min);
	const gradient = colors.reverse();

	return function(value: number): string {
		if (globalIntervalSize <= 0) {
			return gradient[Math.floor(colors.length / 2)];
		}

		if (value <= globalInterval.min) {
			return gradient[0];
		}

		if (value >= globalInterval.max) {
			return gradient[gradientStepsNumber];
		}

		const selectedColor = gradient[intervals.findIndex((i) => value <= i)];

		if (!selectedColor) {
			return gradient[0];
		}

		return selectedColor;
	};
}
