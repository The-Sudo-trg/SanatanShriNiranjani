// NODE_OPTIONS preload — WSL2/drvfs workaround.
// node's fs.copyFile uses copy_file_range(2), which returns EPERM for copies
// *within* a /mnt (drvfs/9p) mount. Next.js copies build artifacts exactly that
// way, so we transparently fall back to read/write streaming on EPERM.
// On native filesystems (Windows/macOS/regular ext4) the fallback never triggers.
"use strict";

const fs = require("fs");
const path = require("path");

const origCopyFileSync = fs.copyFileSync.bind(fs);
const origCopyFile = fs.copyFile.bind(fs);

function streamCopy(src, dest) {
  return new Promise((resolve, reject) => {
    fs.mkdir(path.dirname(dest), { recursive: true }, (mkErr) => {
      if (mkErr) return reject(mkErr);
      const rs = fs.createReadStream(src);
      const ws = fs.createWriteStream(dest);
      rs.on("error", reject);
      ws.on("error", reject);
      ws.on("finish", resolve);
      rs.pipe(ws);
    });
  });
}

function streamCopySync(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, fs.readFileSync(src));
}

function shouldFallback(err, flags) {
  return err?.code === "EPERM" && !flags; // plain copy → stream fallback
}

fs.copyFileSync = function patchedCopyFileSync(src, dest, flags) {
  try {
    return origCopyFileSync(src, dest, flags);
  } catch (err) {
    if (!shouldFallback(err, flags)) throw err;
    return streamCopySync(src, dest);
  }
};

fs.copyFile = function patchedCopyFile(src, dest, flags, callback) {
  const cb = arguments[arguments.length - 1];
  const numericFlags = typeof flags === "function" ? 0 : flags;
  origCopyFile(src, dest, numericFlags, (err) => {
    if (!err) return cb(null);
    if (!shouldFallback(err, numericFlags)) return cb(err);
    streamCopy(src, dest).then(
      () => cb(null),
      (e2) => cb(e2),
    );
  });
};

// async variant (fs/promises) — what Next.js actually uses for artifact copies
const origPromisesCopyFile = fs.promises.copyFile.bind(fs.promises);
fs.promises.copyFile = async function patchedPromisesCopyFile(src, dest, flags) {
  try {
    return await origPromisesCopyFile(src, dest, flags);
  } catch (err) {
    if (!shouldFallback(err, flags)) throw err;
    await streamCopy(src, dest);
  }
};

// drvfs ignores chmod (always EPERM) — reports/CI artifacts shouldn't die on it
const origChmodSync = fs.chmodSync.bind(fs);
fs.chmodSync = function patchedChmodSync(path, mode) {
  try {
    return origChmodSync(path, mode);
  } catch (err) {
    if (err?.code !== "EPERM") throw err;
    return undefined; // permission bits are not honored on the mount anyway
  }
};
