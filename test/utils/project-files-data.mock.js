export const MOCK_FILES = {
  "docs/architecture/PRO-ADR-001_Microkernel.md": `---
Project: TraceabilitySystem
State: Approved
Priority: P0-Critical
Description:
---
> [!info] 🏛️ TSO-ADR-002 : Symlinks
> **Date of Decision:** 2026-06-04

@trace REQ-001 @
@trace REQ-002 @`,

  "docs/architecture/PRO-ADR-002_Micro_Connection.md": `# Micro Connection
Connection: Explicitly documents the socket communication protocol.

@trace REQ-002 @`,

  "docs/requirements/PRO-REQ-001_Create_Data.md": `# Connections
###### Links:
@trace ADR-001 @`,

  "src/core/pipeline.js": `// @trace ADR-001 @
// @trace REQ-002 @
export const pipeline = () => {};`,

    "docs/comparisons/PRO-VS-002_GraphQL_VS_REST.md": `# GraphQL VS REST\n\n@trace REQ-001 @\n\n## Connections\n`,

    "src/ui/dashboard.jsx": `export default function Dashboard() { return <div/>; }\n`,

"tests/pipeline.test.js": `// Pipeline Tests\n// @trace REQ-001 @\ntest('pipeline works', () => {});\n`, 

    "docs/requirements/PRO-REQ-002_Print_Money.md": `# Print Money\n
---
Project: null
Status: null
Priority: null
Description: null
---
# Connections

# Acceptance Criteria

---
###### Links:
       `,

       "docs/requirements/PRO-REQ-101_Data_Ingestion.md": `# Data Ingestion\n`, 
  "prototypes/01_proof_of_concept.py": `# @trace ADR-001 @
# @trace REQ-002 @
print("Executing POC...")`,

  "README.md": `# Mock Project`
};

