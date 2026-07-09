// Project Root path
import appRoot from "app-root-path";
import { basename, dirname, parse, path } from "node:path";
import { mkdir, readdir, rename, symlink, unlink } from "node:fs";
import { config, cwd } from "node:process";
import { spawn } from "node:child_process";

/**
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
     *  @returns {path} The path of the worktree were the command was launched
    */
    static findWorktreePath(){

        try {
            const currentDirectory = execSync('git rev-parse --show-toplevel', {
                encoding: 'utf8',
                stdio: ['ignore', 'pipe', 'ignore'] // Prevents git errors from leaking to console if run outside a repo
            }).trim();

            if (!currentDirectory) {
                throw new Error('Git command returned an empty path.');
            }

            return currentDirectory;
        }
        catch (error) {
            console.error('❌ The current cli open folder is not part of a valid worktree.', error.message);
            // console.error(error.message); // Uncomment to debug the exact Git failure
        }
    }
    /**
     * @description 1 argument: checks the existence of a specified prefix parent dir for the tree from the cli script was launched
     * @description 2 arguments: checks the existence of a specified prefix parent dir for the tree from the custom path specifed
     * @param {gitWorkTreeScriptConfig.projectPrefix} prefix
     * @param {path} customPath - The path where you want to figure out if the parent dir is the prefix
     * @returns {Boolean} - True if parent with prefix exist. False whe it does not
     */

    
    static isParentPrefix (prefix, customPath){
        
        

        try{
        // 1. Get the current worktree path 

        // Logic Gate: Script running dir or custom path
        if(!customPath){
        const currentDirectory = execSync('git rev-parse --show-toplevel', {
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'ignore'] // Prevents git errors from leaking to console if run outside a repo
        }).trim();
        }
        else{
            const currentDirectory = execSync('git rev-parse --show-toplevel', {
            cwd: customPath,
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'ignore'] // Prevents git errors from leaking to console if run outside a repo
            }).trim();

        }

        if (!currentDirectory) {
            throw new Error('Git command returned an empty path.');
        }

        // 2.  Get the parent path of the worktree 
        const parentPath = dirname(currentDirectory);
        console.log(`Parent absolute path: ${parentPath}`);

        } catch(error) {
            console.error('❌ The current folder is not part of a valid worktree.');
            // console.error(error.message); // Uncomment to debug the exact Git failure
        }

        // 3. Figure out the parent name
        const parentFolderName = basename(parentPath);

        //4. Compare to the prefix and define if is prefix or not
        if(parentFolderName == prefix){
            return true;
        }
        else {
            return false;
        }
        
    }

    /** 
     * @param {prefix} prefix
     * @param {gitWorkTreeScriptConfig} workTreeConfig
     * @returns {path} - Path to the prefix directory
     * 
    */
    static createPrefixFolder(prefix){
        //Consider this is run from the main tree folder

        /** 
         * 1. Create the prefix folder:
         * - Find the parent of the Main tree
         * - Create the folder with its prefix
         */ 


        // Finding the parent
        
        const mainBranchParentFolderPath = this.findMainWorkTreePathParent();

        //Create the folder
        const newPrefixDir = path.join(mainBranchParentFolderPath, prefix);
        try{
            await mkdir(newPrefixDir);

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
     * @returns {path} Main work-tree absolute path
     */
    static findMainWorkTreePath(){

        // NOTE: this should be run form one of the worktrees that the precondition or its nested folders

        // Finding the parent by using worktree listing
        const git = spawn('git', ['worktree', 'list'])// takes command and flags

        const gitOutput = readline.createInterface({ input: git.stdout }); 
        /**
         * Git outputs  in each line the next format: path, hash, branch name
         * Example: 
         * "/Users/s_n_gr/Documents/My-Engineering-projects/traceability_system  17d7551 [main]
         *  /Users/s_n_gr/Documents/My-Engineering-projects/tso/req023           17d7551 [req023]"
         */

        let mainBranchPath = '';
        gitOutput.forEach(line => {
            const lineParts = line.split(/\s+/) // Split the line in white spaces

            //find main path
            if(lineParts[2] == "main"){
                mainBranchPath = lineParts[0];
            }
        })

        return mainBranchPath

    }

    /**
     * Runs from a valid worktree to work properly
     * @returns {path} The absolute path of the parent folder of the main branch and principal worktree
     */

      static findMainWorkTreePathParent(){
        // NOTE: this should be run form one of the worktrees that the precondition or its nested folders

        //1. Worktree listing
        const git = spawn('git', ['worktree', 'list'])// takes command and flags

        const gitOutput = readline.createInterface({ input: git.stdout }); 
        /**
         * Git outputs  in each line the next format: path, hash, branch name
         * Example: 
         * "/Users/s_n_gr/Documents/My-Engineering-projects/traceability_system  17d7551 [main]
         *  /Users/s_n_gr/Documents/My-Engineering-projects/tso/req023           17d7551 [req023]"
         */

        // 2. Find main tree path
        let mainTreePath = '';
        gitOutput.forEach(line => {
            const lineParts = line.split(/\s+/) // Split the line in white spaces

            //find main path
            if(lineParts[2] == "main"){
                mainTreePath = lineParts[0];
            }
        })

        // 3. Find and return parent folder path
        const mainBranchParentFolderPath = dirname(mainTreePath);

        return mainBranchParentFolderPath
      }

    /**
     * Move the worktrees to the prefix folder when they are not there
     * @param {prefix} prefix 
     * @param {path} prefixDirPath - The absolute path to the parent folder for the current working worktrees to move trees there
     */

    static moveTreesToParent(prefix, prefixDirPath){
        /**
         * - Scan all wortrees and populate the set with paths
         * - check each path parent 
         * - handle the bool answer:
         *      * true: is okey let it there
         *      * false: move the tree to the prefix folder
         */

        // 1. Scan all worktrees and append to the set
        //Worktree listing for tree path collection
        const git = spawn('git', ['list worktree'])// takes command and flags

        const gitOutput = readline.createInterface({ input: git.stdout }); 
        /**
         * Git outputs  in each line the next format: path, hash, branch name
         * Example: 
         * "/Users/s_n_gr/Documents/My-Engineering-projects/traceability_system  17d7551 [main]
         *  /Users/s_n_gr/Documents/My-Engineering-projects/tso/req023           17d7551 [req023]"
         */

        const workTreePaths = new Set();

        try{
            gitOutput.forEach(line => {
            const lineParts = line.split(/\s+/) // Split the line in white spaces

            //Append the path
            if(lineParts[0]){
                workTreePaths.add(lineParts[0]);
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
    static updateSymlink(editorProjectFolder, workTreePath){

        /** 
         * 1. Detach the symlink in the folder:
         * - Handle the edge case where multiple symlink are present in the markdwon editor
         * - Unlink the symlink present
         * 
        */ 
        try{
            const symlinksListing = await readdir(editorProjectFolder, { withFileTypes: true })
            const symlinkFiltered = symlinksListing.filter(entry => entry.isSymbolicLink()) // Build an array of only symlinks
            const symlinkCount =symlinkFiltered.length; // Find the number of symlinks in the editor folder

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
                const answer = await rl.question(`What is you project ${property}`);

                jsonProp = answer // Add the new property data to the json config object

                // Write the config with the new data
                fs.writeFileSync(absolutePath, configJSON);

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