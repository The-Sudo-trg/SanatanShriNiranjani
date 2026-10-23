// Playwright runner wrapper (same NODE_OPTIONS trick as next-build.mjs):
// preloads the drvfs copyfile patch so Playwright's own trace/report artifact
// copies (fs.copyFile inside /mnt mounts) don't fail with EPERM on WSL2.
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const patch = resolve(import.meta.dirname, "copyfile-patch.cjs");
process.env.NODE_OPTIONS = [process.env.NODE_OPTIONS, `--require ${patch}`].filter(Boolean).join(" ");

const result = spawnSync("npx", ["playwright", "test", ...process.argv.slice(2)], {
  stdio: "inherit",
  shell: process.platform === "win32",
});
process.exit(result.status ?? 1);
