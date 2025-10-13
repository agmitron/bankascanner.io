import { action, observable } from "mobx";
import { Step } from "./common";
import type { Bank } from "~/definitions";

class PipelineStore {
	@observable accessor step = Step.Import;
	@observable accessor bank: Bank | null = null;

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
}

const store = new PipelineStore();
export default store;
