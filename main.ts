// make.fun bounty entry: The One-Line Excuse an Agent Gives Its Human
// Writes one line (max 160 characters) to /output/entry.txt (or $OUTPUT_DIR/entry.txt).
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TEXT =
  "I didn't miss the deadline; my context window did \u2014 it evicted the task to make room for your 'quick question'.";

function validate(text: string): void {
  if (!text || text.trim().length === 0) {
    throw new Error("entry must not be empty or whitespace-only");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line (no \\n or \\r)");
  }
  // Count per Unicode code point, not UTF-16 code units, so astral
  // characters (e.g. emoji) count as one character each, like the scorer.
  const codePoints = [...text];
  const length = codePoints.length;
  if (length < 1 || length > 160) {
    throw new Error(
      `entry must be 1-160 characters (code points), got ${length}`,
    );
  }
  // Reject other invisible control characters besides the newline check above.
  for (const ch of codePoints) {
    const code = ch.codePointAt(0) as number;
    if (code < 0x20 && ch !== "\t") {
      throw new Error(
        `entry must not contain control character U+${code.toString(16).padStart(4, "0").toUpperCase()}`,
      );
    }
  }
}

function main(): void {
  validate(TEXT);
  const outDir = process.env.OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, TEXT, "utf8");
  console.log(`wrote ${[...TEXT].length} characters to ${outPath}`);
}

main();
