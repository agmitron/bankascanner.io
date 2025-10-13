import type { UploadFile } from "antd/es/upload/interface";
import { makeAutoObservable } from "mobx";
import { Step } from "./common";

class PipelineStore {
	step = Step.Import;
	fileList: UploadFile[] = [];
	selectedBank?: string;
	selectedVersion?: string;

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true });
	}

	setFileList(fileList: UploadFile[]) {
		this.fileList = fileList;
	}

	setSelectedBank(bank?: string) {
		this.selectedBank = bank;
	}

	setSelectedVersion(version?: string) {
		this.selectedVersion = version;
	}

	next() {
		if (this.step < Step.Export) {
			this.step += 1;
		}
	}

	previous() {
		if (this.step > Step.Import) {
			this.step -= 1;
		}
	}
}

const store = new PipelineStore();
export default store;
