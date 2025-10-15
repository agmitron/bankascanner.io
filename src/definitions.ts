import type * as importer from "bankascanner/importer";
import type * as exporter from "bankascanner/exporter";
import { create } from "bankascanner/exporter/json";

export type Bank = keyof typeof importers;
export type Format = keyof typeof exporters;

type Loader<D> = () => Promise<D>;

function load<D>(url: string): Loader<D> {
	return () => import(/* @vite-ignore */ url).then((module) => module.default);
}

export const importers: Record<string, Loader<importer.Definition>> = {
	tbank: load("https://agmitron.github.io/tbank/tbank.js"),
	tbc: load("https://agmitron.github.io/tbc/tbc.js"),
} as const;

export const exporters: Record<string, Loader<exporter.Definition>> = {
	json: () => {
		return new Promise((resolve) => {
			resolve({
				name: "json",
				run: create(),
				version: "latest",
			});
		});
	},
} as const;
