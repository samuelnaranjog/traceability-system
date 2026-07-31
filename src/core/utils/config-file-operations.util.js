import { MASTER_CONFIG_NAME } from "./system-config.default";
import { DEFAULT } from "./system-config.default";
import { findWorkTreePath } from "../git-tree-workflow/GitWorkflowOperations";

/**
   * @Description Creates a config file in the worktree folder, of course only if run from a valid worktree or worktree subfolder
   * @param {string} configName - Config file name
   * @returns {path} Path to the created config file
*/
export function createConfigFile(configName = MASTER_CONFIG_NAME) {

    const worktreePath = findWorktreePath();
    const newFilePath = path.join(worktreePath, configName);
    const configDefaultData = DEFAULT;

    try {
      writeFileSync(newFilePath, JSON.stringify(configDefaultData, null, 2));
      console.log("File created successfully!");
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
    console.log("==== Validating config presence ====="); //to debug uncoment
    const worktreeFolder = this.findWorktreePath();
    const items = readdirSync(worktreeFolder, { withFileTypes: true });
    const files = items.filter((item) => item.isFile());
    console.log(
      `Current files in the system ${JSON.stringify(files)} --- Config file name to compare ${configName} `,
    ); //to debug uncoment

    let foundPath = undefined;
    let hasConfig;
    const configFile = files.find((file) => file.name == configName);
    console.log(`Data extracted from config ${JSON.stringify(configFile)}`); //to debug uncoment

    if (configFile) {
      hasConfig = true;
      foundPath = path.join(configFile.path, configName);
    } else {
      hasConfig = false;
    }

    return [hasConfig, foundPath];
  }
  catch{
    console.error(`Fail to find the expected config file: ${configName}`, error);
  }
}