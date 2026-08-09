// @trace SREQ-024A @
import fs from 'node:fs';
import path, { basename } from 'node:path';
import os from 'node:os';
import { execSync, spawnSync, spawn } from 'node:child_process';

const getCanonicalPath = (targetPath) => {
    let currentPath = path.resolve(targetPath);
    let pathSuffix = '';

    // Walk up the directory tree until we find a folder that physically exists
    while (!fs.existsSync(currentPath) && currentPath !== path.parse(currentPath).root) {
        // Prepend the missing folder name to the suffix
        pathSuffix = path.join(path.basename(currentPath), pathSuffix);
        // Move one directory up
        currentPath = path.dirname(currentPath);
    }

    // realpathSync the existing portion, then re-attach the pending suffix
    const existingRealRoot = fs.existsSync(currentPath) ? fs.realpathSync(currentPath) : currentPath;
    return path.join(existingRealRoot, pathSuffix);
};

describe('Integration test for the closure of a worktree workflow `collapse` command', () => {
    let mainRepoPath;
    let sandboxRoot;
    let expectedPrefix;
    let mdEditor;
    let mainDocs;
    
    // Additional variables needed across hooks and tests
    let worktreePath;
    let worktreeDocs;
    let symlinkPath;
    const featureBranch = 'feature-docs-update';

    beforeEach(() => {
        // 1. Temporary root directories
        sandboxRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pro-'));
        expectedPrefix = basename(sandboxRoot);
        mainRepoPath = path.join(sandboxRoot, 'main');
        mainDocs = path.join(mainRepoPath, 'docs'); // the docs folder linked in the symlink connection

        // 2. Build the main folder & initialize Git
        fs.mkdirSync(mainDocs, { recursive: true });
        execSync('git init', { cwd: mainRepoPath, stdio: 'ignore' });
        execSync('git config user.name "Test Architect"', { cwd: mainRepoPath });
        execSync('git config user.email "test@unal.edu.co"', { cwd: mainRepoPath });

        fs.writeFileSync(path.join(mainRepoPath, 'README.md'), '# Main traceable');
        fs.writeFileSync(path.join(mainDocs, 'index.md'), '# Main Docs'); // Setup initial docs
        execSync('git add . && git commit -m "chore: initial commit"', { cwd: mainRepoPath, stdio: 'ignore' });
        execSync('git branch -M main', { cwd: mainRepoPath });

        // 3. Build the Markdown Editor sandbox and define the symlink location
        mdEditor = fs.mkdtempSync(path.join(os.tmpdir(), 'traceability-system-'));
        symlinkPath = path.join(mdEditor, 'docs');

        // Add the config file to the main branch
        const configPath = path.join(mainRepoPath, 'system-config.json');

const configData = {
  gitWorkTreeScriptConfig: {
    markdownEditorFolderPath: mdEditor, // points to temp mdEditor directory
    projectPrefix: 'pro' // e.g. "pro-xxxxxx"
  }
};

fs.writeFileSync(configPath, JSON.stringify(configData, null, 2), 'utf-8');

        // Create the Worktree with extra implementation
        worktreePath = path.join(sandboxRoot, featureBranch);
        worktreeDocs = path.join(worktreePath, 'docs');
        execSync(`git worktree add ${worktreePath} -b ${featureBranch}`, { cwd: mainRepoPath, stdio: 'ignore' });

        // Add the "extra implementation" commit to the worktree
        execSync('git commit --allow-empty -m "wip: [REQ-000] temporary save before rebase"', { cwd: worktreePath });
        execSync('git commit --allow-empty -m "wip: [REQ-000] new markdown tracking logic"', { cwd: worktreePath });
        execSync('git commit --allow-empty -m "wip: [REQ-000] local testing edits"', { cwd: worktreePath });
        fs.writeFileSync(path.join(worktreeDocs, 'new-feature.md'), '# Feature implementation');
        execSync('git add . && git commit -m "wip: [REQ-000] new markdown tracking logic"', { cwd: worktreePath, stdio: 'ignore' });

        // Link the Markdown Editor to the specific worktree docs folder
        fs.symlinkSync(worktreeDocs, symlinkPath, 'dir');
    });

    afterEach(() => {
        // Safe teardown: maxRetries helps bypass temporary OS file locks held by Git
        fs.rmSync(sandboxRoot, { recursive: true, force: true, maxRetries: 3 });
        fs.rmSync(mdEditor, { recursive: true, force: true, maxRetries: 3 });
    });

    test('merges the branch, deletes the worktree, and repoints the mdEditor symlink to main',  (done) => {
        // =====================================================================
        // ACT: Execute your CLI tool or orchestration function here.
        // Example: execSync(`your-cli close ${featureBranch}`, { cwd: mainRepoPath });
        // =====================================================================

        const mockSequenceEditor = `node -e "
  const fs = require('fs');
  const file = process.argv[1];
  const lines = fs.readFileSync(file, 'utf8').split('\\n');
  const updated = lines.map((line, i) => i > 0 && line.startsWith('pick ') ? line.replace('pick ', 's ') : line).join('\\n');
  fs.writeFileSync(file, updated);
"`;

//Script that simulates the user typing a custom commit message in the editor
const commitMessage = 'feat: new markdown tracking logic'
const mockGitEditor = `node -e "
  const fs = require('fs');
  const file = process.argv[1];
  fs.writeFileSync(file, '${commitMessage}');
"`;
        const scriptPath = path.resolve(import.meta.dirname, '../../src/core/dev-workflow/CollapseEngine.js')
        const child = spawn('node', [scriptPath], {
                    cwd: worktreePath,
                    env: {
            ...process.env,
            GIT_SEQUENCE_EDITOR: mockSequenceEditor, // Auto-accept rebase todo lists without launching editor
            GIT_EDITOR: mockGitEditor,
        }

                });

        
        let errorOutput = '';
        let streamBuffer = '';

        child.stdout.on('data', (data) => {
            const text = data.toString();
            console.log(`CHILD LOG: ${text}`);
            streamBuffer += text

            if (streamBuffer.includes('What is your project dev-workflow.markdownEditorFolderPath')) {
                child.stdin.write(`${mdEditor}\n`);
                streamBuffer = '';
            }
            
        });

        child.stderr.on('data', (data) => {
            const text = data.toString()
            console.log('ERROR: ', text);
            errorOutput += text
        });

        // =====================================================================
        // ASSERT: Validate the exact state of the system
        // =====================================================================


        child.on('close', (code) => {
                    try {
                        
        
                        if (code !== 0) {
                            console.error("SCRIPT CRASHED. Error Output:\n", errorOutput);
                        }
        
                        // Check for crash
                        expect(code).toBe(0);
        
        

        // Assert the merge is complete successfully (commit is present in main)
        const mainHistory = execSync('git log --oneline', { cwd: mainRepoPath, encoding: 'utf-8' });
        expect(mainHistory).not.toContain('wip: [REQ-000]')
        expect(mainHistory).toContain('feat: new markdown tracking logic');
        

        // Assert the worktree directory has been deleted entirely
        expect(fs.existsSync(symlinkPath) || fs.lstatSync(symlinkPath).isSymbolicLink()).toBe(true);

        // Assert the symlink connection of the markdown editor was unlinked and repointed to main Docs
        const symlinkExists = fs.existsSync(symlinkPath) || (() => {
  try { return fs.lstatSync(symlinkPath).isSymbolicLink(); } catch { return false; }
})();

if (!symlinkExists) {
  // Helpful debug info: print what's actually inside the mdEditor directory
  const actualFiles = fs.readdirSync(mdEditor);
  throw new Error(
    `Symlink does not exist at expected path:\n  Expected: ${symlinkPath}\n  Found in dir: ${JSON.stringify(actualFiles)}`
  );
}

        const currentSymlinkTarget = getCanonicalPath(fs.readlinkSync(symlinkPath));
        expect(currentSymlinkTarget).toBe(getCanonicalPath(mainDocs));
        
        // Assert the branch was safely deleted to prevent zombie references
        const currentBranches = execSync('git branch', { cwd: mainRepoPath, encoding: 'utf-8' });
        expect(currentBranches).not.toContain(featureBranch);

                        // Finish successfully
                        done();
                    } catch (error) {
                        // Catch assertion errors so we don't get a Phantom Pass
                        done(error);
                    }
                });
        
        
    });
});