#!/usr/bin/env node

// This is the function that executes the system task
import url from 'url';
import path from 'path';
import { config } from "node:process";
import SearchAndDivide from "../utils/FileSelectionHelper.util.js";
import ExtractDataAndMatch from "../utils/path-extraction-helper.util.js";
import ts from "./TraceabilityPipeline.js"
import { match } from "node:assert";
import { createConfigFile } from "../utils/config-file-operations.util.js";
import { validateConfigPresence } from "../utils/config-file-operations.util.js";
import { parseFileAndCatch } from "../utils/parse-file-&-catch.util.js";
import buildSynapseWorkingData from "../utils/build-synapse-working-data.util.js";
import { systemSchemaValidation } from "../utils/validate-system-config-schema.util.js";
import { findWorkTreePath } from "../git-tree-workflow/GitWorkflowOperations.js";


// The Main Execution Thread
const ENGINE_NAME = "[Synapse]"
let startTime;
let endTime;


/** @param {string} vaultPath - Must be the path of the folder over which the files must be scan and mapped be perform */
/**@trace SREQ-020D */ 
export default function runTraceabilityPipeline(vaultPath /* Default argument */){

    try{

        // System integrity status check
        startTime = performance.now();
        let [hasConfig, configPath] = validateConfigPresence(); 
        if (!hasConfig) configPath = createConfigFile()

        const systemConfigData = parseFileAndCatch(configPath);

        
        const systemValidatedData = systemSchemaValidation("synapse-engine", systemConfigData)
        
        const CONFIG = buildSynapseWorkingData(systemValidatedData); 




        // Data structures initialization

        /** @type {import("./TraceabilityPipeline.js").DirectoryAndFileMap} */
 
        const dirsAndFileObj = {
        files: [],
        dirs: [],
        };
  
       //Synapse Engine Pipeline:

        // Map the files:
        //  - Takes the data structure  dirsAndFileMap and populates it
        //  - Stores the files avoiding the exclude list
        
        SearchAndDivide(vaultPath, CONFIG.excludeList, dirsAndFileObj); 
        
        
        // Identify files with connections and connected to related artifacts:
        //   - Populates artifactRelatedToFiles with the relationships values and keys(system artifact identifier)
        

        const artifactRelatedToFiles = ExtractDataAndMatch(dirsAndFileObj, CONFIG.treaceabilityKeyWords.start, CONFIG.treaceabilityKeyWords.end, CONFIG.acceptedSystemArtifacts, CONFIG.textIdentifierFilteringRegexG, CONFIG.artifactIdPrefix  )

        // Artifact with connection looping time:
        //  - Iterate over the artifactRelatedToFiles keys which are the artifact that are mention as a connection in another file
        //  - In each iteration perform the key steps for the autolinkrefacto feature



        const synapsePath = ts.extractTopLevelFilePath(CONFIG.synapsePastStateName);

        const synapsePastStateObj = ts.parseFileAndCatch(synapsePath);
        

        /** @type {string[]} */
        const artifactsWithConnections = Object.keys(artifactRelatedToFiles)
        
        for (const artifact of artifactsWithConnections) {
            
            // Classification Data Structure
            /** @type {import('./TraceabilityPipeline.js').mapOfClassifiedLinks} */
            const currentClassificationMap = new Map();

            // Find the artifact path

            //console.log(`DEBUG: artifact being searched ${artifact}`) //uncoment to debug
            const currentArtifactPath = ts.findArtifactFile(artifact, dirsAndFileObj.files, CONFIG.fileTitleIdentifierFilteringRegex, CONFIG.fileNameFilterRegex )
            //console.log(`DEBUG: Path of artifact being returned: ${currentArtifactPath}`) //uncoment to debug

            // Handle the "3 side comparison" leveraging past, current and present state:
            // - Extract the 3 states for the current artifact
            // - Populate currentClassificationMap with the classified hand written links
            
            const fileLinksWithType = ts.buildFileLinks(currentArtifactPath) ;
            //console.log(`DEBUG: File links from artifact extracted by 'fileLinksWithType' being returned: ${JSON.stringify(Object.fromEntries(fileLinksWithType))}.`) //uncoment to debug

            const pastRefsLinks = ts.buildRefsLinks(artifact, synapsePastStateObj)
            //console.log(`DEBUG: Referential File links from 'pastRefsLinks' being returned: ${pastRefsLinks? JSON.stringify([...pastRefsLinks]) : pastRefsLinks}. `) //uncoment to debug


            //console.log(`DEBUG: Artifact connections list: ${JSON.stringify(artifactRelatedToFiles)}. `) //uncoment to debug
            const currentRefsLinks =  ts.buildRefsLinks(artifact, artifactRelatedToFiles)
            //console.log(`DEBUG: Referential File links from 'currentRefsLinks' being returned: ${JSON.stringify([...currentRefsLinks])}. `) //uncoment to debug
            
            ts.classifyAndConquerHard(currentClassificationMap,fileLinksWithType, pastRefsLinks, currentRefsLinks)

            // Access the artifact connections in current state, classify them and ensure no duplicates are added

            //console.log(`DEBUG: Relations being passed a siterable: ${JSON.stringify(artifactRelatedToFiles[artifact])}. `) //uncoment to debug
            ts.classifyAndConquerDynamic(currentClassificationMap, artifactRelatedToFiles[artifact], CONFIG.classificationGuidelines, CONFIG.fileIdentifierNoNumFilteringRegex, CONFIG.fileExtensionExtractionRegex, CONFIG.acceptedSystemArtifacts)
            //console.log(`DEBUG: Classification Result of the Whole data: ${JSON.stringify(Object.fromEntries(currentClassificationMap))}. `) //uncoment to debug --> showS!!!!
            

            // Build a markdown table:
            //  - Extract the artifact identifier e.g: "REQ" from the current format "REQ-000"
            //  - Build the AST table
            //  - Writte the AST table in the current artifact file
            
            const identifierNoNum = artifact.match(CONFIG.fileIdentifierNoNumNorProjectRegex)?.[0]; // Useful data for step 6 and 7

            if(identifierNoNum && CONFIG.acceptedSystemArtifacts.includes(identifierNoNum)){
   
                const connectionMDTable = ts.buildASTMarkdownConnectionTable(currentClassificationMap, currentArtifactPath, CONFIG.fileTitleAvoidExtensionReg );
                const result = ts.writeASTConnectionsToArtifact(currentArtifactPath, connectionMDTable ,CONFIG.connectionInsertionTitleRegex )
                // console.group(`📄 Markdown Result: ${currentArtifactPath}`);
                // console.log(result);
                // console.groupEnd();

            }
            else{
                    throw new Error(`Invalid identifier ${identifierNoNum} not part of system artfacts ${JSON.stringify(CONFIG.acceptedSystemArtifacts)}` )
            }
        }

        // Update the connections .synapse-state.json snapshot
        ts.writeJsonDataToFile(artifactRelatedToFiles, synapsePath);

        // Clear data structures after all runned successfully
        Object.keys(dirsAndFileObj).forEach(key => delete dirsAndFileObj[key]);
        Object.keys(artifactRelatedToFiles).forEach(key => delete artifactRelatedToFiles[key]);

        endTime = performance.now(); 
        

    }
    catch (error) {
        console.error(`💥 ${ENGINE_NAME} fatal error in the main execution thread:`, error);
        process.exit(1); // Fail the execution thread cleanly
    }

}

// Prevents auto-execution during Jest test imports
const isDirectCliInvocation = process.env.NODE_ENV !== 'test';

if (isDirectCliInvocation) {
  try {
    const VAULT_PATH = findWorkTreePath();
    console.log(`⚡${ENGINE_NAME} Initializing synapse traceability engine at: ${VAULT_PATH}`);
   
    runTraceabilityPipeline(VAULT_PATH);

    // Metrics
    const duration = endTime - startTime;

    let formattedDuration;
    if (duration < 1000) formattedDuration = `${Math.round(duration)}ms`;
    else if(duration >= 1000 && duration < 60000)  formattedDuration = `${(duration / 1000).toFixed(2)}s`;
    else formattedDuration = `${(duration / 60000).toFixed(2)}m`;
    
    console.log(`🌐${ENGINE_NAME} Successfully built connections in ${formattedDuration} .`);
  } catch (error) {
    console.error(`${ENGINE_NAME} Engine execution failed:`, error.message);
    process.exit(1);
  }
}

