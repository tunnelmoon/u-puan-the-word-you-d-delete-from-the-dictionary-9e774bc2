import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The one word to erase from the dictionary forever.
const WORD = "colonel";

function main(): void {
  if (WORD.length < 1 || WORD.length > 77) {
    throw new Error(`entry must be 1-77 characters, got ${WORD.length}`);
  }
  if (WORD.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (/\s/.test(WORD)) {
    throw new Error("entry must be a single word, no whitespace allowed");
  }
  if (/[^\x20-\x7e]/.test(WORD)) {
    throw new Error("entry must not contain control or non-printable characters");
  }
  if (!/^[a-z]+$/.test(WORD)) {
    throw new Error("entry must be one lowercase word, letters only");
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, WORD, "utf8");

  const back = readFileSync(outPath, "utf8");
  if (back !== WORD) {
    throw new Error(`round-trip mismatch: read back ${JSON.stringify(back)}`);
  }
  console.log(`wrote ${outPath} (${WORD.length} chars)`);
}

main();
