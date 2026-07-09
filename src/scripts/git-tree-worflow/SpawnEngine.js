// @trace REQ-023 ADR-008 @

import {createWorkTree, updateSymlink, launchVSCode, validateConfigPresence, createConfigFile, setUpPropertiesOfConfig, accessPropertiesOfConfig}  from "./GitWorflowOperations"
import { folderSetUp } from "./SpawnEngineHelper"
import { parseArgs} from 'node:util'

// Worktree within correct folder

// CONFIG AND VARIABLES SET UP
/** @type {string} Only the name and extension of the config file */
const configName = "system-config.json"
// Check config file presence
//TODO....

let [isConfig, path] = validateConfigPresence(configName)

if(!isConfig){
    createConfigFile(configName);
    [isConfig, path] = validateConfigPresence(configName)
    setUpPropertiesOfConfig("projectPrefix", newPath)
}
else{
    // Validate the prefix is exist & if not add the data
    setUpPropertiesOfConfig("projectPrefix", path)
}

/** Commmand Arguments Management:
 * - Define the flag options schema
 * - Allow propositionals(sequenced strings) for the artifact that serves as folder and branch name
*/

const options = {
    // Key represents the long flag (--count) // 'short' property represents the alias flag (-c)
    symlink: {type: "boolean", short: "s"},
    code: {type: "boolean", short: "c"},
    allowPositionals: true // Allows non-flag stringsª
}

const cliData = parseArgs({args: process.argv.slice(2), options, allowPositionals: true})
const {values} = cliData;
const {positionals} = cliData;

/** @type {string} - The artifact prefix and the number id in lowercase e.g: req025, adr001, vs009 */
const artifactArg = positionals[0];

/**
 * Configuration data validation:
 * - Check the prefix of the project is in the config:
 *      * false: prompt the user and update it
 * - in the flag convination `-s` Check if the path of the project editor markdown is present
 * 
 */


// After configuring data read the json and parse it


// Set Up: Data for engine operation
const prefix = config.prefix // TEMP: set right var
let wormHoleStart; // TEMP: Abosulte path for the editor markdwon project folder

// Set Up: Setting up the prefix folder and checking all is fine 
const prefixDirPath = folderSetUp(prefix);

/** 
 * Scenario A: New worktree & symlink update
 */

if (values.symlink) {

    

    //Handle missing editor path in the config
    setUpPropertiesOfConfig('markdownEditorFolderPath', path);
    
    //Access symlink path in its most updated state
    wormHoleStart = accessPropertiesOfConfig('markdownEditorFolderPath', path)

    // 1. Handle new tree creation:
    const wormHoleEnd = createWorkTree(prefixDirPath, artifactArg); // The new created tree path

    // 2. Symlink update
    updateSymlink(wormHoleStart, wormHoleEnd);
}

/**
 * Scenario B: New worktree - Symlink - VSInstance
 */

else if(values.symlink && values.code) {

    //Handle missing editor path in the config
    setUpPropertiesOfConfig('markdownEditorFolderPath', path);
    
    //Access symlink path in its most updated state
    wormHoleStart = accessPropertiesOfConfig('markdownEditorFolderPath', path)
    
    // 1. Handle new tree creation:
    const worktreePath = createWorkTree(prefixDirPath, artifactArg); // The new created tree path

    // 2. Symlink update
    updateSymlink(wormHoleStart, worktreePath);

    // 3. VsCode instance
    launchVSCode(worktreePath);

}
/**
 * Scenario C: New worktree - No symlink - Vs instance
 */
else if(!values.symlink && values.code){
    // 1. Handle new tree creation:
    createWorkTree(prefixDirPath, artifactArg); // The new created tree path

    // 2. VsCode instance
    launchVSCode(worktreePath);
}

/**
 * Scenario D: New worktree - No symlink - No Vs instance
 * - This is the default case it will only trigger prefix folder movements and a new worktree
 */
else{
    // 1. Handle new tree creation:
    createWorkTree(prefixDirPath, artifactArg); // The new created tree path
}