import type * as importer from "bankascanner/importer";
import type * as exporter from "bankascanner/exporter";

type Loader<D> = () => Promise<D>;

export const importers: Record<string, Loader<importer.Definition>> = {
	tbank: load("https://agmitron.github.io/bankascanner/tbank/tbank.js"),
	tbc: load("https://agmitron.github.io/bankascanner/tbc/tbc.js"),
};

export const exporters: Record<string, Loader<exporter.Definition>> = {
	json: load("bankascanner/exporter/json"),
};

function load<D>(url: string): Loader<D> {
	return () => import(url);
}
