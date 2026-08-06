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

/**
 * 
 * @param {object} validatedConfig - Object passed through a validation schema
 */

// @trace SREQ-020D 
// Implements: ADR-010
export default function buildSynapseWorkingData(validatedConfig){

    const synapseEngineConfig = validatedConfig;
    // Dynamic Maps for custom categorization
    const artifactCategoryMap = createCategoryLookupMap(synapseEngineConfig.classificationGuidelines.artifactCategoryMap);
    const extensionCategoryMap = createCategoryLookupMap(synapseEngineConfig.classificationGuidelines.extensionCategoryMap);
    
    //Config definition
    const CONFIG = {

        // THIS ARE THE PREDEFINED SYSTEM CONSTRAINTS AND VALUES FOR THE SYNAPSE ENGINE
        /**@trace SREQ-020A @ */
        treaceabilityKeyWords: {start: "@trace", end: "@"},
        /**@trace SREQ-020B @ */
        textIdentifierFilteringRegexG: /(?<=^|\s)[A-Z]+-\d+[A-Z]?/g, // Global: from "REQ-001A someText" extracts "REQ-001A"
        fileTitleIdentifierFilteringRegex: /(?<=-)[A-Z]+-\d+[A-Z]?/, //Regex for selecting Artifact format from text e.g: From TSO-ADR-000_Some_title the regex will select ADR-000, from TSO-SREQ-000A -> "SREQ-000A".
        artifactIdPrefix: /\b[A-Z]+/g, //Global: Regex selects only artifact Identifier no num e.g: from REQ-001 -> "REQ", from SREQ-000 -> "SREQ"
        fileNameFilterRegex: /(?<=\d_)[a-zA-Z0-9_]+/, //Regex for selecting the name based on the underscore "_" convention given to the file
        fileIdentifierNoNumFilteringRegex: /(?<=-)[A-Z]+(?=-)/, // Select only the artifact for TSO-REQ-001 it will extract "REQ"
        fileIdentifierNoNumNorProjectRegex: /\b[A-Z]+(?=-\d+)/, // Select only the artifact from "REQ-001" it will extract "REQ"
        fileExtensionExtractionRegex: /(?:\.([^./\\]+))?\.([^./\\]+)$/, // Extracts up to two file extensions from the end of a path (e.g., match[1]="test", match[2]="js" from "folder/app.test.js"), safely ignoring directories.
        fileTitleAvoidExtensionReg: /^.*?(?=\.[^.]+$|$)/, // Select all file title data before the last "."
        synapsePastStateName : '.synapse-state.json',

        // CUSTOMIZABLE ASSIGNMENT FROM THE MASTER CONFIG CONTRACT
        excludeList: validatedConfig.excludeList,
        acceptedSystemArtifacts: validatedConfig.acceptedSystemArtifacts,
        connectionInsertionTitleRegex: validatedConfig.connectionInsertionTitleRegex,
        classificationGuidelines: {
            'artifactCategoryMap': artifactCategoryMap,
            'extensionCategoryMap': extensionCategoryMap
        }
    }

    return CONFIG;
}