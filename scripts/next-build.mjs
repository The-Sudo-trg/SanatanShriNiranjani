// Production build wrapper: injects the WSL2/drvfs copyfile patch into every
// node worker Next spawns (workers inherit NODE_OPTIONS from this env).
// arguments are forwarded verbatim (e.g. --webpack).
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const patch = resolve(import.meta.dirname, "copyfile-patch.cjs");
process.env.NODE_OPTIONS = [process.env.NODE_OPTIONS, `--require ${patch}`].filter(Boolean).join(" ");

const args = process.argv.slice(2);
const result = spawnSync("npx", ["next", "build", ...args], {
  stdio: "inherit",
  shell: process.platform === "win32",
});
process.exit(result.status ?? 1);
