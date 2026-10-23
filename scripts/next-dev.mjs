// Dev-server wrapper: same NODE_OPTIONS copyfile patch as next-build.mjs,
// arguments forwarded verbatim (e.g. --port 3100).
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const patch = resolve(import.meta.dirname, "copyfile-patch.cjs");
process.env.NODE_OPTIONS = [process.env.NODE_OPTIONS, `--require ${patch}`].filter(Boolean).join(" ");

const args = process.argv.slice(2);
const result = spawnSync("npx", ["next", "dev", ...args], {
  stdio: "inherit",
  shell: process.platform === "win32",
});
process.exit(result.status ?? 1);
