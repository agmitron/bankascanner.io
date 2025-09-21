import * as importer from "bankascanner/importer";
import * as exporter from "bankascanner/exporter";

type Loader<D> = () => Promise<D>;

export const importers: Loader<importer.Definition>[] = [
	load("https://agmitron.github.io/bankascanner/tbank/tbank.js"),
	load("https://agmitron.github.io/bankascanner/tbc/tbc.js"),
];

export const exporters: Loader<exporter.Definition>[] = [
	load("bankascanner/exporter/json"),
];

function load<D>(url: string): Loader<D> {
	return () => import(url);
}
