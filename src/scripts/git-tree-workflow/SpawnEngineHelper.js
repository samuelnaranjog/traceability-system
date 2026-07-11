
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
        const isParentPrex = GWO.isParentPrefix(prefix, cwd); 

        // Handle the Bool cases
        if (isParentPrex == false) {
            // Check if the main tree has a prex folder
            const mainTreePath =  GWO.findMainWorkTreePath(cwd);
            const isMainPrex = GWO.isParentPrefix(prefix, mainTreePath);
    
            // Check all the trees and move them to the to the prex folder if they are not in there
            if (isMainPrex == true) {
                
                prexDirPath = GWO.findMainWorkTreePathParent();
                GWO.moveTreesToParent(prefix, prexDirPath, cwd)
                
            }
            else {
                // Create the prefix folder relative to the main tree and move trees there
                prexDirPath = GWO.createPrefixFolder(prefix, cwd);
                GWO.moveTreesToParent(prefix, prexDirPath, cwd);
            }
        }

        return prexDirPath
}