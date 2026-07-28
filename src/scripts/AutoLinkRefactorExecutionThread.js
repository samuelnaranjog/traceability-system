// @trace REQ-020 @
// This is the function that executes the system task

import { config } from "node:process";
import SearchAndDivide  from "./FileSelectionHelper.js";
import ExtractDataAndMatch from "./PathExtractionHelper.js";
import ts from "./TraceabilityPipeline.js"
import { match } from "node:assert";

// Project Root path
import appRoot from "app-root-path";




// CONFIGURATION FOR THE RUN
 

// Helper to invert { CategoryLabel: [identifiers...] } into Map<identifier, CategoryLabel>
function createCategoryLookupMap(ruleDefinitions) {
  const map = new Map();
  for (const [categoryLabel, items] of Object.entries(ruleDefinitions)) {
    for (const item of items) {
      map.set(item, categoryLabel);
    }
  }
  return map;
}

// Build Artifact Lookup Map
const artifactCategoryMap = createCategoryLookupMap({
  '📕 Architecture': ["VS", "ADR"],
  '📓 Requirements': ["REQ"],
  '🧪 Prototypes': [],
});

// Build Extension Lookup Map
const extensionCategoryMap = createCategoryLookupMap({
  '⚙️ Core Logic (Backend/Systems)': ["js"],
  '🎨 Client Layer (Frontend/UI)': ["py"],
  '🛡️ Verification (Tests & Config)': [],
});


const CONFIG = {
    vaultPath: appRoot.path,
    excludeList: [
        ".gitignore",
        ".git",
        ".DS_Store",
        "node_modules",
        "README.md",
        "package-lock.json",
        "package.json",
        ".wakatime-project",
    ],
    acceptedSystemArtifacts: ["REQ", "ADR", "VS"],
    markdownHeaderGuidelines: {header: ["REQ", "VS"], noHeader: ["ADR"]},
    treaceabilityKeyWords: {start: "@trace", end: "@"},
    fileTitleIdentifierFilteringRegex: /\b[A-Z]+-\d+/, //Regex for selecting Artifact format from text e.g: From TSO-ADR-000 the regex will select ADR-000
    fileNameFilterRegex: /(?<=_)[a-zA-Z_]+/, //Regex for selecting the name based on the underscore "_" convention given to the file
    fileIdentifierNoNumFilteringRegex: /(?<=-)[A-Z]+(?=-)/, // Select only the artifact for TSO-REQ-001 it will extract "REQ"
    fileIdentifierNoNumNorProjectRegex: /\b[A-Z]+(?=-\d+)/, // Select only the artifact from "REQ-001" it will extract "REQ"
    fileExtensionExtractionRegex: /(?<=\.)[a-z]+/, // Selects from a . to find the extension
    fileTitleAvoidExtensionReg: /^[^.]+/, // Select all file title data before the "."
    connectionInsertionTitleRegex: /^connections?$/i,
    /**
     * Guidelines:
     * - Specific file title characteristics that the algorithm should use to classify the files pointed as connections
     */
    classificationGuidelines: {
        artifactCategoryMap: artifactCategoryMap,
        extensionCategoryMap: extensionCategoryMap,
    },
    synapsePastStateName : '.synapse-state.json'
    
};

/**
 * Data structures initialization
 */

/** @type {import("./TraceabilityPipeline.js").TraceableFile} */
/** @type {import("./TraceabilityPipeline.js").ArtifactRelatedFileConnection } */

const artifactRelatedToFiles = {};

/** @type {import("./TraceabilityPipeline.js").innerItem} */
/** @type {import("./TraceabilityPipeline.js").DirectoryAndFileMap} */
 
const dirsAndFileMap = {
    files: [],
    dirs: [],
};

/**
 * The Main Execution Thread
 */


/** @param {string} vaultPath - Must be the path of the folder over which the files must be scan and mapped be perform */
export default function runTraceabilityPipeline(vaultPath = CONFIG.vaultPath /* Default argument */){
    console.log('🚀 Starting Traceability Pipeline...');

    try{
    
        /** 
         * 1. Map the files:
         * - Takes the data structure  dirsAndFileMap and populates it
         * - Stores the files avoiding the exclude list
         */
        SearchAndDivide(vaultPath, CONFIG.excludeList, dirsAndFileMap); 
        
        /**
         * 2. Identify files with connections and map it related files:
         * - Populates artifactRelatedToFiles with the relationships and keys(system artifact identifier)
         */
        ExtractDataAndMatch(dirsAndFileMap, artifactRelatedToFiles, CONFIG.treaceabilityKeyWords.start, CONFIG.treaceabilityKeyWords.end, CONFIG.acceptedSystemArtifacts  )

        /**
         * 3. Artifact with connection looping time:
         * - Iterate over the artifactRelatedToFiles keys which are the artifact that are mention as a connection in another file
         * - In each iteration perform the key steps for the autolinkrefacto feature
         */

        

        // Handle the "3 side comparison" leveraging past and present state
        const synapsePath = ts.extractTopLevelFilePath(CONFIG.synapsePastStateName);

        const synapsePastStateObj = ts.parseFileAndCatch(synapsePath);
        

        /** @type {string[]} */
        const artifactsWithConnections = Object.keys(artifactRelatedToFiles)

        for (const artifact of artifactsWithConnections) {
            
            // Classification Data Structure
         /** @type {import('./TraceabilityPipeline.js').linkTypeMap} */
        const currentClassificationMap = new Map();
            // 4. Find the artifact path
            console.log(`DEBUG: artifact being searched ${artifact}`) //uncoment to debug
            const currentArtifactPath = ts.findArtifactFile(artifact, dirsAndFileMap.files, CONFIG.fileTitleIdentifierFilteringRegex, CONFIG.fileNameFilterRegex )
            console.log(`DEBUG: Path of artifact being returned: ${currentArtifactPath}`) //uncoment to debug
            //Get ready for 3 state data
            const fileLinksWithType = ts.buildFileLinks(currentArtifactPath) ;
            console.log(`DEBUG: File links with type being returned: ${JSON.stringify(fileLinksWithType)}. !!MORE TESTING REQUIRED!!`) //uncoment to debug
            const pastRefsLinks = ts.buildRefsLinks(artifact, synapsePastStateObj)
            console.log(`DEBUG: File links with type being returned: ${JSON.stringify(pastRefsLinks)}. `) //uncoment to debug


            //CHECK TEMP: what am i trying to iterate overç
            console.log(`DEBUG: Artifact connections list: ${JSON.stringify(artifactRelatedToFiles)}. `) //uncoment to debug
            const currentRefsLinks =  ts.buildRefsLinks(artifact, artifactRelatedToFiles)

            // Classify with the 3 state data
            ts.classifyAndConquerHard(currentClassificationMap,fileLinksWithType, pastRefsLinks, currentRefsLinks)

            console.log(`DEBUG: Relations being passed a siterable: ${JSON.stringify(artifactRelatedToFiles[artifact])}. `) //uncoment to debug
            ts.classifyAndConquerDynamic(currentClassificationMap, artifactRelatedToFiles[artifact], CONFIG.classificationGuidelines, CONFIG.fileTitleIdentifierFilteringRegex  )

            
            //5. Access the artifact connections and classify them
            // DEPRACATE: const currentArtifactClassifiedConnections = ts.classifyArtifactConnections(artifactRelatedToFiles[artifact], CONFIG.classificationGuidelines, CONFIG.fileIdentifierNoNumFilteringRegex, CONFIG.fileExtensionExtractionRegex, CONFIG.acceptedSystemArtifacts )


            /** 6. Build a markdown table:
             *  - Determine wheather the artifact selected should have header or not
             *  - Extract the artifact identifier e.g: "REQ" from the current format "REQ-000"
             */

            const identifierNoNum = artifact.match(CONFIG.fileIdentifierNoNumNorProjectRegex)?.[0]; // Useful data for step 6 and 7

            
            if(identifierNoNum && CONFIG.acceptedSystemArtifacts.includes(identifierNoNum)){

                const connectionMDTable = ts.buildASTMarkdownConnectionTable(currentClassificationMap, currentArtifactPath, CONFIG.fileTitleAvoidExtensionReg );
                ts.writeASTConnectionsToArtifact(currentArtifactPath, connectionMDTable ,CONFIG.connectionInsertionTitleRegex )
                
            }
            else{
                    throw new Error(`Invalid identifier ${identifierNoNum} not part of system artfacts ${JSON.stringify(CONFIG.acceptedSystemArtifacts)}` )}
            }
            

            
        
    }
    catch (error) {
        console.error('❌ FATAL ERROR in Main Thread:', error);
        process.exit(1); // Fail the execution thread cleanly
    }

}

