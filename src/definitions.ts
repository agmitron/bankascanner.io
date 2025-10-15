import type * as importer from "bankascanner/importer";
import type * as exporter from "bankascanner/exporter";

export type Bank = keyof typeof importers;
export type Format = keyof typeof exporters;

type Loader<D> = () => Promise<D>;

function load<D>(url: string): Loader<D> {
	return () => import(url).then((module) => module.default);
}

export const importers: Record<string, Loader<importer.Definition>> = {
	tbank: load("https://agmitron.github.io/bankascanner/tbank/tbank.js"),
	tbc: load("https://agmitron.github.io/bankascanner/tbc/tbc.js"),
};

export const exporters: Record<string, Loader<exporter.Definition>> = {
	json: load("bankascanner/exporter/json"),
};
