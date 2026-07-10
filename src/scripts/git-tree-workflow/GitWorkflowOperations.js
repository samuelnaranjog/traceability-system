// Project Root path
import appRoot from "app-root-path";
import { basename, dirname, parse} from "node:path";
import path from 'path'
import { mkdir, readdir, rename, symlink, unlink } from "node:fs";
import { config, cwd } from "node:process";
import { spawn, execSync, spawnSync } from "node:child_process";
import * as readline from "node:readline/promises";

/*cr
 * @typedef {string} prefix - The project prefix id
 * @typedef {string} path - Valid absolute path
*/

/**
 * @typedef {object} gitWorkTreeScriptConfig
 * @property {string} markdownEditorFolderPath - Folder path of the symlink folder
 * @property {string} projectPrefix - The unique prefix identfier for the project
 * @property {string} prefixFolderPath - The folder path to the prefix folder once created
 */
export default class GitWorkflowOperations{

    /** 
     *  @description Find the current worktree dir path
     *  @param {path} customPath - The path of the worktree or subfolder from which you want to find the aboslute path
     *  @returns {path} The path of the worktree were the command was launched
    */
    static findWorktreePath(customPath = process.cwd()){

        try{
        // Get the current worktree path 

        
            const currentDirectory = spawnSync('git', ['rev-parse', '--show-toplevel'], {
            cwd: customPath,
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'ignore'] // Drops stderr to prevent clutter
        });

        // 1. Check if the system failed to spawn the binary completely (ENOENT)
if (!currentDirectory || currentDirectory.error) {
    const errorMsg = currentDirectory?.error?.message || 'Unknown system spawning error';
    throw new Error(`Git binary execution failed. OS Error: ${errorMsg}`);
}

// 2. Check if Git ran but returned a non-zero exit code (e.g., not a git repo)
if (currentDirectory.status !== 0 || !currentDirectory.stdout) {
    throw new Error(`Git worktree resolution failed. System exit code: ${currentDirectory.status}`);
}

        const currentPath = currentDirectory.stdout.trim();
        
        console.log('Current dir found at findWorkTreePath: ', currentPath) // uncoment to debug

        

        return currentPath;

        }
        catch (error) {
            console.error('❌ The current cli open dir or custom path is not part of a valid worktree.', error.message);
            // console.error(error.message); // Uncomment to debug the exact Git failure
            process.exit(1);
        }
    }
    /**
     * @description 1 argument: checks the existence of a specified prefix parent dir for the tree from the cli script was launched
     * @description 2 arguments: checks the existence of a specified prefix parent dir for the tree from the custom path specifed
     * @param {gitWorkTreeScriptConfig.projectPrefix} prefix
     * @param {path} customPath - The path where you want to figure out if the parent dir is the prefix
     * @returns {Boolean} - True if parent with prefix exist. False whe it does not
     */

    
    static isParentPrefix (prefix, customPath = process.cwd()){
        
        if (typeof customPath !== 'string') {
        console.error('❌ The customPath passed to isParentPrefix must be a string.');
        return false;
        }
        
        try{
        // 1. Get the current worktree path 
         const currentPath = this.findWorktreePath(customPath)
        
        // 2.  Get the parent path of the worktree 
        const parentPath = dirname(currentPath);
        console.log(`Parent absolute path: ${parentPath}`); // uncoment to debug

        // 3. Figure out the parent name
        const parentFolderName = basename(parentPath);

        //4. Compare to the prefix and define if is prefix or not
        if(parentFolderName == prefix){
            return true;
        }
        else {
            return false;
        }

        } catch(error) {
            console.error(`❌ Fail to find the parent with the expected prefix, path argument passed ${customPath} `, error.message);
            // console.error(error.message); // Uncomment to debug the exact Git failure
        }

        
        
    }

    /** 
     * @param {prefix} prefix
     * @param {path} customPath - The path of current worktree
     * @returns {path} - Path to the prefix directory
     * 
    */
    static createPrefixFolder(prefix, customPath = process.cwd()){
        //Consider this is run from the main tree folder

        /** 
         * 1. Create the prefix folder:
         * - Find the parent of the Main tree
         * - Create the folder with its prefix
         */ 


        // Finding the parent
        
        const mainBranchParentFolderPath = this.findMainWorkTreePathParent(customPath);

        //Create the folder
        const newPrefixDir = path.join(mainBranchParentFolderPath, prefix);
        try{
            mkdir(newPrefixDir);

            console.log(`Successfully created: ${newPrefixDir}`);
        }
        catch(error){
            console.error('The prefix folder creation failed', error.message)
            process.exit(1);
        }

        return newPrefixDir;

    }

    /**
     * Run from a valid worktree to work properly
     * @param {path} customPath - The path of the worktree or subfolder from which you want to find the main worktree
     * @returns {path} Main work-tree absolute path
     */
    static findMainWorkTreePath(customPath = process.cwd()){

        // NOTE: this should be run form one of the worktrees that the precondition or its nested folders
        
            try{
            // Finding the parent by using worktree listing
        const result = spawnSync('git', ['worktree', 'list'],{ cwd: customPath, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore']})// takes command and flags

        if (!result || result.status !== 0 || !result.stdout) {
            return null;
        }
        
        const gitOutputlines = result.stdout.toString('utf8').trim().split('\n');;

        /**
         * Git outputs  in each line the next format: path, hash, branch name
         * Example: 
         * "/Users/s_n_gr/Documents/My-Engineering-projects/traceability_system  17d7551 [main]
         *  /Users/s_n_gr/Documents/My-Engineering-projects/tso/req023           17d7551 [req023]"
         */

        console.log(`DEBUG: In FindMainWorktree 'git', ['worktree', 'list'] output is: ${JSON.stringify(gitOutputlines)}` ) // Uncoment to debug
        

        mainLine = gitOutputlines.find(line => line.includes('[main]') || line.includes('(main)'));

        if(!mainLine){
            return null;
        }
        
        const mainLineParts = mainLine.split(/\s+/) // Split the line in white spaces

        console.log(`DEBUG: In FindMainWorktree array of main line output is: ${JSON.stringify(mainLineParts)}` ) // Uncoment to debug
        
        let mainBranchPath;
        if(mainLineParts.length >= 2 && mainLineParts[2] === "[main]"){
            console.log(`DEBUG: passed condition!!` ) // Uncoment to debug
            mainBranchPath = mainLineParts[0];
        }

        console.log(`DEBUG: In FindMainWorktree the main branch path is: ${mainBranchPath}` ) // Uncoment to debug


        if(!mainBranchPath){
            return null;
        }
        
        return mainBranchPath

        }catch(error){
            console.error('Failed to find the main work tree path:', error.message)
        }
        
        
 
    }

    /**
     * Runs from a valid worktree to work properly
     * @param {path} customPath - The path of a valid worktree or subfolder from which you want to find the main worktree parent
     * @returns {path} The absolute path of the parent folder of the main branch and principal worktree
     */

      static findMainWorkTreePathParent(customPath = process.cwd()){
        // NOTE: this should be run form one of the worktrees that the precondition or its nested folders

        const mainTreePath = this.findMainWorkTreePath(customPath)

        // Find and return parent folder path
        const mainBranchParentFolderPath = dirname(mainTreePath);

        return mainBranchParentFolderPath
      }

    /**
     * Move the worktrees to the prefix folder when they are not there
     * @param {prefix} prefix 
     * @param {path} prefixDirPath - The absolute path to the parent folder for the current working worktrees to move trees there
     */

    static moveTreesToParent(prefix, prefixDirPath, customPath){
        /**
         * - Scan all wortrees and populate the set with paths
         * - check each path parent 
         * - handle the bool answer:
         *      * true: is okey let it there
         *      * false: move the tree to the prefix folder
         */

        const workTreePaths = new Set();

        try{
        // 1. Scan all worktrees and append to the set
        //Worktree listing for tree path collection
        const git = spawn('git', ['worktree', 'list'],{ cwd: customPath})// takes command and flags

        const gitOutput = readline.createInterface({ input: git.stdout }); 
        /**
         * Git outputs  in each line the next format: path, hash, branch name
         * Example: 
         * "/Users/s_n_gr/Documents/My-Engineering-projects/traceability_system  17d7551 [main]
         *  /Users/s_n_gr/Documents/My-Engineering-projects/tso/req023           17d7551 [req023]"
         */

            gitOutput.on('line', (line) => {
            const lineParts = line.split(/\s+/) // Split the line in white spaces

            console.log(`DEBUG: New array of worktree list: ${lineParts}`); // Uncoment to debug
            //Append the path
            if(lineParts[0]){

                workTreePaths.add(lineParts[0]);
                console.log(`DEBUG: Adding new tree path: ${lineParts[0]}`); // Uncoment to debug
            }
            else{
                throw new Error('Work-tree path not found');
            }
        })
        }
        catch(error){
            console.error('❌ fail to collect tree paths', error.message)
            process.exit(1);
        }
        
        // 2. Check each tree parent path and handle the movement
        /*
        for (const path of workTreePaths) {
            const bool = this.isParentPrefix(prefix, path);
            if (bool == false) {
                try {
                    rename(path, prefixDirPath)
                    console.log(`Successfully move dir ${path} to the dir ${prefixDirPath} `);
                }
                catch (error) {
                    console.error(`Failed to move the main branch at: ${mainBranchPath} to  dir ${newPrefixDir}`, error.message)
                    process.exit(1);
                }
            }
        }
        */
    }
    /**
     * 
     * @param {path} absolutePrefixPath - Must be the path of the prefix folder
     * @param {string} artifactName - Lower case artifact prefix and identifier num
     * @returns {path} Absolute path of the new tree dir
     */
    static createWorkTree(absolutePrefixPath, artifactName){

        try{
            const workTreePath = path.join(absolutePrefixPath, artifactName)
            execSync(`git worktree add ${workTreePath} ${artifactName}`, {
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'ignore'] // Prevents git errors from leaking to console if run outside a repo
            })
        }
        catch(err){
            console.error(`❌ Fail to create the new worktree: ${workTreePath}`, err.message)
            process.exit(1);
        }            

            console.log('New worktree successfully created at:', workTreePath ); // Uncoment for success message
            return workTreePath;
    }

    /**
     * 
     * @param {path} editorProjectFolder - Path to the folder that should contain the symlink connection to the worktree
     * @param {path} workTreePath - Path to the worktree that should be linked to the markdown editor
     */
     static  updateSymlink(editorProjectFolder, workTreePath){

        /** 
         * 1. Detach the symlink in the folder:
         * - Handle the edge case where multiple symlink are present in the markdwon editor
         * - Unlink the symlink present
         * 
        */ 
        try{
            const symlinksListing = readdir(editorProjectFolder, { withFileTypes: true })
            const symlinkFiltered = symlinksListing.filter(entry => entry.isSymbolicLink()) // Build an array of only symlinks
            const symlinkCount = symlinkFiltered.length; // Find the number of symlinks in the editor folder

            //Handeling multiple symlink conflict
            if(symlinkCount > 1){
                throw new Error (`Your markdown editor dir: ${editorProjectFolder} should only contain one symlink, manually fix the conflict`)
            }

            const currentSymlinkPath = path.join(symlinkFiltered[0].path,symlinkFiltered[0].name )
            // unlink the present symlink
            unlink(currentSymlinkPath);
        }
        catch(err){
            console.error(`❌ Fail to detach the symlink `, err.message)
            process.exit(1);
        }
        

        /**
         * 2. Create the new symlink
         */

        try{
            const docsTreePath = path.join(workTreePath, 'docs')
            const docsEditorPath = path.join(editorProjectFolder, 'docs')// the new folder docs that will have the symlink
            symlink(docsTreePath, editorProjectFolder)
        }
        catch(err){
            console.error(`❌ Fail to create the new symlink connection for the tree: ${workTreePath}`, err.message)
            process.exit(1);
        }
        
    }
    static launchVSCode(targetPath) {
        const absolutePath = path.resolve(targetPath);
        let command;
        let args;

        // Define the exact binary and arguments per OS
        if (process.platform === 'win32') {
            command = 'cmd.exe';
            args = ['/c', 'code', absolutePath];
        } else if (process.platform === 'darwin') {
            command = 'open';
            args = ['-a', 'Visual Studio Code', absolutePath];
        } else {
            command = 'code';
            args = [absolutePath];
        }

        // Spawn the process 
        const child = spawn(command, args, {
            detached: true,
            stdio: 'ignore' // Ignore standard input/output so Node doesn't wait for it
        });

        //Handle errors in process gracefully
        child.on('error', (err) => {
             console.error(`❌ Fail to start VS Code. Error: ${err.message}`);
   
        });

        // Unreference the child process so Node can exit while VS Code stays open
        child.unref();

        console.log(`Launched VS Code for: ${absolutePath}`);

    }
    
    /**
     * @param {string} configName - Config file name
     */
    static validateConfigPresence(configName){
        const worktreeFolder = this.findWorktreePath()
        const items = readdir(worktreeFolder, {withFileTypes: true});
        const files = items.filter(item => item.isFile())

    
        let path = undefined;
        let hasConfig;
        const configFile = files.find(file => {file.name == configName})
        
        if(configFile){
            hasConfig = true
            path = path.join(configFile.path, configFile.name)
        }
        else {
            hasConfig = false;
        }

        return [hasConfig, path];
    }

    /**
     * @Description Creates a config file in the worktree folder, of course only if run from a valid worktree or worktree subfolder 
     * @param {string} configName - Config file name
     * @returns {path} Path to the created config file
     */
    static createConfigFile(configName){
        const worktreePath = this.findWorktreePath()
        const newFilePath = path.join(worktreePath, configName)
        
        try{
        fs.writeFileSync(newFilePath, '')
        console.log('File created successfully!');
        retur
        } catch (err) {
            console.error('Failed to create file:', err);
        }
    }
    /**
     * @description When the property does not exist or is empty this method will ask the user to fill it, when it does have data then it will simply let the property untouched
     * @param {*} property 
     * @param {*} absolutePath
     * @returns 
     */
    static setUpPropertiesOfConfig(property, absolutePath){
        // Check if property in file contains data
        try {
            const configData  = fs.readFile(absolutePath, 'utf8');
        } catch (error) {
             console.error(`Fail to access the config file ${absolutePath}`, error)
        }
        
        let configJSON;
        try{
            configJSON = JSON.parse(configData);
        } catch (err){
                console.error('Fail to parse the config data')
        }

        const jsonProp = configJSON.gitWorkTreeScriptConfig[property]
        if (!jsonProp || jsonProp == '') {

            const rl = readline.createInterface({ input, output });

            try {
                // This pauses execution until the user hits 'Enter'
                const answer = rl.question(`What is you project ${property}`);

                jsonProp = answer // Add the new property data to the json config object

                // Write the config with the new data
                fs.writeFile(absolutePath, configJSON);

                //console.log(`Added to the config file ${answer}`); //Uncoment to debug

            } catch(err){
                console.error(`❌ Fail to set up the config property  ${err.message}`);
            } 
            finally {
                rl.close(); // Crucial to prevent your script from hanging open
            }
        }
        else{
            return;
        }

    }

    static accessPropertiesOfConfig(property, absolutePath){
        try {
            const configData  = fs.readFile(absolutePath, 'utf8');
        } catch (error) {
             console.error(`Fail to access the config file ${absolutePath}`, error)
        }

        let configJSON;
        try{
            configJSON = JSON.parse(configData);
        } catch (err){
                console.error('Fail to parse the config data')
        }

        const jsonProp = configJSON.gitWorkTreeScriptConfig[property]
        return jsonProp;
    }

    //static updateConfig()
}


