import { Exporter } from "bankascanner/exporter";
import { create as json } from "bankascanner/exporter/json";

export const formats = {
	json,
} as const;

export function load(f: keyof typeof formats): Exporter {
	const implementation = formats[f];
	if (!implementation) {
		throw new Error(`Exporter for format ${f} was not found.`);
	}

	return implementation();
}
