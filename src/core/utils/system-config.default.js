export const MASTER_CONFIG_NAME = "system-config.json"
export const DEFAULT = {
    "synapse-engine": {
        excludeList: [ 
        ".gitignore",
        ".git",
        ".DS_Store",
        "node_modules",
        "README.md",
        "package-lock.json",
        "package.json"
        ],
        acceptedSystemArtifacts: ["REQ", "ADR", "VS"],
        connectionInsertionTitleRegex: "connections",
        classificationGuidelines: {
            artifactCategoryMap: {
            '📕 Architecture': ["VS", "ADR"],
            '📓 Requirements': ["REQ"],
            },
            extensionCategoryMap: { 
                '⚙️ Core Logic (Backend/Systems)': ["js"], 
                '🎨 Client Layer (Frontend/UI)': ["jsx"], 
                '🛡️ Verification (Tests & Config)': ["test.js"]
            },
        },
    },
    "dev-workflow": {
        projectPrefix: "",
    },
}