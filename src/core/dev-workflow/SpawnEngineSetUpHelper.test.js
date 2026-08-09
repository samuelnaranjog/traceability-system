//@trace SREQ-023A @

import { folderSetUp } from "./SpawnEngineHelper.js";
import fs from 'fs';
import {dirname} from 'path';
import path from 'path'
import os from 'os';
import { execSync} from "child_process";


import GWO from './DevWorkflowOperations.js';
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

        // ==========================================
        // INJECTED LINKED WORKTREE SETUP
        // ==========================================
        
        
        // 1. Define paths parallel to the 'main' directory inside the sandbox
        const req023Path = path.join(sandboxRoot, 'req023');
        const featureXPath = path.join(sandboxRoot, 'feature-x');

        // 2. Execute Git's native worktree add command from the main repo
        // Syntax: git worktree add <absolute-path> -b <new-branch-name>
        execSync(`git worktree add "${req023Path}" -b req023`, { cwd: mainRepoPath, stdio: 'ignore' });
        execSync(`git worktree add "${featureXPath}" -b feature-x`, { cwd: mainRepoPath, stdio: 'ignore' });

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

    test('Engine Set Up: Folder with prefix is created, main worktree and linked wortrees moved', () => {
    // Alter the state
    folderSetUp(expectedPrefix, mainRepoPath);

    // New expected paths
    const newMainPath = path.join(wtParentDirectory, 'main');
    const newReqPath = path.join(wtParentDirectory, 'req023');
    const newFeatPath = path.join(wtParentDirectory, 'feature-x');


    // Main achor Assertion
    const isParentPrexAfter = GWO.isParentPrefix(expectedPrefix, newMainPath);

    expect(dirname(newMainPath)).toBe(wtParentDirectory);
    expect(isParentPrexAfter).toBe(true);

    // Linked trees assertion
    expect(dirname(newReqPath)).toBe(wtParentDirectory);
    expect(dirname(newFeatPath)).toBe(wtParentDirectory);
        
    // Final check to ensure the OS actually sees the new files
    expect(fs.existsSync(newReqPath)).toBe(true);
    expect(fs.existsSync(newFeatPath)).toBe(true);
});

})
