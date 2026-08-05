import { readFileSync } from "node:fs";

/**
     * @description Reads and extract the parsed json from a file.
     * @param {string} absolutePath - Absolute path the file to parse
     * @returns {Object} Parsed Object from JSON file data
     */
   export function parseFileAndCatch (absolutePath){
        let fileData;

        try {
              fileData = readFileSync(absolutePath, "utf8");
              //console.log(`DEBUG: current data in file to parse: ${fileData}`); //Uncoment to debug
            } catch (error) {
              console.error(`Fail to access the file ${absolutePath}`, error.message);
            }
        
            let dataJSON;
            try {
              dataJSON = JSON.parse(fileData);
              //console.log(`DEBUG: Successfully parse the file data: ${JSON.stringify(dataJSON)}`,); //Uncoment to debug

              return dataJSON;
            } catch (error) {
              console.error("Fail to parse the file data", error.message);
            }
            
    }