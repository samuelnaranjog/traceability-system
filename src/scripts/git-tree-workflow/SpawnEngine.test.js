import os from 'os';
import fs from 'fs'
import { spawn, spawnSync } from 'child_process';
import { execSync } from 'child_process';
import path from 'path';

describe('Integration test with command flags of the spawn local orchestrator of worktrees', ()=>{
    let mainRepoPath;
    let sandboxRoot;
    let expectedPrefix;
    let mdEditor;

    beforeAll(() => {

        //Temporary root directory
        expectedPrefix = 'pro'
        sandboxRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pro'));
        mainRepoPath = path.join(sandboxRoot, 'main');

        // Build the main folder
        fs.mkdirSync(mainRepoPath, { recursive: true });
        execSync('git init', { cwd: mainRepoPath, stdio: 'ignore' });
        execSync('git config user.name "Test Architect"', { cwd: mainRepoPath });
        execSync('git config user.email "test@unal.edu.co"', { cwd: mainRepoPath });

        fs.writeFileSync(path.join(mainRepoPath, 'README.md'), '# Main traceable');
        execSync('git add . && git commit -m "chore: intial commit"', { cwd: mainRepoPath, stdio: 'ignore' });
        execSync('git branch -M main', { cwd: mainRepoPath });

        // Build the folder that should handle the symlink
        mdEditor = fs.mkdtempSync(path.join(os.tmpdir(), 'traceability-system'));
    })

    afterAll(() => {
        // Clean up the main sandbox directory (which includes mainRepoPath and the .git folder)
        if (sandboxRoot && fs.existsSync(sandboxRoot)) {
            fs.rmSync(sandboxRoot, { recursive: true, force: true });
        }

        // Clean up the markdown editor temporary directory
        if (mdEditor && fs.existsSync(mdEditor)) {
            fs.rmSync(mdEditor, { recursive: true, force: true });
        }
    });

    test('Git Tree Workflow & Symlink Connection To The Markdown Editor Update', (done) => {
        const scriptPath = path.resolve('./src/scripts/git-tree-workflow/SpawnEngine.js');
        
        // Engine launch
        const child = spawn('node', [scriptPath, 'req023', '-s'], { 
            cwd: mainRepoPath, 
            stdio: ['pipe', 'pipe', 'pipe'] // This guarantees the streams exist
        });

        let output = '';
        let errorOutput = '';

        // Ghost Typist
        child.stdout.on('data', (data) => {
            console.log(`CHILD LOG: ${data.toString()}`); // uncoment to debug
            
            const text = data.toString();
            output += text;

            if (text.includes('What is you project projectPrefix')) {
                child.stdin.write(`${expectedPrefix}\n`);
            }

            if (text.includes('What is you project markdownEditorFolderPath')) {
                child.stdin.write(`${mdEditor}\n`);
            }
        });

        child.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        // 4. Wait for the engine to cleanly exit
        child.on('close', (code) => {
            try {
                if (code !== 0) {
                    console.error("SCRIPT CRASHED. Error Output:\n", errorOutput);
                }

                // Check for crash
                expect(code).toBe(0);

                // Check the symlink
                const expectedTarget = path.join(sandboxRoot, 'req023');
                const symlinkPath = path.join(mdEditor, 'docs');

                const stats = fs.lstatSync(symlinkPath);
                expect(stats.isSymbolicLink()).toBe(true);

                const actualTarget = fs.readlinkSync(symlinkPath);
                expect(path.resolve(actualTarget)).toBe(path.resolve(expectedTarget));

                // Tell Jest we finished successfully
                //done(); 
            } catch (error) {
                // Catch Jest assertion errors so we don't get a Phantom Pass
                done(error); 
            }
        });
    });
})