import "@testing-library/jest-dom/vitest";
import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// jest-dom declares its matchers on the `vitest` module, which is where Vitest 3
// declared `Assertion`. Vitest 4 moved that interface to `@vitest/expect` and
// only re-exports it, and interface merging does not travel through a
// re-export — so the matchers land nowhere until they are declared against the
// module that now owns the interface.
declare module "@vitest/expect" {
	interface Assertion<T = any> extends TestingLibraryMatchers<any, T> {}
	interface AsymmetricMatchersContaining
		extends TestingLibraryMatchers<any, any> {}
}

afterEach(() => {
	cleanup();
});
