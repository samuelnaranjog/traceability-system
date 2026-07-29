//@trace REQ-020 @ 
import fs from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import os from "os"
import runTraceabilityPipeline from "../../src/scripts/AutoLinkRefactorExecutionThread.js";
import GitWorkflowOperations from "../../src/scripts/git-tree-workflow/GitWorkflowOperations.js";
import { jest } from '@jest/globals';

import getCanonicalPath from "../utils/MultiSystemTempPathResolver.js";

describe("[synapse] Engine runs without compiler level errors ", () => {
  

  let mockRootDir;

  beforeAll(async () => {
    // 1. Create the isolated sandbox
    mockRootDir = await fs.mkdtemp(path.join(os.tmpdir(), "mock-project-"));
    
    // 2. FORCE the Git operations to use the sandbox instead of the real repo
    jest
      .spyOn(GitWorkflowOperations, "findWorktreePath")
      .mockReturnValue(mockRootDir);

    // 2. Define the tree structure
    const directories = [
      "docs/architecture",
      "docs/comparisons",
      "docs/requirements",
      "prototypes",
      "src/core",
      "src/ui",
      "tests",
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
    const adr002Content = `# Micro Connection\n`; // Added ADR-002 stub
    const dashboardContent = `export default function Dashboard() { return <div/>; }\n`;
    const readmeContent = `# Mock Project\n`;

    // 6. Map paths to their respective contents
    const files = {
      "docs/architecture/PRO-ADR-001_Microkernel.md": adrContent,
      "docs/architecture/PRO-ADR-002_Micro_Connection.md": adr002Content, // Mapped ADR-002
      "docs/requirements/PRO-REQ-001_Create_Data.md": req001Content,
      "docs/requirements/PRO-REQ-101_Data_Ingestion.md": req101Content,
      "docs/requirements/PRO-REQ-002_Print_Money.md": req002Content, // REQ-002 was already mapped here
      "docs/comparisons/PRO-VS-002_GraphQL_VS_REST.md": vsContent,
      "prototypes/01_proof_of_concept.py": pocContent,
      "src/core/pipeline.js": pipelineJsContent,
      "src/ui/dashboard.jsx": dashboardContent,
      "tests/pipeline.test.js": pipelineTestContent,
      "README.md": readmeContent,
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

  test("ARCH Notes connection test hidden as integration test", () => {
    runTraceabilityPipeline(mockRootDir);
  });
});


describe("[Synapse engine] handles hard written links", () => {



let mockRootDir;

  beforeAll(async () => {
    // 1. Create the isolated sandbox
    mockRootDir = await fs.mkdtemp(path.join(os.tmpdir(), "mock-project-"));
    
    // 2. FORCE the Git operations to use the sandbox instead of the real repo
    jest
      .spyOn(GitWorkflowOperations, "findWorktreePath")
      .mockReturnValue(mockRootDir);

    // 2. Define the tree structure
    const directories = [
      "docs/architecture",
      "docs/comparisons",
      "docs/requirements",
      "prototypes",
      "src/core",
      "src/ui",
      "tests",
    ];

    for (const dir of directories) {
      await fs.mkdir(path.join(mockRootDir, dir), { recursive: true });
    }

    // 3. Define Inner File Data exactly as modeled in image_947732.png + REQ-002 updates

    // PRO-ADR-001_Microkernel.md (Traces REQ-001 & REQ-002)
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
> Connection: Establishes the core plugin architecture and extension interfaces needed so that the execution logic in PRO-REQ-002 can safely run isolated modules.
>
> ---
> ## **1. The Context (Systemic Problem)**\`;
> @trace REQ-001 @
> @trace REQ-002 @
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

    // 4. Connect the peripheral files using the @trace tag and description blocks

    // Files connecting to ADR-001 & REQ-002
    const pipelineJsContent = `// Core Data Pipeline
// @trace ADR-001 @
// @trace REQ-002 @
// Connection: Implements the production JavaScript data orchestration pipeline, reading input streams generated by PRO-REQ-001 and executing the final logic defined in PRO-REQ-002.
export const pipeline = () => {};
`;

    const pocContent = `# Proof of Concept Script
# @trace ADR-001 @
# @trace REQ-002 @
# Connection: Acts as the standalone Python mathematical prototype validating the core algorithm before implementing the production rules outlined in PRO-REQ-002.
print("Executing POC...")
`;

    // Files connecting to REQ-001
    const vsContent = `# GraphQL VS REST\n\n@trace REQ-001 @\n\n## Connections\n`;
    const pipelineTestContent = `// Pipeline Tests\n// @trace REQ-001 @\ntest('pipeline works', () => {});\n`;

    // 5. Fill in the unconnected stub files & Hard-written link files
    const req101Content = `# Data Ingestion\n`;
    const req002Content = `# Print Money\n
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
    `;
    
    // PRO-ADR-002_Micro_Connection.md (Strictly using @trace syntax now)
    const adr002Content = `# Micro Connection\n
Connection: Explicitly documents the socket communication protocol and real-time network throughput required to handle the transaction volume specified in PRO-REQ-002.

@trace REQ-002 @
`; 

    const dashboardContent = `export default function Dashboard() { return <div/>; }\n`;
    const readmeContent = `# Mock Project\n`;

    // 6. Map paths to their respective contents
    const files = {
      "docs/architecture/PRO-ADR-001_Microkernel.md": adrContent,
      "docs/architecture/PRO-ADR-002_Micro_Connection.md": adr002Content, 
      "docs/requirements/PRO-REQ-001_Create_Data.md": req001Content,
      "docs/requirements/PRO-REQ-101_Data_Ingestion.md": req101Content,
      "docs/requirements/PRO-REQ-002_Print_Money.md": req002Content, 
      "docs/comparisons/PRO-VS-002_GraphQL_VS_REST.md": vsContent,
      "prototypes/01_proof_of_concept.py": pocContent,
      "src/core/pipeline.js": pipelineJsContent,
      "src/ui/dashboard.jsx": dashboardContent,
      "tests/pipeline.test.js": pipelineTestContent,
      "README.md": readmeContent,
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

    test.only("Hand Link Scenario A: Handles no '.synapse-state.json' in first run & Hard written link with manually created table", async () => {
        // 1. Define the exact path to ADR-002 within the isolated sandbox
        const req002Path = path.join(mockRootDir, "docs/requirements/PRO-REQ-002_Print_Money.md");
  const synapseStatePath = path.join(mockRootDir, ".synapse-state.json");

  // 2. Define the mutated content for REQ-002 with the classified Figma link
  // Note: Template literal is strictly left-aligned to avoid Markdown parsing bugs
  const mutatedReq002Content = `---
Project: TraceabilitySystem
Status: Draft
Priority: P1
Description: Core value generation logic
---

## Connections
| Type                                | Route                                                                                                                              |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **🎨 Client Layer (Frontend/UI)** | [UI Data](https://www.figma.com/design/mAdsajylnUWeHLKTavrBCu/Animations-For-Traceability-System?node-id=1-2&t=v11GNWvUQ0tpON6J-4) |

## Acceptance Criteria

--- 
###### Links: 

###### Reference :`;

  // 3. Overwrite the file state before the engine runs
  await fs.writeFile(req002Path, mutatedReq002Content);

        // Act: Synapse engine in action
        runTraceabilityPipeline(mockRootDir);

        const stateExists = await fs.access(getCanonicalPath(synapseStatePath))
        .then(() => true)
        .catch(() => false);
        
        expect(stateExists).toBe(true);

        //

        // Assertion 2

        const postExecutionREQ002 = await fs.readFile(req002Path, 'utf-8');
  
        const expectedFigmaLink = "[UI Data](https://www.figma.com/design/mAdsajylnUWeHLKTavrBCu/Animations-For-Traceability-System?node-id=1-2\\&t=v11GNWvUQ0tpON6J-4)";

        expect(postExecutionREQ002).toContain(expectedFigmaLink);
        expect(postExecutionREQ002).toContain("**🎨 Client Layer (Frontend/UI)**");
        
        
    })

    test("[Synapse engine] Handles 3 state comparsion with '.synapse-state.json' & Hard written links added to dynamically created table", () => {
            //runTraceabilityPipeline(mockRootDir);
        });
      });

/*describe("[Synapse engine] Configuration contract & user custom configfeedback", () => {

})*/