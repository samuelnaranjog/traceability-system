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
export default function buildSynapseWorkingData(validatedConfig){

    const synapseEngineConfig = validatedConfig;
    // Dynamic Maps for custom categorization
    const artifactCategoryMap = createCategoryLookupMap(synapseEngineConfig.classificationGuidelines.artifactCategoryMap);
    const extensionCategoryMap = createCategoryLookupMap(synapseEngineConfig.classificationGuidelines.extensionCategoryMap);
    
    //Config definition
    const CONFIG = {

        // THIS ARE THE PREDEFINED SYSTEM CONSTRAINTS AND VALUES FOR THE SYNAPSE ENGINE
        treaceabilityKeyWords: {start: "@trace", end: "@"},
        fileTitleIdentifierFilteringRegex: /\b[A-Z]+-\d+/, //Regex for selecting Artifact format from text e.g: From TSO-ADR-000 the regex will select ADR-000
        fileNameFilterRegex: /(?<=_)[a-zA-Z_]+/, //Regex for selecting the name based on the underscore "_" convention given to the file
        fileIdentifierNoNumFilteringRegex: /(?<=-)[A-Z]+(?=-)/, // Select only the artifact for TSO-REQ-001 it will extract "REQ"
        fileIdentifierNoNumNorProjectRegex: /\b[A-Z]+(?=-\d+)/, // Select only the artifact from "REQ-001" it will extract "REQ"
        fileExtensionExtractionRegex: /(?:\.([^./\\]+))?\.([^./\\]+)$/, // Extracts up to two file extensions from the end of a path (e.g., match[1]="test", match[2]="js" from "folder/app.test.js"), safely ignoring directories.
        fileTitleAvoidExtensionReg: /^[^.]+/, // Select all file title data before the "."
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