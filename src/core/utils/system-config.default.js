export const MASTER_CONFIG_NAME = "system-config.json"
export const DEFAULT = {
    "synapse-engine": {
        acceptedSystemArtifacts: ["REQ", "ADR", "VS"],
        connectionInsertionTitleRegex: /^connections?$/i,
        classificationGuidelines: {
            artifactCategoryMap: {
            '📕 Architecture': ["VS", "ADR"],
            '📓 Requirements': ["REQ"],
            },
            extensionCategoryMap: { 
                '⚙️ Core Logic (Backend/Systems)': [], 
                '🎨 Client Layer (Frontend/UI)': [], 
                '🛡️ Verification (Tests & Config)': []
            },
        },
    },
    "dev-workflow": {
        projectPrefix: "",
    },
}