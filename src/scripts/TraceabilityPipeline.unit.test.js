//@trace REQ-020 @ 
import fs from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import os from "os"
import { mockTraceabilityData, mockTraceabilityDataDuplicates, classifiedConnections, fileADRMock, fileREQsOrVSMock, tableNoHeaderMock, tableHeaderMock} from "./TraceabilityPipelineMocks.js";
import runTraceabilityPipeline from "./AutoLinkRefactorExecutionThread.js";
import GitWorkflowOperations from "./git-tree-workflow/GitWorkflowOperations.js";
import { jest } from '@jest/globals';
describe('Test the relative link creation within the connection title section in both ARCH notes and REQs', ()=>{



let mockRootDir;

beforeAll(async () => {
    
     // 1. Create the isolated sandbox
    mockRootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'mock-project-'));
    // 2. FORCE the Git operations to use the sandbox instead of the real repo
    jest.spyOn(GitWorkflowOperations, 'findWorktreePath').mockReturnValue(mockRootDir);
 

  
  // 2. Define the tree structure
  const directories = [
    'docs/architecture',
    'docs/comparisons',
    'docs/requirements',
    'prototypes',
    'src/core',
    'src/ui',
    'tests'
  ];

  for (const dir of directories) {
    await fs.mkdir(path.join(mockRootDir, dir), { recursive: true });
  }

  // 3. Define Inner File Data exactly as modeled in image_947732.png

  // PRO-ADR-001_Microkernel.md (Traces REQ-001)
  const adrContent = `---
Project: TraceabilitySystem
State: Approved
Priority: P0-Critical
Description:
---
> [!info] 🏛️ TSO-ADR-002 : Symlinks
> **Date of Decision:** 2026-06-04
>
> ---
> ## *Connections*
>
>
> ---
> ## **1. The Context (Systemic Problem)**\`;
> @trace REQ-001 @
`;

  // PRO-REQ-001_Create_Data.md (Traces ADR-001)
  const req001Content = `---
Project: null
Status: null
Priority: null
Description: null
---
# Connections

# Acceptance Criteria

---
###### Links:
@trace ADR-001 @
`;

  // 4. Connect the peripheral files using the @trace tag

  // Files connecting to ADR-001
  const pipelineJsContent = `// Core Data Pipeline\n// @trace ADR-001 @\nexport const pipeline = () => {};\n`;
  const pocContent = `# Proof of Concept Script\n# @trace ADR-001 @\nprint("Executing POC...")\n`;

  // Files connecting to REQ-001
  const vsContent = `# GraphQL VS REST\n\n@trace REQ-001 @\n\n## Connections\n`;
  const pipelineTestContent = `// Pipeline Tests\n// @trace REQ-001 @\ntest('pipeline works', () => {});\n`;

  // 5. Fill in the unconnected stub files
  const req101Content = `# Data Ingestion\n`;
  const req002Content = `# Print Money\n`;
  const dashboardContent = `export default function Dashboard() { return <div/>; }\n`;
  const readmeContent = `# Mock Project\n`;

  // 6. Map paths to their respective contents
  const files = {
    'docs/architecture/PRO-ADR-001_Microkernel.md': adrContent,
    'docs/requirements/PRO-REQ-001_Create_Data.md': req001Content,
    'docs/requirements/PRO-REQ-101_Data_Ingestion.md': req101Content,
    'docs/requirements/PRO-REQ-002_Print_Money.md': req002Content,
    'docs/comparisons/PRO-VS-002_GraphQL_VS_REST.md': vsContent,
    'prototypes/01_proof_of_concept.py': pocContent,
    'src/core/pipeline.js': pipelineJsContent,
    'src/ui/dashboard.jsx': dashboardContent,
    'tests/pipeline.test.js': pipelineTestContent,
    'README.md': readmeContent
  };

  // 7. Write everything to the temp directory
  for (const [filePath, content] of Object.entries(files)) {
    await fs.writeFile(path.join(mockRootDir, filePath), content);
  }
});

// Optional: Clean up after the test suite finishes
afterAll(async () => {
  if (mockRootDir) {
    await fs.rm(mockRootDir, { recursive: true, force: true });
  }
});

    test('ARCH Notes connection test hidden as integration test',()=>{
        runTraceabilityPipeline(mockRootDir);
    })
})