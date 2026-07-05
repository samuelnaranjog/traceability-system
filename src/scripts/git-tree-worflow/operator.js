import {GitWorkflowOperations as gw }  from "./GitWorflowOperations"
// Worktree within correct folder

/**
 * 1. Setting up the parent folder and checking all is fine:
 * - Check if the current worktree as parent folder with the prefix
 * - If not check if the main work-tree as a parent dir prefix
 * - Handle the boolean:
 *      * true: check the worktrees and move the ones that are not in prefix there
 *      * false: create a new prefix folder and move the worktrees there
 *  
*/ 

const prefix = config.prefix // TEMP: set right var

const isParentPrex = gw.isParentPrefix(prefix) // TEMP: Add the real prefix as argument
if(isParentPrex == false){
    // Check if the main tree has a prex folder
    const mainTreePath = gw.findMainWorkTreePath();
    const isMainPrex = gw.isParentPrefix(prefix, mainTreePath);

    // Check all the trees and move them to the to the prex folder if they are not in there
    if(isMainPrex == true);
        const prexDirPath = gw.findMainWorkTreePath()
        gw.moveTreesToParent(prefix, prexDirPath)
    // Create the main folder and move trees there
    else{ 
        const newPrexDirPath = gw.createPrefixFolder()
        gw.moveTreesToParent(prefix, newPrexDirPath)
    }
}

// Handle new tree creation