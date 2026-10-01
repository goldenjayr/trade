import { spawnSync } from "node:child_process";
import { basename } from "node:path";

import { manilaDate } from "../lib/manila";

const SECRET_PATH =
  /(^|\/)(\.env($|\.)|.*credential.*|.*secret.*|.*api[_-]?key.*|.*private[_-]?key.*|id_rsa|id_ed25519|\.pem$|\.p12$)/i;

const ALLOWED_PREFIXES = ["data/", "inbox/"];

function git(args: string[], opts?: { allowFail?: boolean }) {
  const result = spawnSync("git", args, { encoding: "utf8" });
  if (result.status !== 0 && !opts?.allowFail) {
    const err = (result.stderr || result.stdout || "git failed").trim();
    throw new Error(err);
  }
  return {
    status: result.status ?? 1,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
  };
}

function porcelain() {
  return git(["status", "--porcelain", "-u"]).stdout
    .split("\n")
    .map((line) => line.trimEnd())
    .filter(Boolean)
    .map((line) => {
      const status = line.slice(0, 2);
      const file = line.slice(3).replace(/ -> .*$/, "");
      return { status, file };
    });
}

function isAllowed(file: string) {
  if (file.startsWith("inbox/") && !file.endsWith(".json")) return false;
  return ALLOWED_PREFIXES.some((p) => file === p.slice(0, -1) || file.startsWith(p));
}

function main() {
  const date = manilaDate();
  const rows = porcelain();
  const deskFiles = rows.filter((r) => isAllowed(r.file));
  const secrets = deskFiles.filter((r) => SECRET_PATH.test(r.file));

  if (secrets.length > 0) {
    console.error("desk:publish refused — secret-like paths:");
    for (const s of secrets) console.error(`  ${s.file}`);
    process.exit(1);
  }

  if (deskFiles.length === 0) {
    console.log(`desk: ${date} (Manila) — clean, nothing to publish`);
    process.exit(0);
  }

  const addList = deskFiles.map((f) => f.file);
  for (const file of addList) {
    if (SECRET_PATH.test(basename(file))) {
      console.error(`desk:publish refused — will not add ${file}`);
      process.exit(1);
    }
  }

  git(["add", "--", ...addList]);

  const staged = git(["diff", "--cached", "--name-only"])
    .stdout.split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const badStaged = staged.filter((f) => !isAllowed(f) || SECRET_PATH.test(f));
  if (badStaged.length > 0) {
    git(["reset", "HEAD", "--", ...badStaged], { allowFail: true });
    console.error("desk:publish refused — refused to commit:");
    for (const f of badStaged) console.error(`  ${f}`);
    process.exit(1);
  }

  if (staged.length === 0) {
    console.log(`desk: ${date} (Manila) — clean, nothing to publish`);
    process.exit(0);
  }

  const message = `desk: ${date} (Manila)`;
  git(["commit", "-m", message]);
  const push = git(["push", "-u", "origin", "HEAD"], { allowFail: true });
  if (push.status !== 0) {
    console.error(push.stderr || push.stdout);
    process.exit(push.status);
  }
  console.log(`published ${message}`);
  for (const f of staged) console.log(`  ${f}`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
