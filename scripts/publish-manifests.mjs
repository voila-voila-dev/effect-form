/*
 * Edits the package manifests for publishing. Two modes, because publishing
 * needs manifest edits at two moments:
 *
 *   stamp     - before `bun install`: writes PUBLISH_VERSION into both
 *               manifests, and into the exact pin form-react holds on the
 *               core, so the two always ship as a matched pair.
 *   finalize  - after the build: drops devDependencies, which a consumer
 *               never installs and which only widen the published surface.
 *
 * `exports` needs no rewriting here: it points at dist/ in the repo already,
 * because `publishConfig.exports` is a pnpm/npm-time rewrite that `bun pm pack`
 * does not apply, and a tarball shipping raw src/ is worse than a workspace
 * that has to build before its tests.
 */
import fs from "node:fs";
import path from "node:path";

const CORE = "@voila.dev/effect-form";
const PACKAGES = ["form", "form-react"];

const mode = process.argv[2];
const version = process.env.PUBLISH_VERSION;

if (!["stamp", "finalize"].includes(mode)) {
	throw new Error("usage: publish-manifests.mjs <stamp|finalize>");
}
if (mode === "stamp" && !version) {
	throw new Error("stamp requires PUBLISH_VERSION");
}

for (const dir of PACKAGES) {
	const file = path.join("packages", dir, "package.json");
	const pkg = JSON.parse(fs.readFileSync(file, "utf8"));

	if (mode === "stamp") {
		pkg.version = version;
		if (pkg.dependencies?.[CORE]) {
			pkg.dependencies[CORE] = version;
		}
		console.log(`${pkg.name}@${pkg.version}`);
	} else {
		delete pkg.devDependencies;
		console.log(`${pkg.name}: manifest ready to publish`);
	}

	fs.writeFileSync(file, `${JSON.stringify(pkg, null, "\t")}\n`);
}
