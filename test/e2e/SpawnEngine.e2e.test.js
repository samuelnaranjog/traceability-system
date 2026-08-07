// @trace REQ-023 @
import os from 'os';
import fs from 'fs'
import { spawn, spawnSync } from 'child_process';
import { execSync } from 'child_process';
import path, { basename } from 'path';
import { error } from 'console';
import { jest } from '@jest/globals';

/**
 * Resolves a path safely across all OS environments, handling macOS temp directory 
 * symlinks and Windows separators, without throwing ENOENT if the path doesn't exist yet.
 */
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

describe('Integration test with the most important command flags of the `spawn` local orchestrator of worktrees', () => {


    let mainRepoPath;
    let sandboxRoot;
    let expectedPrefix;
    let mdEditor;
    let mainDocs;
    



    beforeEach(() => {
        

        //Temporary root directory

        sandboxRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pro'));
        expectedPrefix = basename(sandboxRoot);
        mainRepoPath = path.join(sandboxRoot, 'main');
        mainDocs = path.join(mainRepoPath, 'docs') // the docs folder which is linked in the symlink connection

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

    afterEach(() => {
        // Clean up the main sandbox directory (which includes mainRepoPath and the .git folder)
        if (sandboxRoot && fs.existsSync(sandboxRoot)) {
            fs.rmSync(sandboxRoot, { recursive: true, force: true });
        }

        // Clean up the markdown editor temporary directory
        if (mdEditor && fs.existsSync(mdEditor)) {
            fs.rmSync(mdEditor, { recursive: true, force: true });
        }

        
    })

    test('Git Worktree Creation  & Symlink Connection To The Markdown Editor Update', (done) => {
        const scriptPath = path.resolve(import.meta.dirname, '../../src/core/dev-workflow/SpawnEngine.js')

        const child = spawn('node', [scriptPath, 'req023', '-s'], {
            cwd: mainRepoPath,
            stdio: ['pipe', 'pipe', 'pipe'] // This guarantees the streams exist
        });

        let streamBuffer = '';
        let errorOutput = '';


        // Ghost Typist

        child.stdout.on('data', (data) => {
            const text = data.toString();
            console.log(`CHILD LOG: ${text}`);
            streamBuffer += text;

            if (streamBuffer.includes('What is your project projectPrefix')) {
                child.stdin.write(`${expectedPrefix}\n`);
                streamBuffer = '';
            }

            if (streamBuffer.includes('What is your project markdownEditorFolderPath')) {
                child.stdin.write(`${mdEditor}\n`);
                streamBuffer = '';
            }
        });

        child.stderr.on('data', (data) => {
            const text = data.toString()
            console.log('ERROR: ', text);
            errorOutput += text
        });
        // 4. Wait for the engine to cleanly exit
        child.on('close', (code) => {
            try {
                

                if (code !== 0) {
                    console.error("SCRIPT CRASHED. Error Output:\n", errorOutput);
                }

                // Check for crash
                expect(code).toBe(0);

                // Check new wortree creation
                const createdTree = getCanonicalPath(path.join(sandboxRoot, 'req023'));
                const isTreecreated = fs.existsSync(createdTree);
                expect(isTreecreated).toBe(true)

                // Check the symlink
                // Reconstruct your expected paths
                const symlinkPath = path.join(mdEditor, 'docs');
                const expectedTarget = path.join(sandboxRoot, 'req023', 'docs');

                // Validate the symlink exists before attempting to read it
                const isSymlink = fs.existsSync(symlinkPath) || (fs.existsSync(mdEditor) && fs.lstatSync(symlinkPath).isSymbolicLink());
                expect(isSymlink).toBe(true);

                // Read the raw string the OS wrote inside the symlink
                const actualTarget = fs.readlinkSync(symlinkPath);

                // Compare using the cross-platform canonical path resolver
                expect(getCanonicalPath(actualTarget)).toBe(getCanonicalPath(expectedTarget));

                // Finish successfully
                done();
            } catch (error) {
                // Catch assertion errors so we don't get a Phantom Pass
                done(error);
            }
        });

    }, 5000);

    test('Git Worktree Creation  & VS Code CLI open & Config File Already Created', (done) => {
        // Create the config file to avoid readline.questions
        const configMockData = {
                    gitWorkTreeScriptConfig:{
                    markdownEditorFolderPath: mdEditor,
                    projectPrefix: expectedPrefix      
                    }
                    };

        const configlocation = path.join(mainRepoPath, 'system-config.json')
        fs.writeFileSync(configlocation, JSON.stringify(configMockData))
        
        // Check actual data has been written 
        fs.openSync(configlocation)

        const scriptPath = path.resolve(import.meta.dirname, '../../src/core/dev-workflow/SpawnEngine.js')


        const child = spawn('node', [scriptPath, 'req023', '-c'], {
            cwd: mainRepoPath,
            stdio: ['pipe', 'pipe', 'pipe'] // This guarantees the streams exist
        });
        let outputData = ''
        child.stdout.on('data', (data) => {
            text = data.toString()
            console.log(`CHILD LOG: ${text}`);
            outputData += text ;
        })

        let errorOutput;
        child.stderr.on('data', (data) => {
            const text = data.toString()
            console.log('ERROR: ', text);
            errorOutput += text
        });
    
        //Set up expectations based on the current platform running the test
        let expectedCommand;
        let expectedArgs;
        const expectedTarget = path.join(sandboxRoot, 'req023');

        if (process.platform === 'win32') {
            expectedCommand = 'cmd.exe';
            expectedArgs = ['/c', 'code', expectedTarget];
        } else if (process.platform === 'darwin') {
            expectedCommand = 'open';
            expectedArgs = ['-a', 'Visual Studio Code', expectedTarget];
        } else {
            expectedCommand = 'code';
            expectedArgs = [expectedTarget];
        }



         child.on('close', (code) => {
            try {
                if (code !== 0) {
                    console.error("SCRIPT CRASHED. Error Output:\n", errorOutput);
                }

                // Check for crash
                expect(code).toBe(0);

                expect(outputData).toContain(`Launched VS Code for: ${getCanonicalPath(expectedTarget)}`);
                // Finish successfully
                done();
            } catch (error) {
                // Catch assertion errors so we don't get a Phantom Pass
                done(error);
            }
        });
        
    });
})





