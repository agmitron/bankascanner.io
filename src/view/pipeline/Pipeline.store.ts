import { action, computed, observable } from "mobx";
import { Step } from "./common";
import { importers, type Bank } from "~/definitions";
import type { Result } from "bankascanner/importer";
import { notification } from "antd";

export type ExportFormat = "csv" | "json";

const forth: Partial<Record<Step, Step>> = {
	[Step.Import]: Step.Review,
	[Step.Review]: Step.Export,
};

const back: Partial<Record<Step, Step>> = {
	[Step.Export]: Step.Review,
	[Step.Review]: Step.Import,
};

class PipelineStore {
	@observable accessor step = Step.Import;
	@observable accessor bank: Bank | null = null;
	@observable accessor file: Uint8Array | null = null;
	@observable accessor result: Result | null = null;
	@observable accessor error: string | null = null;
	@observable accessor exportFormat: ExportFormat = "csv";

	@action
	async next() {
		const next = forth[this.step];
		if (next) {
			this.step = next;
		}
	}

	@action
	previous() {
		const previous = back[this.step];
		if (previous) {
			this.step = previous;
		}
	}

	@action
	upload(file: Uint8Array) {
		this.file = file;
		this.error = null;
		this.result = null;
		this.exportFormat = "csv";
	}

	@action
	setBank(b: Bank) {
		this.bank = b;
		this.error = null;
		this.result = null;
		this.exportFormat = "csv";
	}

	@action
	async scan() {
		this.error = null;

		if (!this.bank) {
			throw new Error(
				"Bank is not set. You accessed this action at the wrong stage.",
			);
		}

		if (!this.file) {
			throw new Error(
				"File is not uploaded. You accessed this action at the wrong stage.",
			);
		}

		const load = importers[this.bank];
		const importer = await load();
		this.result = await importer.run(this.file);

		if (this.result.isLeft()) {
			this.error = this.result.value;
			return notification.error({
				message: `Scan failed: ${this.result.value}`,
				pauseOnHover: true,
			});
		}

		this.next();
	}

	@action
	setExportFormat(format: ExportFormat) {
		this.exportFormat = format;
	}

	@action
	exportResult() {
		if (!this.result || this.result.isLeft()) {
			return notification.warning({
				message: "Nothing to export",
				description: "Сканируйте выписку перед экспортом.",
			});
		}

		return notification.info({
			message: "Export placeholder",
			description: `Экспорт в формате ${this.exportFormat.toUpperCase()} скоро будет доступен.`,
		});
	}

	@computed
	get canContinue(): boolean {
		switch (this.step) {
			case Step.Import: {
				return this.bank != null && this.file != null && this.error === null;
			}
		}

		return false;
	}
}

const store = new PipelineStore();
export default store;
