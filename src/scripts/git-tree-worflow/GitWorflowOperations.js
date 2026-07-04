// Project Root path
import appRoot from "app-root-path";
import { basename, dirname, path } from "node:path";
import { mkdir, rename } from "node:fs";
import { cwd } from "node:process";
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
     * @param {string} treePath - its the path of the current folder
     * @param {gitWorkTreeScriptConfig.projectPrefix} prefix
     * @param {gitWorkTreeScriptConfig.prefixFolderPath} prexFolderPath
     * @returns {Boolean} - True if parent with prefix exist. False whe it does not
     */
    static isParentPrefix (treePath, prefix, prexFolderPath){
        // Action: checks if the parent is the prefix

        try{
        // Get the current worktree path 
        const currentDirectory = execSync('git rev-parse --show-toplevel', {
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'ignore'] // Prevents git errors from leaking to console if run outside a repo
        }).trim();

        if (!currentDirectory) {
            throw new Error('Git command returned an empty path.');
        }

        // Get the parent path of the worktree 
        const parentPath = dirname(currentDirectory);
        console.log(`Parent absolute path: ${parentPath}`);

        } catch(error) {
            console.error('❌ The current folder is not part of a valid worktree.');
            // console.error(error.message); // Uncomment to debug the exact Git failure
        }

        // Parent name
        const parentFolderName = basename(parentPath);


        
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
    static createPrefixFolder(prefix, workTreeConfig ){
        //Consider this is run from the main tree folder

        /** 
         * 1. Create the prefix folder:
         * - Get the main tree path
         * - Find the parent of the Main tree
         * - Create the folder with its prefix
         */ 


        //1.1 Finding the parent by using worktree listing
        const git = spawn('git', ['list worktree'])// takes command and flags

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

        const mainBranchParentFolderPath = dirname(mainBranchPath);

        //1.2 Create the folder
        const newPrefixDir = path.join(mainBranchParentFolderPath, prefix);
        try{
            await mkdir(newPrefixDir);

            console.log(`Successfully created: ${newPrefixDir}`);
        }
        catch(error){
            console.error('The prefix folder creation failed', error.message)
            process.exit(1);
        }

        
        //2 .Move the main tree folder to the prefix folder
         
         
        try{
            rename(mainBranchPath, newPrefixDir)
            console.log(`Successfully move dir ${mainBranchPath} to the dir ${newPrefixDir} `);
        }
        catch(error){
            console.error(`Failed to move the main branch at: ${mainBranchPath} to  dir ${newPrefixDir}`, error.message)
            process.exit(1);
        }

        return newPrefixDir;

    }

    /**
     * @returns {path} Main work-tree path
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

    }
}