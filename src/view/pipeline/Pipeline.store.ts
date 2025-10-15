import { action, computed, observable } from "mobx";
import { Step } from "./common";
import { importers, type Bank } from "~/definitions";
import type { Result } from "bankascanner/importer";

class PipelineStore {
	@observable accessor step = Step.Import;
	@observable accessor bank: Bank | null = null;
	@observable accessor file: Uint8Array | null = null;
	@observable accessor result: Result | null = null;

	@action
	async next() {
		switch (this.step) {
			case Step.Import:
				await this.scan();
				break;

			default:
				break;
		}

		const next = this.step + 1;
		if (next < Object.keys(Step).length) {
			this.step = next;
		}
	}

	@action
	previous() {
		const previous = this.step - 1;
		if (previous > 0) {
			this.step--;
		}
	}

	@action
	upload(file: Uint8Array) {
		this.file = file;
	}

	@action
	async scan() {
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
	}

	@computed
	get canContinue(): boolean {
		switch (this.step) {
			case Step.Import: {
				return this.bank != null && this.file != null;
			}
		}

		return false;
	}
}

const store = new PipelineStore();
export default store;
