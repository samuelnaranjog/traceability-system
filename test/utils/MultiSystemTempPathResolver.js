 import path from "node:path";
 import fs from 'node:fs';

 /**
 * Resolves a path safely across all OS environments, handling macOS temp directory 
 * symlinks and Windows separators, without throwing ENOENT if the path doesn't exist yet.
 */
export default function getCanonicalPath (targetPath){
    let currentPath = path.resolve(targetPath);
    let pathSuffix = '';

    // Walk up the directory tree until we find a folder that physically exists
    while (!fs.existsSync(currentPath) && currentPath !== path.parse(currentPath).root) {
        // Prepend the missing folder name to the suffix
        pathSuffix = path.join(path.basename(currentPath), pathSuffix);
        // Move one directory up
        currentPath = path.dirname(currentPath);
    }

    // realpathSync the existing portion, then re-attach the pending suffix
    const existingRealRoot = fs.existsSync(currentPath) ? fs.realpathSync(currentPath) : currentPath;
    return path.join(existingRealRoot, pathSuffix);
};
