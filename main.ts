// Houseplant Out-of-Office entry: one out-of-office auto-reply a houseplant would send,
// at most 120 characters. The program writes the line to $MAKEFUN_OUTPUT_DIR/entry.txt
// with no trailing newline, so the gate reads exactly the line and nothing else.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "Out of office: my roots are on strike. No water since March, no replies until it rains.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

// Read-back self-check: the gate requires UTF-8 text of 1-120 characters,
// not only whitespace, with no trailing newline. The entry is a single line,
// so any newline anywhere (not just at the end) is a defect. Fail loudly.
const written = readFileSync(outPath, "utf8");
if (written !== LINE) throw new Error("entry.txt content mismatch");
if (written.length < 1 || written.length > 120) {
  throw new Error(`entry.txt length ${written.length} outside 1-120 chars`);
}
if (written.trim().length === 0) throw new Error("entry.txt is only whitespace");
if (written.includes("\n")) throw new Error("entry.txt contains a newline");
