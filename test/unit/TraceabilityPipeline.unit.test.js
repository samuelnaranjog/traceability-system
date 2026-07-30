//@trace REQ-020 @ 
import fs from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import os from "os"
import { mockTraceabilityData, mockTraceabilityDataDuplicates, classifiedConnections, fileADRMock, fileREQsOrVSMock, tableNoHeaderMock, tableHeaderMock} from "../../src/core/TraceabilityPipelineMocks.js";
import runTraceabilityPipeline from "./AutoLinkRefactorExecutionThread.js";
import GitWorkflowOperations from "../../src/core/git-tree-workflow/GitWorkflowOperations.js";
import { jest } from '@jest/globals';

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

    test("Hand Link Scenario A: Handles no '.synapse-state.json' in first run & Hard written link with manually created table", async () => {
        // 1. Define the exact path to ADR-002 within the isolated sandbox
        const adr002Path = path.join(mockRootDir, "docs/architecture/PRO-ADR-002_Micro_Connection.md");
        const synapseStatePath = path.join(mockRootDir, ".synapse-state.json");

        // 2. Define the mutated content
        const mutatedADR002Content = `---
            Project:
            Status:
            Priority:
            Description:
            ---

            ## Connections
            | Type                                | Route                                                                                                                              |
            | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
            | **🎨 Client Layer (Frontend/UI)** | [UI Data](https://www.figma.com/design/mAdsajylnUWeHLKTavrBCu/Animations-For-Traceability-System?node-id=1-2&t=v11GNWvUQ0tpON6J-4) |
            ## Acceptance Criteria


            --- 
            ###### Links: 

            ###### Reference :`;

        // Overwrite the file state before the engine runs
        await fs.writeFile(adr002Path, mutatedADR002Content);

        const stateExists = await fs.access(synapseStatePath)
        .then(() => true)
        .catch(() => false);
        
        expect(stateExists).toBe(true);

        // Assertion 2

        const postExecutionADR002 = await fs.readFile(adr002Path, 'utf-8');
  
        const expectedClassificationRow = `| **🎨 Client Layer (Frontend/UI)** | [UI Data](https://www.figma.com/design/mAdsajylnUWeHLKTavrBCu/Animations-For-Traceability-System?node-id=1-2&t=v11GNWvUQ0tpON6J-4) |`;
  
        expect(postExecutionADR002).toContain(expectedClassificationRow);
        
    })

    test("[Synapse engine] Handles 3 state comparsion with '.synapse-state.json' & Hard written links added to dynamically created table", () => {
            //runTraceabilityPipeline(mockRootDir);
        });

/*describe("[Synapse engine] Configuration contract & user custom configfeedback", () => {

})*/