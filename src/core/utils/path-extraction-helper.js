// @trace REQ-020 ADR-009 @ 

import fs from 'node:fs';
import path from 'node:path';
import findFileDataSync from './secureFileDataExtractor.js';


/**
 * @param {import('../synapse-engine/TraceabilityPipeline').DirectoryAndFileMap} itemsObj - The object containing the files array of objects with paths and name
 * @param {RegExp} regexStart - Key identifier from where to select relationship  data
 * @param {RegExp} regexEnd - Key identifier end of the selection
 * @param {string[]} acceptedIdentifiers: The identifiers the code should select and map (valid artifact dentifiers)
 * @returns {import('../synapse-engine/TraceabilityPipeline').ArtifactRelatedFileConnection} storageStructure - The empty object where the artifacts will map the files that mention them
 */

//put this in a helper ->>
export default function ExtractDataAndMatch(itemsObj, regexStart, regexEnd, acceptedIdentifiers) {
  
  /**@type {import('../synapse-engine/TraceabilityPipeline').ArtifactRelatedFileConnection} */
  const storageStructure = {};

  //Tracks every file path we have already scanned in this run
  const processedFilePaths = new Set();

  // Regex logic for: Expression extraction & data filtering
    const possibleBetweenKeywordDataReg = new RegExp(`${regexStart}([\\s\\S]*?)${regexEnd}`, 'g'); //Start to End data selection using *keywords*
    const candidateRegex = /(?<=^|\s)[A-Z]+-\d+/g; //Possible candidates that match artifact identifier structure
    const artifactIdentifierRegex = /\b[A-Z]+/g; // Extracts only the *artifact identifier*, later is compare to the valid artifact in the system


  itemsObj.files?.forEach(file => {

    

    const fullPath = path.join(file.path, file.name);

    if(processedFilePaths.has(fullPath)) return;

    // Add path of the current file as completely processed
      processedFilePaths.add(fullPath);

    //Read the file data 
    const fileData = findFileDataSync(fullPath);
    if (!fileData) return;

    //Extract content between regexStart and regexEnd 
    const candidateMatches = [...fileData.matchAll(possibleBetweenKeywordDataReg)];
    if (candidateMatches.length === 0) return;
    console.log(`DEBUG: Candidate mathces of ${JSON.stringify(file)}:`, candidateMatches); //temporay log


    // Filter for valid identifiers & strip duplicates mention in same file using a Set
    const uniqueIdentifier = new Set();
    let extractedDataBetweenKeys;
    candidateMatches.forEach(candidate => {

      const blockText = candidate[1];
      if (blockText) {
        console.log(`\n--- [AUDIT] Processing text block captured between keywords ---`);
        console.log(`[AUDIT] Raw Block Content: "${blockText.trim()}"`);

        const matches = blockText.match(candidateRegex); // Returns Array or null
        
        if (matches) {
          console.log(`[AUDIT] Candidate IDs matched:`, matches);
          
          matches.forEach(id => {
            const cleanId = id.trim();
            uniqueIdentifier.add(cleanId);
            console.log(`[AUDIT] -> Added candidate to file Set: "${cleanId}"`);
          });
        } else {
          console.log(`[AUDIT] ⚠️ No candidate identifiers found in this block.`);
        }
      } else {
        console.log(`[AUDIT] ⚠️ Captured block was empty.`);
      }
    })

    console.log(`DEBUG: Build file  ${file.name} connection to artifacts data: ${JSON.stringify([...uniqueIdentifier])}->`); //temporay log

    if (uniqueIdentifier.size == 0) return



    // Filter accepted artifact identifiers from identifier candidates
    const filteredUniqueIdentifiers = new Set()

    for(const identifier of uniqueIdentifier){
      const artifactPrefix = identifier.match(artifactIdentifierRegex)?.[0];
      console.log('DEBUG: Possible prefix extracted: ', artifactPrefix); // Tempo log
      if(acceptedIdentifiers.includes(artifactPrefix)) filteredUniqueIdentifiers.add(identifier);
    }

    console.log('DEBUG: Filtered from include list identifier prefix: ', [...filteredUniqueIdentifiers]); // Tempo log




      // Storing the connection, only using valid identifiers
    for(const identifier of filteredUniqueIdentifiers){
        if (!storageStructure[identifier]){
           storageStructure[identifier] = [];
        }

        // Append the new file info related to the identifier for proper mapping
        storageStructure[identifier].push({ name: file.name, path: fullPath});
    }
      

      console.log('Data being store with neat references:', storageStructure)

  })

  console.log('Complete storageStructure Data: :', storageStructure)
  return storageStructure;
};

//ExtractDataAndMatch(mockReaddirOutput , storageStructure, wordA, wordB)