#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

//@trace REQ-025 @
export default function installHook() {
  try {
    // 1. Ask Git for the true hooks directory (handles worktrees, submodules, and core.hooksPath)
    const gitQuery = spawnSync("git", ["rev-parse", "--git-path", "hooks"], {
        cwd: process.cwd(),
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"] // Captures stdout for the path, and stderr for errors
    });

    // Explicitly catch if it failed (e.g., not a git repository)
    if (gitQuery.error || gitQuery.status !== 0) {
        console.error(`💥 Error: Could not resolve Git hooks directory. Make sure you are in a git repository.`);
        console.error(gitQuery.stderr ? gitQuery.stderr.trim() : "");
        process.exit(1);
    }

    const hooksDir = gitQuery.stdout.trim();
    const hookPath = path.join(hooksDir, 'pre-commit');
    
    // 2. The bash script that triggers your engine
    const hookScript = `#!/bin/sh\nsynapse\n`;

    // 3. Write the file and make it executable
    fs.writeFileSync(hookPath, hookScript, { mode: 0o755 });
    console.log("✅ Pre-commit hook installed successfully.");
    
  } catch (err) {
    // If git rev-parse fails, they aren't in a git repository
    console.error("💥 Error: hook installation failed:", err);
    process.exit(1);
  }
}

installHook()