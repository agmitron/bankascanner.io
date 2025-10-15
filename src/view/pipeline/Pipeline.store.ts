import { action, computed, observable } from "mobx";
import { Step } from "./common";
import type { Bank } from "~/definitions";

class PipelineStore {
	@observable accessor step = Step.Import;
	@observable accessor bank: Bank | null = null;
	@observable accessor file: Uint8Array | null = null;

	@action
	next() {
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
