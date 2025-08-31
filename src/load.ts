export const importers = {
        tbc: "https://agmitron.github.io/bankascanner/tbc/tbc.js",
        tbank: "https://agmitron.github.io/bankascanner/tbank/tbank.js",
} as const;

export type Bank = keyof typeof importers;

export function getSupportedBanks(): Bank[] {
        return Object.keys(importers) as Bank[];
}

export function getSupportedVersions(_bank: Bank): string[] {
        return ["latest"];
}

import type { Either } from "bankascanner";

export interface ScanSuccess {
        date: string;
        comment: string;
        value: number;
        currency: string;
        category: string;
}

export interface ScanError {
        message: string;
        fields?: Record<string, unknown>;
}

export type Outcome = Either<ScanError, ScanSuccess>;

export interface ImporterModule {
        run(binary: Uint8Array): Promise<Either<string, Outcome[]>>;
}

export async function load(bank: Bank): Promise<ImporterModule> {
        const url = importers[bank];
        if (!url) {
                throw new Error(`Importer for ${bank} was not found.`);
        }

        return import(url) as Promise<ImporterModule>;
}
