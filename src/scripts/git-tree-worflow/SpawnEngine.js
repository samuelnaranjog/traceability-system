import {createWorkTree, updateSymlink}  from "./GitWorflowOperations"
import { folderSetUp } from "./SpawnEngineHelper"
import { parseArgs} from 'node:util'

// Worktree within correct folder

// Check config file presence
//TODO....

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

const prefix = config.prefix // TEMP: set right var
const wormHoleStart = config.symlinkStartPath // TEMP: Abosulte path for the editor markdwon project folder

// Set Up: Setting up the prefix folder and checking all is fine 
const prefixDirPath = folderSetUp(prefix);

/** 
 * Scenario A: New worktree & symlink update
 */

if (values.symlink) {

    // 1. Handle new tree creation:
    const wormHoleEnd = createWorkTree(prefixDirPath, artifactArg); // The new created tree path

    // 2. Symlink update
    updateSymlink(wormHoleStart, wormHoleEnd);
}

/**
 * Scenario B: New worktree - Symlink - VSInstance
 */

else if(values.symlink && values.code) {

}