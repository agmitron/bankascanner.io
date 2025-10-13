import type * as exporter from "bankascanner/exporter";
import type * as importer from "bankascanner/importer";
import type { Scan } from "bankascanner/scan";

type Loader<Definition> = () => Promise<Definition>;

function load<Definition>(uri: string): Loader<Definition> {
	return () => import(uri);
}

export const importers: Record<string, Loader<importer.Definition>> = {
	tbc: load("https://agmitron.github.io/bankascanner/tbc/tbc.js"),
};

export const exporters: Record<string, Loader<exporter.Definition>> = {
	json: load("bankascanner/exporter/json"),
};

export async function read(
	file: Uint8Array,
	bank: keyof typeof importers,
): Promise<importer.Result> {
	const loader = importers[bank];
	if (!loader) {
		throw new Error(`Unsupported bank: ${bank}`);
	}

	const imp = await loader();
	return imp.run(file);
}

export async function write(scan: Scan, format: string) {
	const loader = exporters[format];
	if (!loader) {
		throw new Error(`Unsupported format: ${format}`);
	}
	const exp = await loader();
	return exp.run(scan);
}
