import { it, expect, describe } from "vitest";
import { BFInterpreter } from "../src";

import testSuite from "./testSuite.json";

describe("Index", () => {
	const interpreter = new BFInterpreter();

	for(const { output, input } of testSuite){
		it(`should output ${output}`, async () => {
			const out = await interpreter.run(input);
			expect(out).eq(output);
		});
	}
});
