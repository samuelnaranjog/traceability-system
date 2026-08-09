import { MASTER_CONFIG_NAME } from "./system-config.default.util.js";
import { DEFAULT } from "./system-config.default.util.js";
import GW from "../dev-workflow/DevWorkflowOperations.js";
import { readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parseFileAndCatch } from "./parse-file-&-catch.util.js";
import { stdin as input, stdout as output } from 'process';
import { createInterface } from "node:readline/promises";
import { systemSchemaValidation } from "./validate-system-config-schema.util.js";
import { spawnSync } from "node:child_process";


/**
 * Depend on the current cwd from which youre running the command
 * @param {string} configName 
 */
export function saveConfigSettings(configName) {
    try {
      // Stage the configuration file
      const gitAdd = spawnSync("git", ["add", configName], {
        cwd: process.cwd(),
      });

      if (gitAdd.error) {
        throw gitAdd.error;
      }
      if (gitAdd.status !== 0) {
        throw new Error(
          `Git add failed with exit code ${gitAdd.status}: ${gitAdd.stderr.toString()}`,
        );
      }

      // Commit the changes
      const commitMessage = "chore: update system config file";
      const gitCommit = spawnSync("git", ["commit", "-m", commitMessage], {
        cwd: process.cwd(),
      });

      if (gitCommit.error) {
        throw gitCommit.error;
      }

      // Exit code 1 on commit usually means "nothing to commit"
      if (gitCommit.status !== 0) {
        const stderrMsg = gitCommit.stderr.toString().trim();
        const stdoutMsg = gitCommit.stdout.toString().trim();

        // Treat "nothing to commit" as a warning rather than a system-crashing failure
        if (
          stdoutMsg.includes("nothing to commit") ||
          stderrMsg.includes("nothing to commit")
        ) {
          console.warn(
            "⚠️ Git commit skipped: No changes detected in the configuration file.",
          );
        } else {
          throw new Error(
            `Git commit failed with exit code ${gitCommit.status}: ${stderrMsg || stdoutMsg}`,
          );
        }
      } else {
        console.log(
          "✅ System configuration file successfully updated and committed to Git.",
        );
      }
    } catch (error) {
      console.error("❌ Failed to execute Git automation workflow:");
      console.error(error);
      process.exit(1);
    }
  }

/**
 * @Description Creates a config file in the worktree folder, of course only if run from a valid worktree or worktree subfolder
 * @param {string} configName - Config file name
 * @returns {path} Path to the created config file
*/
export function createConfigFile(configName = MASTER_CONFIG_NAME) {

    const worktreePath = GW.findWorktreePath();
    const newFilePath = path.join(worktreePath, configName);
    const configDefaultData = DEFAULT;

    try {
      writeFileSync(newFilePath, JSON.stringify(configDefaultData, null, 2));
      //console.log("File created successfully!");

      saveConfigSettings(MASTER_CONFIG_NAME);
      return newFilePath;
    } catch (error) {
      console.error(`Failed to create the ${configName} file:`, error);
    }
}



/**
   * @param {string} configName - Config file name
   * @returns {[hasConfig: boolean, foundPath: string]}  Array for destructuring with bolean and path if found
*/

export function validateConfigPresence(configName = MASTER_CONFIG_NAME) {
  try{
    //console.log("==== Validating config presence ====="); //to debug uncoment
    const worktreeFolder = GW.findWorktreePath();
    const items = readdirSync(worktreeFolder, { withFileTypes: true });
    const files = items.filter((item) => item.isFile());
    //console.log(`Current files in the system ${JSON.stringify(files)} --- Config file name to compare ${configName} `,); //to debug uncoment

    let foundPath = undefined;
    let hasConfig = false;
    const configFile = files.find((file) => file.name === configName);
    //console.log(`Data extracted from config ${JSON.stringify(configFile)}`); //to debug uncoment

    if (configFile) {
      //console.log(`successfully indentify the cofnig presence`)
      hasConfig = true;
      foundPath = path.join(worktreeFolder, configName);
    } else {
      hasConfig = false;
    }

    return [hasConfig, foundPath];
    
  }
  catch(error){
    console.error(`Fail to find the expected config file: ${configName}`, error);
    throw new Error('The config File is not present please created manually')
  }
}

/**
 * Prompts the user to populate a config property if missing or empty.
 * Leaves the property untouched if data already exists.
 *
 * @param {string} property - Property key or dot-path (e.g. "author" or "db.host")
 * @param {string} engineType - The subproperty to check in the config & parent key 
 * @param {string} absolutePath - Absolute file path to the config file
 */

  //@trace SREQ-023C @
export async function  setUpPropertiesOfConfig(property, engineType, absolutePath) {


  //  Read & parse json file safely
  const configJSON = parseFileAndCatch(absolutePath)

  console.log('DEBUG: Config to extract data:', configJSON)

  // Resolve nested or top-level property value
  const jsonProp = configJSON[engineType][property];

  // If missing, null, or empty string, prompt user for input
  if (jsonProp === undefined || jsonProp === null || jsonProp === "") {
    const rl = createInterface({ input, output });

    try {
      const answer = await rl.question(`What is your project ${property}: `);

      console.log(`DEBUG: trying to add ${answer} within ${property} `)
      configJSON[engineType][property] = answer;

      // Validate schema BEFORE persisting changes
      const UpdatedConfig = systemSchemaValidation(engineType, configJSON);

      console.log("DEBUG: config result after validation is:", UpdatedConfig )
      // Write formatted JSON back to disk
      writeFileSync(absolutePath, JSON.stringify(UpdatedConfig, null, 2), "utf8");

      //const systemConfigName = basename(absolutePath);
      saveConfigSettings(MASTER_CONFIG_NAME);

      console.log(`✅ Property '${property}' set successfully.`);
    } catch (err) {
      console.error(`❌ Failed to set config property '${property}':`, err.message || err);
    } finally {
      rl.close();
    }
  }
}

/**
 * 
 * @param {string} property - Property to extract
 * * @param {string} engineType - The subproperty to check in the config & parent key 
 * @param {path} absolutePath - Absolute path to the config file
 * @returns {string} Data extracted from the config
 */

//@trace SREQ-023C @

export function accessPropertiesOfConfig(property,engineType, absolutePath) {
    const configJSON = parseFileAndCatch(absolutePath);

    const jsonProp = configJSON[engineType][property];
    console.log(
      `Obtained the prop ${property} from the config, its value is: ${jsonProp} `,
    ); // Debug log uncoment!
    return jsonProp;
  }



