// @trace REQ-023 @

// Project Root path
import { basename, dirname, parse} from "node:path";
import path from 'path'
import { mkdirSync, openSync, readdir, readdirSync, readFileSync, renameSync, symlink, symlinkSync, unlink, unlinkSync, writeFileSync } from "node:fs";
import { config, cwd } from "node:process";
import { spawn, execSync, spawnSync } from "node:child_process";
import { stdin as input, stdout as output } from 'process';
import { createInterface } from "node:readline/promises";

/**
 * @typedef {string} prefix - The project prefix id
 * @typedef {string} path - Valid absolute path
*/

/**
 * @typedef {object} gitWorkTreeScriptConfig
 * @property {string} markdownEditorFolderPath - Folder path of the symlink folder
 * @property {string} projectPrefix - The unique prefix identfier for the project
 * @property {string} prefixFolderPath - The folder path to the prefix folder once created
 */
export default class GitWorkflowOperations {
  /**
   *  @description Find the current worktree dir path
   *  @param {path} customPath - The path of the worktree or subfolder from which you want to find the aboslute path, , fallback to current cwd 
   *  @returns {path} The path of the worktree were the command was launched
   */
  static findWorktreePath(customPath = process.cwd()) {
    try {
      // Get the current worktree path

      const currentDirectory = spawnSync(
        "git",
        ["rev-parse", "--show-toplevel"],
        {
          cwd: customPath,
          encoding: "utf8",
          stdio: ["ignore", "pipe", "ignore"], // Drops stderr to prevent clutter
        },
      );

      // 1. Check if the system failed to spawn the binary completely (ENOENT)
      if (!currentDirectory || currentDirectory.error) {
        const errorMsg =
          currentDirectory?.error?.message || "Unknown system spawning error";
        throw new Error(`Git binary execution failed. OS Error: ${errorMsg}`);
      }

      // 2. Check if Git ran but returned a non-zero exit code (e.g., not a git repo)
      if (currentDirectory.status !== 0 || !currentDirectory.stdout) {
        throw new Error(
          `Git worktree resolution failed. System exit code: ${currentDirectory.status}`,
        );
      }

      const currentPath = currentDirectory.stdout.trim();

      console.log("Current dir found at findWorkTreePath: ", currentPath); // uncoment to debug

      return currentPath;
    } catch (error) {
      console.error(
        "❌ The current cli open dir or custom path is not part of a valid worktree.",
        error.message,
      );
      // console.error(error.message); // Uncomment to debug the exact Git failure
      process.exit(1);
    }
  }
  /**
   * @description 1 argument: checks the existence of a specified prefix parent dir for the tree from the cli script was launched
   * @description 2 arguments: checks the existence of a specified prefix parent dir for the tree from the custom path specifed
   * @param {gitWorkTreeScriptConfig.projectPrefix} prefix
   * @param {path} customPath - The path where you want to figure out if the parent dir is the prefix
   * @returns {Boolean} - True if parent with prefix exist. False whe it does not
   */

  static isParentPrefix(prefix, customPath = process.cwd()) {
    if (typeof customPath !== "string") {
      console.error(
        "❌ The customPath passed to isParentPrefix must be a string.",
      );
      return false;
    }

    try {
      // 1. Get the current worktree path
      const currentPath = this.findWorktreePath(customPath);

      // 2.  Get the parent path of the worktree
      const parentPath = dirname(currentPath);
      console.log(`Parent absolute path: ${parentPath}`); // uncoment to debug

      // 3. Figure out the parent name
      const parentFolderName = basename(parentPath);

      //4. Compare to the prefix and define if is prefix or not
      console.log(
        `DEBUG: Comparing ${parentFolderName} with ${prefix} result is: ${parentFolderName == prefix}`,
      ); //uncoment to debug
      if (parentFolderName == prefix) {
        // Change exact mathc to start + 6 chars or only prefix to work in tests
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(
        `❌ Fail to find the parent with the expected prefix, path argument passed ${customPath} `,
        error.message,
      );
      // console.error(error.message); // Uncomment to debug the exact Git failure
    }
  }

  /**
   * @param {prefix} prefix
   * @param {path} customPath - The path of current worktree
   * @returns {path} - Path to the prefix directory
   *
   */
  static createPrefixFolder(prefix, customPath = process.cwd()) {
    //Consider this is run from the main tree folder

    /**
     * 1. Create the prefix folder:
     * - Find the parent of the Main tree
     * - Create the folder with its prefix
     */

    try {
      // Finding the parent

      const mainBranchParentFolderPath =
        this.findMainWorkTreePathParent(customPath);

      //Create the folder
      const newPrefixDir = path.join(mainBranchParentFolderPath, prefix);
      console.log(`DEBUG: New path for the prefix folder : ${newPrefixDir}`); // uncoment to debug

      mkdirSync(newPrefixDir);
      console.log(`Successfully created: ${newPrefixDir}`);
      return newPrefixDir;
    } catch (error) {
        // Handle a folder with the prefix that already exist!
        if(error.code === 'EEXIST'){
            console.error("❌ The prefix folder already exist, audit it and delete it, change the project prefix or move the main worktree within the prefix folder", error.message);
        }
        else{
      console.error("The prefix folder creation failed", error.message);
     
        }

        process.exit(1);
    }
  }

  /**
   * Run from a valid worktree to work properly
   * @param {path} customPath - The path of the worktree or subfolder from which you want to find the main worktree, , fallback to current cwd 
   * @returns {path} Main work-tree absolute path
   */
  static findMainWorkTreePath(customPath = process.cwd()) {
    // NOTE: this should be run form one of the worktrees that the precondition or its nested folders

    try {
      // Finding the parent by using worktree listing
      const result = spawnSync("git", ["worktree", "list"], {
        cwd: customPath,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }); // takes command and flags

      if (!result || result.status !== 0 || !result.stdout) {
        return null;
      }

      const gitOutputlines = result.stdout.toString("utf8").trim().split("\n");

      /**
       * Git outputs  in each line the next format: path, hash, branch name
       * Example:
       * "/Users/s_n_gr/Documents/My-Engineering-projects/traceability_system  17d7551 [main]
       *  /Users/s_n_gr/Documents/My-Engineering-projects/tso/req023           17d7551 [req023]"
       */

      console.log(
        `DEBUG: In FindMainWorktree 'git', ['worktree', 'list'] output is: ${JSON.stringify(gitOutputlines)}`,
      ); // Uncoment to debug

      const mainLine = gitOutputlines.find(
        (line) => line.includes("[main]") || line.includes("(main)"),
      );

      if (!mainLine) {
        return null;
      }

      const mainLineParts = mainLine.split(/\s+/); // Split the line in white spaces

      console.log(
        `DEBUG: In FindMainWorktree array of main line output is: ${JSON.stringify(mainLineParts)}`,
      ); // Uncoment to debug

      let mainBranchPath;
      if (mainLineParts.length >= 2 && mainLineParts[2] === "[main]") {
        console.log(`DEBUG: passed condition!!`); // Uncoment to debug
        mainBranchPath = mainLineParts[0];
      }

      console.log(
        `DEBUG: In FindMainWorktree the main branch path is: ${mainBranchPath}`,
      ); // Uncoment to debug

      if (!mainBranchPath) {
        return null;
      }

      return mainBranchPath;
    } catch (error) {
      console.error("Failed to find the main work tree path:", error.message);
    }
  }

  /**
   * Runs from a valid worktree to work properly
   * @param {path} customPath - The path of a valid worktree or subfolder from which you want to find the main worktree parent
   * @returns {path} The absolute path of the parent folder of the main branch and principal worktree
   */

  static findMainWorkTreePathParent(customPath = process.cwd()) {
    // NOTE: this should be run form one of the worktrees that the precondition or its nested folders

    const mainTreePath = this.findMainWorkTreePath(customPath);

    // Find and return parent folder path
    const mainBranchParentFolderPath = dirname(mainTreePath);

    return mainBranchParentFolderPath;
  }

  /**
   * Move the worktrees to the prefix folder when they are not there
   * @param {prefix} prefix
   * @param {path} prefixDirPath - The absolute path to the parent folder for the current working worktrees to move trees there
   * @return {path} The new full path of the main worktree within the prefix folder
   */

  static moveTreesToParent(prefix, prefixDirPath, customPath) {
    /**
     * - Scan all wortrees and populate the set with paths
     * - check each path parent
     * - handle the bool answer:
     *      * true: is okey let it there
     *      * false: move the tree to the prefix folder
     */

    const workTreePaths = new Set();

    try {
      // 1. Scan all worktrees and append to the set
      //Worktree listing for tree path collection
      const result = spawnSync("git", ["worktree", "list"], {
        cwd: customPath,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }); // takes command and flags

      if (!result || result.status !== 0 || !result.stdout) {
        throw new Error(
          "Did not found any worktree or an error occur at workTreePaths()",
        );
      }
      /**
       * Git outputs  in each line the next format: path, hash, branch name
       * Example:
       * "/Users/s_n_gr/Documents/My-Engineering-projects/traceability_system  17d7551 [main]
       *  /Users/s_n_gr/Documents/My-Engineering-projects/tso/req023           17d7551 [req023]"
       */

      const gitOutputlines = result.stdout.toString("utf8").trim().split("\n");

      console.log(`DEBUG: New array of worktree list: ${gitOutputlines}`); // Uncoment to debug

      gitOutputlines.forEach((line) => {
        const lineParts = line.split(/\s+/);
        if (lineParts[0]) {
          workTreePaths.add(lineParts[0]);
          console.log(`DEBUG: Adding new tree path: ${lineParts[0]}`); // Uncoment to debug
        } else {
          throw new Error("Corrupted line or changes in git");
        }
      });
    } catch (error) {
      console.error("❌ fail to collect tree paths", error.message);
      process.exit(1);
    }

    // 2. Check each tree parent path that is not main and handle the movement

    //Categorized the trees
    const linkedPaths = [];
    let mainAnchorPath = null;

    for (const treePath of workTreePaths) {
      const mainTree = this.findMainWorkTreePath(treePath);
      if (treePath === mainTree) {
        mainAnchorPath = treePath;
      } else {
        linkedPaths.push(treePath);
      }
    }

    // Handle linked trees first to ensure system health and not loosing the main path reference
    for (const treePath of linkedPaths) {
      const bool = this.isParentPrefix(prefix, treePath);
      if (bool === false) {
        try {
          const folderName = path.basename(treePath);
          const targetPath = path.join(prefixDirPath, folderName);

          const moveResult = spawnSync(
            "git",
            ["worktree", "move", treePath, targetPath],
            {
              cwd: treePath,
              encoding: "utf8",
              stdio: ["ignore", "pipe", "pipe"],
            },
          );

          if (moveResult.status !== 0) {
            throw new Error(
              `Git move failed for linked branch: ${moveResult.stderr}`,
            );
          }
          console.log(
            `[GIT MOVE] Successfully moved LINKED branch: ${treePath} -> ${targetPath}`,
          );
        } catch (error) {
          console.error(
            `❌ Failed to move linked worktree: ${treePath}`,
            error.message,
          );
          throw error;
        }
      }
    }

    // Hard movement of the main wortree
    if (mainAnchorPath) {
      const bool = this.isParentPrefix(prefix, mainAnchorPath);
      if (bool === false) {
        try {
          const folderName = path.basename(mainAnchorPath);
          const targetPath = path.join(prefixDirPath, folderName);

          // Move via OS
          renameSync(mainAnchorPath, targetPath);
          console.log(
            `[OS MOVE] Successfully moved MAIN anchor: ${mainAnchorPath} -> ${targetPath}`,
          );

          //THE REPAIR: Critical step to reconnect the topography
          const repairResult = spawnSync("git", ["worktree", "repair"], {
            cwd: targetPath, // Must run inside the NEW main anchor location
            encoding: "utf8",
            stdio: ["ignore", "pipe", "pipe"],
          });

          if (repairResult.status !== 0) {
            console.warn(
              `[WARN] Git repair threw a warning: ${repairResult.stderr}`,
            );
            process.exit(1);
          } else {
            console.log(
              `[GIT REPAIR] Worktree structural links re-established successfully.`,
            );
            return targetPath; // The new full path of the main worktree
          }
        } catch (error) {
          console.error(
            `❌ Failed to move main anchor: ${mainAnchorPath}`,
            error.message,
          );
          process.exit(1)
        }
      }
    }
  }
  /**
   *
   * @param {path} absolutePrefixPath - Must be the path of the prefix folder
   * @param {string} artifactName - Lower case artifact prefix and identifier num
   * @returns {path} Absolute path of the new tree dir
   */
  static createWorkTree(absolutePrefixPath, artifactName) {
    try {
      console.log(
        `This are the 2 variables that will be join to buidl the target path ${absolutePrefixPath} and ${artifactName}`,
      ); //to debug uncoment
      const workTreePath = path.join(absolutePrefixPath, artifactName);

      const result = spawnSync(
        "git",
        ["worktree", "add", workTreePath, "-b", artifactName],
        {
          cwd: process.cwd(),
          encoding: "utf8",
          stdio: ["ignore", "pipe", "pipe"], // Prevents git errors from leaking to console if run outside a repo
        },
      );

      if (result.status !== 0) {
        throw new Error(
          `Git exited with code ${result.status}. Details: ${result.stderr.trim()}`,
        );
      }
      console.log(
        `DEBUG: successfully created the new worktree at ${workTreePath} which should be inside prefix path ${absolutePrefixPath}`,
      ); // to debug uncoment
      return workTreePath;
    } catch (err) {
      console.error(
        `❌ Fail to create the new worktree`,
        err.message,
      );
      process.exit(1);
    }
  }

  /**
   *
   * @param {path} editorProjectFolder - Path to the folder that should contain the symlink connection to the worktree
   * @param {path} workTreePath - Path to the worktree that should be linked to the markdown editor
   */
  static updateSymlink(editorProjectFolder, workTreePath) {
    /**
     * 1. Detach the symlink in the folder:
     * - Handle the edge case where multiple symlink are present in the markdwon editor
     * - Unlink the symlink present
     *
     */
    try {
      const symlinksListing = readdirSync(editorProjectFolder, {
        withFileTypes: true,
      });
      const symlinkFiltered = symlinksListing.filter((entry) =>
        entry.isSymbolicLink(),
      ); // Build an array of only symlinks
      const symlinkCount = symlinkFiltered.length; // Find the number of symlinks in the editor folder

      //Handeling multiple symlink conflict
      if (symlinkCount > 1) {
        throw new Error(
          `Your markdown editor dir: ${editorProjectFolder} should only contain one symlink, manually fix the conflict`,
        );
      } else if (symlinkCount == 1) {
        const currentSymlinkPath = path.join(
          editorProjectFolder,
          symlinkFiltered[0].name,
        );
        // unlink the present symlink
        unlinkSync(currentSymlinkPath);
      }
      // Handle only no symlinks at all, clean init state by simply not doing anything
    } catch (err) {
      console.error(`❌ Fail to detach the symlink `, err.message);
      process.exit(1);
    }

    /**
     * 2. Create the new symlink
     */

    try {
      const docsTreePath = path.join(workTreePath, "docs");
      //if(!openSync())
      const docsEditorPath = path.join(editorProjectFolder, "docs"); // the new folder docs that will have the symlink
      symlinkSync(docsTreePath, docsEditorPath);

      console.log(
        `DEBUG: New simlink successfuly created from ${docsEditorPath} to : ${docsTreePath}`,
      ); // to debug uncoment
    } catch (err) {
      console.error(
        `❌ Fail to create the new symlink connection for the tree: ${workTreePath}`,
        err.message,
      );
      process.exit(1);
    }
  }
  static launchVSCode(targetPath) {
    const absolutePath = path.resolve(targetPath);
    let command;
    let args;

    // Define the exact binary and arguments per OS
    if (process.platform === "win32") {
      command = "cmd.exe";
      args = ["/c", "code", absolutePath];
    } else if (process.platform === "darwin") {
      command = "open";
      args = ["-a", "Visual Studio Code", absolutePath];
    } else {
      command = "code";
      args = [absolutePath];
    }

    // Spawn the process
    const child = spawn(command, args, {
      detached: true,
      stdio: "ignore", // Ignore standard input/output so Node doesn't wait for it
    });

    //Handle errors in process gracefully
    child.on("error", (err) => {
      console.error(`❌ Fail to start VS Code. Error: ${err.message}`);
    });

    // Unreference the child process so Node can exit while VS Code stays open
    child.unref();

    console.log(`Launched VS Code for: ${absolutePath}`);
  }

  /**
   * @param {string} configName - Config file name
   * @returns
   */
  static validateConfigPresence(configName) {
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

  /**
   * @Description Creates a config file in the worktree folder, of course only if run from a valid worktree or worktree subfolder
   * @param {string} configName - Config file name
   * @returns {path} Path to the created config file
   */
  static createConfigFile(configName) {
    const worktreePath = this.findWorktreePath();
    const newFilePath = path.join(worktreePath, configName);
    const configDefaultData = {
      gitWorkTreeScriptConfig: {
        markdownEditorFolderPath: "",
        projectPrefix: "",
      },
    };

    try {
      writeFileSync(newFilePath, JSON.stringify(configDefaultData, null, 2));
      console.log("File created successfully!");
      return newFilePath;
    } catch (err) {
      console.error("Failed to create file:", err);
    }
  }
  /**
   * @description When the property does not exist or is empty this method will ask the user to fill it, when it does have data then it will simply let the property untouched
   * @param {string} property - Property of the config file you want to ensure has data
   * @param {path} absolutePath - Absolute path of the config file
   * @returns
   */
  static async setUpPropertiesOfConfig(property, absolutePath) {
    // Check if property in file contains data
    let configData;

    console.log(`Currently in properties set up!!`); //Uncoment to debug
    try {
      configData = readFileSync(absolutePath, "utf8");
      console.log(`DEBUG: current data in config file: ${configData}`); //Uncoment to debug
    } catch (error) {
      console.error(`Fail to access the config file ${absolutePath}`, error);
    }

    let configJSON;
    try {
      configJSON = JSON.parse(configData);
      console.log(
        `DEBUG: Successfully parse the config data: ${JSON.stringify(configJSON)}`,
      ); //Uncoment to debug
    } catch (err) {
      console.error("Fail to parse the config data", err.message);
    }

    const jsonProp = configJSON.gitWorkTreeScriptConfig[property];
    if (!jsonProp || jsonProp == "") {
      console.log(`DEBUG: Successfully Realize there is no ${property}`); //Uncoment to debug
      const rl = createInterface({ input, output });

      try {
        // This pauses execution until the user hits 'Enter'
        const answer = await rl.question(`What is your project ${property}: `);

        configJSON.gitWorkTreeScriptConfig[property] = answer; // Add the new property data to the json config object

        console.log(
          `DEBUG: The answer was: ${answer}, this is the new cofig file data`,
          JSON.stringify(configJSON),
        ); //Uncoment to debug

        // Write the config with the new data
        writeFileSync(absolutePath, JSON.stringify(configJSON));

        const systemconfigName = basename(absolutePath);
        this.saveConfigSettings(systemconfigName);

      } catch (err) {
        console.error(`❌ Fail to set up the config property  ${err.message}`);
      } finally {
        rl.close();
      }
    } else {
      return;
    }
  }

  /**
   * 
   * @param {string} property - Property to extract
   * @param {path} absolutePath - Absolute path to the config file
   * @returns {string} Data extracted from the config
   */

  static accessPropertiesOfConfig(property, absolutePath) {
    let configData;
    try {
      configData = readFileSync(absolutePath, "utf8");
    } catch (error) {
      console.error(`Fail to access the config file ${absolutePath}`, error);
    }

    let configJSON;
    try {
      configJSON = JSON.parse(configData);
    } catch (err) {
      console.error("Fail to parse the config data");
    }

    const jsonProp = configJSON.gitWorkTreeScriptConfig[property];
    console.log(
      `Obtained the prop ${property} from the config, its value is: ${jsonProp} `,
    ); // Debug log uncoment!
    return jsonProp;
  }

  static saveConfigSettings(configName) {
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
      console.error(error.message || error);
      process.exit(1);
    }
  }

  /**
   * @description This method performs a git rebase from the head of main
   * @description Should be run directly from the worktree or use a custom cwd in the arguments
   * @param {path} customPath - Allows you to set a custom path for the operation, fallback to current cwd 
   */
  static rebaseSquash(cwd = process.cwd(), targetBranch = 'main'){

    try{

    
    // Calculate the merge-base commit hash synchronously
    const mergeBase = spawnSync('git', ['merge-base', 'HEAD', targetBranch], {
      cwd,
      encoding: 'utf-8',
    });

    if (mergeBase.error) {
    throw new Error(`Failed to spawn git merge-base: ${mergeBase.error.message}`);
  }
  if (mergeBase.status !== 0) {
    throw new Error(`git merge-base failed: ${mergeBase.stderr.trim()}`);
  }

  const baseCommit = mergeBase.stdout.trim();

  //Run interactive rebase against base commit
  const rebase = spawnSync('git', ['rebase', '-i', baseCommit],{
    cwd,
    stdio: 'inherit',
  })

  
  if (rebase.error) {
    throw new Error(`Failed to spawn git rebase: ${rebase.error.message}`);
  }

  if (rebase.status !== 0) {
    throw new Error(`git rebase exited with status code ${rebase.status}`);
  }

  

    
  }
  catch(error){
    console.error(`Rebase and Squash operation failed: ${error}`);
    process.exit(1);
  }
}

/**
 * @description Method to find the current branch
 * @param {path} cwd - Allows you to set a custom path for the operation, fallback to current cwd 
 * @returns {string} Current checkout branch
 */
static currentBranchName(cwd = process.cwd()){
  try{
    const branch = spawnSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'],{
      cwd: cwd,
      encoding: 'utf-8'
    })

    if(branch.error){
       throw new Error(`Failed to spawn git current branch: ${branch.error.message}`);
    }
    if(branch.status !== 0){
       throw new Error(`Failed to find current git branch: ${branch.status}`);
    }

    return branch.stdout.trim();

  }
  catch(error){
    console.error(`Git Branch operation failed: ${error}`);
    process.exit(1);

  }
}

/**
 * @description Method performs a merge to main
 * @param {path} cwd - The path of main, fallback current cwd
 * @param {string} branch - The name of the branch which will be merged
 */
static mergeOperation(cwd = process.cwd(), branch){
  try{
    const merge = spawnSync('git', ['merge', '--ff-only', branch],{
      cwd: cwd,
      encoding: 'utf-8'
    })

    if(merge.error){
       throw new Error(`Failed to spawn git merge operation: ${remove.error.message}`);
    }

    if(merge.status !== 0){
       throw new Error(`Failed to merge ${branch} to main: ${remove.status}`);
    }

    console.log(`Successfully merged ${branch} into current branch.`);
  }
  catch(error){
    console.error(`The merge failed: ${error}`);
    process.exit(1);
  }
}

  /**
   * @description Removes the worktree must be run from a valid worktree
   * @param {path} targetTree - The tree you want to delete
   */
  static removeWorktree(targetTree){
    try{

      const remove = spawnSync('git', ['worktree', 'remove', targetTree],{
      cwd: process.cwd(),
      encoding: 'utf-8'
    })

    if(remove.error){
       throw new Error(`Failed to spawn git remove operation: ${remove.error.message}`);
    }

    if(remove.status !== 0){
       throw new Error(`Failed to delete ${basename(targetTree)} worktree: ${remove.status}`);
    }

    console.log(`Successfully delete ${basename(targetTree)}.`);

    }
    catch(error){
      console.error(`The worktree removal failed: ${error}`);
      process.exit(1);
    }
  }

  /**
   * @description Remove the branch 
   * @param {path} [cwd=process.cwd()] cwd - The path of main or worktree that doenst have checkout the branch to delete, fallback current cwd
   * @param {string} branchName - The name of the branch to delete
   */
  static removeBranch(cwd = process.cwd(), branchName){
    try{

      //Use -d for safe delete
      const remove = spawnSync('git', ['branch', '-d', branchName],{
      cwd: cwd,
      encoding: 'utf-8'
    })

    if(remove.error){
       throw new Error(`Failed to spawn git branch remove operation: ${remove.error.message}`);
    }

    if(remove.status !== 0){
       throw new Error(`Failed to delete ${branchName} branch: ${remove.status}`);
    }

    console.log(`Successfully delete the branch ${branchName}.`);

    }
    catch(error){
      console.error(`The branch removal failed: ${error}`);
      process.exit(1);
    }

  }
}

