
import { dirname } from "node:path";
import GWO from "./GitWorkflowOperations.js";

/**
 * @param {string} prefix
 * @returns {string} The path to the prefix directory
 */
export function folderSetUp(prefix, cwd = process.cwd()){
     /**
        * Setting up the parent folder and checking all is fine:
         * - Check if the current worktree has parent folder with the prefix
         * - If not check if the main work-tree as a parent dir prefix
         * - Handle the boolean:
         *      * true: check the worktrees and move the ones that are not in prefix there
         *      * false: create a new prefix folder and move the worktrees there 
        */
    
    
        let prexDirPath = "";
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
                GWO.moveTreesToParent(prefix, prexDirPath, cwd)
                console.log(`DEBUG: This is the prefix folder path: ${prexDirPath}` ); // to debug uncoment
                
            }
            else {
                // Create the prefix folder relative to the main tree and move trees there
                console.log(`DEBUG: Enter condition when main worktree is also not in the prex folder` )
                prexDirPath = GWO.createPrefixFolder(prefix, cwd);
                console.log(`DEBUG: successfully created prefix directory its path is: ${prexDirPath}` ); // to debug uncoment
                GWO.moveTreesToParent(prefix, prexDirPath, cwd);
            }
        }else{
            
            prexDirPath = dirname(cwd);
            console.log(`DEBUG: This is the prefix folder path: ${prexDirPath}` ); // to debug uncoment
        }

        /**
         * Handle the case where the worktree is in the prefix folder but the main tree isn't
         */

        const mainTreePath =  GWO.findMainWorkTreePath(cwd);
        const isMainPrex = GWO.isParentPrefix(prefix, mainTreePath);
        isParentPrex = GWO.isParentPrefix(prefix, cwd); // Request the new parent state again
        if(isMainPrex == false && isParentPrex == true){
            console.log(`DEBUG: Enter condition when the case where the worktree is in the prefix folder but the main tree isn't` ); // to debug uncoment
            GWO.moveTreesToParent(prefix, prexDirPath, cwd);
        }

        return prexDirPath;
}