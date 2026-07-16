
import { dirname } from "node:path";
import GWO from "./GitWorkflowOperations.js";
import path from "node:path";
import { spawnSync } from "node:child_process";

/**
 * @param {string} prefix
 * @returns {string} The path to the prefix directory
 */
export function folderSetUp(prefix, cwd = process.cwd(), configName){
    
    /**
        * Setting up the parent folder and checking all is fine:
         * - Check if the current worktree has parent folder with the prefix
         * - If not check if the main work-tree as a parent dir prefix
         * - Handle the boolean:
         *      * true: check the worktrees and move the ones that are not in prefix there
         *      * false: create a new prefix folder and move the worktrees there 
        */
    
    
        let prexDirPath = "";
        let newLocationOfMainTree; // This variable should store the updated cwd of the updated location of the main worktree

        // Validate current worktree has parent folder
        let isParentPrex = GWO.isParentPrefix(prefix, cwd); 

        // Handle the Bool cases
        if (isParentPrex == false) {
            // Check if the main tree has a prex folder
            const mainTreePath =  GWO.findMainWorkTreePath(cwd);
            const isMainPrex = GWO.isParentPrefix(prefix, mainTreePath);

             console.log(`DEBUG: Enter condition whe parent does not exist` ); // to debug uncoment
    
            // Check all the trees and move them to the to the prex folder if they are not in there
            if (isMainPrex == true) {
                console.log(`DEBUG: Enter condition when main worktree is within the prex folder` ); // to debug uncoment
                prexDirPath = GWO.findMainWorkTreePathParent();
                newLocationOfMainTree =  GWO.moveTreesToParent(prefix, prexDirPath, cwd)
                console.log(`DEBUG: This is the prefix folder path: ${prexDirPath}` ); // to debug uncoment
                
            }
            else {
                // Create the prefix folder relative to the main tree and move trees there
                console.log(`DEBUG: Enter condition when main worktree is also not in the prex folder` )
                prexDirPath = GWO.createPrefixFolder(prefix, cwd);
                console.log(`DEBUG: successfully created prefix directory its path is: ${prexDirPath}` ); // to debug uncoment
                newLocationOfMainTree = GWO.moveTreesToParent(prefix, prexDirPath, cwd);
            }
        } else{
            
            prexDirPath = dirname(cwd);
            console.log(`DEBUG: This is the prefix folder path: ${prexDirPath}` ); // to debug uncoment
        }

        

        /**
         * NOTE: Handle the case where the worktree is in the prefix folder but the main tree isn't
         * - This implementatin result rebundant and innesesary since any of the above cases wil handle gracefully moving the trees where they should
         */
        /*

        /**
         * State Update:
         * - Set the current working process the the new main tree cwd so that the spawn procceses can run from the actual maintree within prefix folder location
         */

        let newConfigPath;
        try{
            // When the trees are moved set the cwd to new location otherwise keep it as currently
            if(newLocationOfMainTree){
                console.log(`DEBUG: The New cwd should be ${newLocationOfMainTree}` ); // to debug uncoment
                process.chdir(newLocationOfMainTree)
                // Update configPath to the new possible location
                newConfigPath = path.join(newLocationOfMainTree, configName);
            }
            else{
                console.log(`DEBUG: kept the currentcwd: ${cwd}` ); // to debug uncoment
            }

            
           
        }
        catch(error){
            console.error('Fail to set up the new cwd proccess for worktree creation from main or the new config path', error.message);
            process.exit(1);
        }

       

        return [prexDirPath, newConfigPath];
}