import { Definition } from "bankascanner/importer";

const importers = {
	tbc: "https://agmitron.github.io/bankascanner/tbc/tbc.js",
	tbank: "https://agmitron.github.io/bankascanner/tbank/tbank.js",
} as const;

export async function load(bank: keyof typeof importers): Promise<Definition> {
	const url = importers[bank];
	if (!url) {
		throw new Error(`Importer for ${bank} was not found.`);
	}

	return import(url);
}
