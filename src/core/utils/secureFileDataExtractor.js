import {readFileSync} from "node:fs";
/**
 * @description Extract with try and catch the data from a file in a synchronous way
 * 
 * 
 */
export default function findFileDataSync(absolutePath){
    
            try {
                const artifactData = readFileSync(absolutePath, "utf8");
                return artifactData
            } catch (error) {
                console.error(`Fail to access the file ${absolutePath}`, error);
            }
}