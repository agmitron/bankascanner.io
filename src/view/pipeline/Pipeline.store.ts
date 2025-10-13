import { action, observable } from "mobx";
import { Step } from "./Pipeline.common";

class PipelineStore {
	@observable accessor step = Step.Import;

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
