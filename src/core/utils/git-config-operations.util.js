// @trace SREQ-023C SREQ-024B @
import {spawnSync } from "node:child_process";
import LinkType from "./ResolveLinkType.util.js";
import { stdin as input, stdout as output } from 'process';
import { createInterface } from "node:readline/promises";

/**
 * @param {string} parentKey - The key within the git config
 * @param {string} key - Section where you want to set the value
 */


// Implements: ADR-012
export async function setCustomGitConfig(parentKey, key) {

    const fullKey = `${parentKey}.${key}`
    // Check the value existence
    const checkResult = spawnSync('git', ['config', '--local', '--get', fullKey], {
    cwd: process.cwd(),
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe']
  });

    const existingValue = checkResult.stdout ? checkResult.stdout.trim() : '';


  // Handles empty or not existing property Otherwise it skips the writing
    if (checkResult.status !== 0 || existingValue.length === 0) {

        const rl = createInterface({ input, output });

        let answer;
        try {
            answer = await rl.question(`What is your project ${fullKey}: `);
        } catch (err) {
            throw new Error(`Failed to set config property '${fullKey}':`, err)
        } finally {
            rl.close();
        }

        const setResult = spawnSync('git', ['config', '--local', fullKey, answer], {
        cwd: process.cwd(),
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe']
        });
    

    if (setResult.status !== 0) {
        throw new Error(`Failed to set git config "${key}": ${setResult.stderr.trim()}`);
    }
  }
}

/**
 * @param {string} parentKey - The key within the git config
 * @param {string} key - section value to access from the git config
 * @returns {string}  Absolute path of symlink folder
 */

// Implements: ADR-012
export function accessGitConfigSymValue(parentKey, key){

    const fullKey = `${parentKey}.${key}`

    const result = spawnSync('git', ['config', '--local', '--get', fullKey], {
    cwd: process.cwd(),
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe']
    });
  
    if (result.status !== 0) {
        throw new Error(`Failed to access git config "${fullKey}": ${result.stderr.trim()}`);
    }

    const cleanData = result.stdout ? result.stdout.trim() : '';
    const isNotSystem = LinkType.bypassFileSystem(cleanData);

    if(typeof cleanData === 'string' && cleanData.length > 0 && !isNotSystem){
        return cleanData;
    }
    else{
        throw new Error(`Value at git config "${fullKey}": "${cleanData}" is invalid type or not a system path. Please update it using 'git config --local ${key} <value>`);
    }


}