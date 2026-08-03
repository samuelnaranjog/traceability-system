import fs from "node:fs";
import path from "node:path";

/**
 * @description Finds files & directories recursively. Stores the files data in an object of arrays
 * @param {string} folderPath - Must be the path of the folder over which the files must be scan and mapped be perform
 * @param {string[]} excludeList - Files that shouldn't be stored
 * @param {import("../synapse-engine/TraceabilityPipeline.js").DirectoryAndFileMap} dirsAndFilesObj 
 */

export default function SearchAndDivide(folderPath, excludeList, dirsAndFilesObj ) {


  try {

    
    const arrItems = fs.readdirSync(folderPath, { withFileTypes: true }); 
    const filteredItems = arrItems.filter(
      (item) => !excludeList.includes(item.name),
    );
    //console.log('Items found filtered: ', filteredItems); // This should be deleted

    // Separating files from directories
    filteredItems.forEach((item) => {
      if (item.isFile()) {
        dirsAndFilesObj.files.push(item);
      } else {
        // If item as been added then avoid adding it again and delete it Specially directories

        dirsAndFilesObj.dirs.push(item);
      }
    });

    /*
    // AVOIDING A INFINITE RECURSION LOOP
    // - Before Iterating over the directories that are store, find the current one and delete it
    // - The stop condition is the directories array being completely empty, indicating all dirs have been read and files extracted
    */

    const currentFolderLocation = dirsAndFilesObj.dirs.findIndex(
      (dir) => path.join(dir.path, dir.name) === folderPath, //Checks if the item is actually the scanned directory and figure out its index!
    ); // Breaks once true returning the index of that elements otherwise -1

    //console.log("Index of found element: ", currentFolderLocation);

    if (currentFolderLocation != -1) {
      //console.log("Item to pop ", dirsAndFilesObj.dirs[currentFolderLocation]);
      dirsAndFilesObj.dirs.splice(currentFolderLocation, 1); // Splice deletes the element at a given index and a number of elements from that index 
    }
    //console.log("Dirs state after pop ", dirsAndFilesObj.dirs);

    //console.log("Lenght of dir: ", dirsAndFilesObj.dirs.length);

    // Recursive call when directories to explore and extract but also works as stop condition
    if (dirsAndFilesObj.dirs.length > 0) {
      dirsAndFilesObj.dirs.forEach((dir) => {
        SearchAndDivide(
          path.join(dir.path, dir.name),
          excludeList,
          dirsAndFilesObj,
        );
      });
    } else {
      return dirsAndFilesObj;
    }
  } catch (error) {
    console.error("Program did not found and divide, this is the error:", error);
    return error;
  }
}
