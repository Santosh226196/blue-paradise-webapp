#!/usr/bin/env node
/**
 * Convert inline style={{ }} to Tailwind CSS classes.
 * Handles the common patterns in this codebase.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";

// CSS variable → Tailwind class mappings
const COLOR_MAP = {
  "var(--text-primary)": "text-text-primary",
  "var(--text-secondary)": "text-text-secondary",
  "var(--text-muted)": "text-text-muted",
  "var(--accent-aqua)": "text-accent-aqua",
  "var(--accent-coral)": "text-accent-coral",
  "var(--accent-pool)": "text-accent-pool",
};

const BG_MAP = {
  "var(--glass-bg)": "bg-glass-bg",
  "var(--glass-bg-hover)": "bg-glass-bg-hover",
  "var(--glow-aqua)": "bg-glow-aqua",
  "var(--glow-coral)": "bg-glow-coral",
  "var(--glow-pool)": "bg-glow-pool",
  "var(--input-bg)": "bg-input-bg",
  "var(--sidebar-bg)": "bg-sidebar-bg",
  "var(--bg-deep)": "bg-bg-deep",
  "var(--bg-mid)": "bg-bg-mid",
  "var(--bg-surface)": "bg-bg-surface",
  "white": "bg-white",
};

const BORDER_COLOR_MAP = {
  "var(--glass-border)": "border-glass-border",
  "var(--glass-border-strong)": "border-glass-border-strong",
  "var(--input-border)": "border-input-border",
  "var(--accent-aqua)": "border-accent-aqua",
  "var(--accent-coral)": "border-accent-coral",
  "var(--input-focus-ring)": "border-accent-aqua",
};

const TEXT_COLOR_WHITE = "text-white";

function getAllTsxFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      files.push(...getAllTsxFiles(full));
    } else if (extname(full) === ".tsx" || extname(full) === ".ts") {
      files.push(full);
    }
  }
  return files;
}

function convertStyleProp(content) {
  let changes = 0;

  // Pattern: style={{ color: "var(--xxx)" }}
  // Replace single-property color styles
  for (const [varExpr, twClass] of Object.entries(COLOR_MAP)) {
    const re = new RegExp(
      `\\s+style=\\{\\{\\s*color:\\s*"${varExpr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"\\s*\\}\\}`,
      "g"
    );
    const before = content;
    content = content.replace(re, (match) => {
      changes++;
      return ` className={${"\""}}${twClass}${"\""}`;
    });
    // Handle when className already exists - we need to merge
    // Actually let's do a different approach: remove style and add to className
  }

  // Pattern: style={{ background: "var(--xxx)" }}
  for (const [varExpr, twClass] of Object.entries(BG_MAP)) {
    const escaped = varExpr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(
      `\\s+style=\\{\\{\\s*background:\\s*"${escaped}"\\s*\\}\\}`,
      "g"
    );
    content = content.replace(re, (match) => {
      changes++;
      return ` className={${"\""}}${twClass}${"\""}`;
    });
  }

  return { content, changes };
}

// Process files
const srcDir = "src";
const files = getAllTsxFiles(srcDir);
let totalChanges = 0;

for (const file of files) {
  const content = readFileSync(file, "utf8");
  const { content: converted, changes } = convertStyleProp(content);
  if (changes > 0) {
    writeFileSync(file, converted);
    console.log(`${file}: ${changes} conversions`);
    totalChanges += changes;
  }
}

console.log(`\nTotal: ${totalChanges} conversions across ${files.length} files`);
