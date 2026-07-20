#!/usr/bin/env node

// @trace REQ-024 @

import GWO from "./GitWorkflowOperations.js";

const configName = "system-config.json"

GWO.rebaseSquash();

const branchName = GWO.currentBranchName();

const workTreePath = GWO.findWorktreePath();

const mainCWD = GWO.findMainWorkTreePath();

// Move the cwd to the main branch to perform the merge
try{
    process.chdir(mainCWD);
}
catch(error){
    console.error(`Failed to change the current process cwd: ${error.message}`);
    process.exit(1);
}

GWO.mergeOperation(undefined, branchName);

// Detach active reference of the symlink and back to main worktree 
// (guaranties a clean markdown editor with the right connection)

let [isConfig, configPath] = GWO.validateConfigPresence(configName);

if(!isConfig){
    configPath = GWO.createConfigFile(configName);
    console.log(`DEBUG: Created config file path: ${configPath}`)//uncoment to debug
    await GWO.setUpPropertiesOfConfig("projectPrefix", configPath)
}
else{
    console.log(`DEBUG: This is the config file path which is indeed found ${configPath}`)//to debug uncoment
    // Validate the prefix is exist & if not add the data
    await GWO.setUpPropertiesOfConfig("projectPrefix", configPath)
}

const markdownEditorPath = GWO.accessPropertiesOfConfig('markdownEditorFolderPath', configPath)

GWO.updateSymlink(markdownEditorPath, mainCWD);

// Branch and worktree removal

GWO.removeWorktree(workTreePath);

GWO.removeBranch(undefined, branchName);

console.log(`Successfully complete ${branchName} collapse.`);