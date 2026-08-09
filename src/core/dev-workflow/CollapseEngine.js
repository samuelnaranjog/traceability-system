#!/usr/bin/env node
// @trace SREQ-024A @

import GWO from "./DevWorkflowOperations.js";
import {createConfigFile, setUpPropertiesOfConfig, accessPropertiesOfConfig, validateConfigPresence} from "../utils/config-file-operations.util.js"
import { accessGitConfigSymValue, setCustomGitConfig } from "../utils/git-config-operations.util.js"

const ENGINE_TYPE = "dev-workflow";

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

// Ensure the path exist, or prompt for it.
// @trace SREQ-024B @
// Implements: ADR-012
await setCustomGitConfig(ENGINE_TYPE, 'markdownEditorFolderPath');
const markdownEditorPath = accessGitConfigSymValue(ENGINE_TYPE, 'markdownEditorFolderPath')


GWO.updateSymlink(markdownEditorPath, mainCWD);

// Branch and worktree removal

GWO.removeWorktree(workTreePath);

GWO.removeBranch(undefined, branchName);

console.log(`Successfully complete ${branchName} collapse.`);