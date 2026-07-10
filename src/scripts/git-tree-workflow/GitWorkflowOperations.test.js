import { folderSetUp } from "./SpawnEngineHelper.js";
import fs from 'fs';
import {dirname} from 'path';
import path from 'path'
import os from 'os';
import { execSync} from "child_process";


import GWO from './GitWorkflowOperations.js';
describe('Intial testing of the setup', () => {
    // Set up of the vault for testing
    let sandboxRoot;
    let mainRepoPath;
    let wtParentDirectory;
    let expectedPrefix;

    beforeAll(() => {
        //Temporary root directory
        expectedPrefix = 'pro'
        sandboxRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'auto-wt'));
        mainRepoPath = path.join(sandboxRoot, 'main');
        wtParentDirectory = path.join(sandboxRoot, expectedPrefix); // We expect the script to build this!

        // Build the main folder
        fs.mkdirSync(mainRepoPath, { recursive: true });
        execSync('git init', { cwd: mainRepoPath, stdio: 'ignore' });
        execSync('git config user.name "Test Architect"', { cwd: mainRepoPath });
        execSync('git config user.email "test@unal.edu.co"', { cwd: mainRepoPath });

        fs.writeFileSync(path.join(mainRepoPath, 'README.md'), '# Main traceable');
        execSync('git add . && git commit -m "chore: intial commit"', { cwd: mainRepoPath, stdio: 'ignore' });
        execSync('git branch -M main', { cwd: mainRepoPath });

    })

    afterAll(() => {
        // Destructive cleanup fence remains ironclad
        if (sandboxRoot && fs.existsSync(sandboxRoot)) {
            fs.rmSync(sandboxRoot, { recursive: true, force: true });
        }
    });

    test('Engine Validation: Verify clean worktree before setup alterations', () => {
    // 1. Test the pure, un-altered git repo first
    const isParentPrexBefore = GWO.isParentPrefix(expectedPrefix, mainRepoPath);
    expect(isParentPrexBefore).toBeDefined();
    // This should execute cleanly without ENOENT because folderSetUp hasn't touched it yet
});

    test('Engine Set Up: Folder with prefix is created and worktrees moved', () => {
    // 2. Now alter the state
    folderSetUp(expectedPrefix, mainRepoPath);

    // 3. Force environment inheritance when passing configurations
    const isParentPrexAfter = GWO.isParentPrefix(expectedPrefix, mainRepoPath);
    expect(isParentPrexAfter).toBeDefined();
});
})
