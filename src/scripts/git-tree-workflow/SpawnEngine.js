#!/usr/bin/env node
// @trace REQ-023 ADR-008 @

import GWO from "./GitWorkflowOperations.js"
import { folderSetUp } from "./SpawnEngineHelper.js"
import { parseArgs} from 'node:util'

console.log('==== LAUNCH THE SPAWN ENGINE =====')//to debug uncoment
// Worktree within correct folder

// CONFIG AND VARIABLES SET UP
/** @type {string} Only the name and extension of the config file */
const configName = "system-config.json"
// Check config file presence
//TODO....
let isConfig;
let configPath;

    [isConfig, configPath] = GWO.validateConfigPresence(configName);

if(!isConfig){
    configPath = GWO.createConfigFile(configName);
    //[isConfig, configPath] = GWO.validateConfigPresence(configName)
    console.log(`DEBUG: Created config file path: ${configPath}`)//uncoment to debug
    await GWO.setUpPropertiesOfConfig("projectPrefix", configPath)
}
else{
    console.log(`DEBUG: This is the config file path which is indeed found ${configPath}`)//to debug uncoment
    // Validate the prefix is exist & if not add the data
    await GWO.setUpPropertiesOfConfig("projectPrefix", configPath)
}

/** Commmand Arguments Management:
 * - Define the flag options schema
 * - Allow propositionals(sequenced strings) for the artifact that serves as folder and branch name
*/

const options = {
    // Key represents the long flag (--count) // 'short' property represents the alias flag (-c)
    symlink: {type: "boolean", short: "s"},
    code: {type: "boolean", short: "c"},
}

const cliData = parseArgs({args: process.argv.slice(2), options, allowPositionals: true})
const {values} = cliData;
const {positionals} = cliData;

/** @type {string} - The artifact prefix and the number id in lowercase e.g: req025, adr001, vs009 */
const artifactArg = positionals[0];
console.log('DEBUG: yeah! positional received', artifactArg ); // to debug uncoment

/**
 * Configuration data validation:
 * - Check the prefix of the project is in the config:
 *      * false: prompt the user and update it
 * - in the flag convination `-s` Check if the path of the project editor markdown is present
 * 
 */


// After configuring data read the json and parse it


// Set Up: Data for engine operation
const prefix = GWO.accessPropertiesOfConfig('projectPrefix', configPath); // TEMP: set right var
let wormHoleStart; // TEMP: Abosulte path for the editor markdwon project folder

// Set Up: Setting up the prefix folder and checking all is fine 
const prefixDirPath = folderSetUp(prefix);
console.log(`DEBUG: The set up return the prefix folder path: ${prefixDirPath}` ); // to debug uncoment
/** 
 * Scenario A: New worktree & symlink update
 */

if (values.symlink && !values.code ) {

    console.log(`==== BEGAN THE CREATION OF TREE SYMLINK AND INSTANCE OF VS =====`)//to debug uncoment

    //Handle missing editor path in the config
    await GWO.setUpPropertiesOfConfig('markdownEditorFolderPath', configPath);
    
    //Access symlink path in its most updated state
    wormHoleStart = GWO.accessPropertiesOfConfig('markdownEditorFolderPath', configPath)

    // 1. Handle new tree creation:


    const wormHoleEnd = GWO.createWorkTree(prefixDirPath, artifactArg); // The new created tree path

    // 2. Symlink update
    GWO.updateSymlink(wormHoleStart, wormHoleEnd);
}

/**
 * Scenario B: New worktree - Symlink - VSInstance
 */

else if(values.symlink && values.code) {

    console.log('==== BEGAN THE CREATION OF SYMLINK AND INSTANCE OF VS =====')//to debug uncoment
    //Handle missing editor path in the config
    GWO.setUpPropertiesOfConfig('markdownEditorFolderPath', configPath);
    
    //Access symlink path in its most updated state
    wormHoleStart = GWO.accessPropertiesOfConfig('markdownEditorFolderPath', configPath)
    
    // 1. Handle new tree creation:
    const worktreePath = GWO.createWorkTree(prefixDirPath, artifactArg); // The new created tree path

    // 2. Symlink update
    GWO.updateSymlink(wormHoleStart, worktreePath);

    // 3. VsCode instance
    GWO.launchVSCode(worktreePath);

}
/**
 * Scenario C: New worktree - No symlink - Vs instance
 */
else if(!values.symlink && values.code){
    // 1. Handle new tree creation:
    const worktreePath = GWO.createWorkTree(prefixDirPath, artifactArg); // The new created tree path

    // 2. VsCode instance
    GWO.launchVSCode(worktreePath);
}

/**
 * Scenario D: New worktree - No symlink - No Vs instance
 * - This is the default case it will only trigger prefix folder movements and a new worktree
 */
else{
    // 1. Handle new tree creation:
    GWO.createWorkTree(prefixDirPath, artifactArg); // The new created tree path
}
