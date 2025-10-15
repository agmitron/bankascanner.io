import { describe, expect, it } from "vitest";
import { PipelineStore } from "./Pipeline.store";
import { Step } from "./common";

describe("PipelineStore", () => {
	it("next", () => {
		const s = new PipelineStore();
		expect(s.step).toBe(Step.Import);
		s.next();
		expect(s.step).toBe(Step.Review);
		s.next();
		expect(s.step).toBe(Step.Export);
	});
});
