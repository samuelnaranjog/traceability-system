//@trace REQ-020 @ 
import fs from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import os from "os"
import runTraceabilityPipeline from "../../src/core/synapse-engine/synapse-engine.js";
import GitWorkflowOperations from "../../src/core/git-tree-workflow/GitWorkflowOperations.js";
import { jest } from '@jest/globals';
import { MOCK_FILES } from "../utils/project-files-data.mock.js";

import getCanonicalPath from "../utils/MultiSystemTempPathResolver.js";




describe("[synapse] Engine runs without compiler level errors ", () => {
let mockRootDir;
   beforeEach(async () => {
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
       const adr001Content = MOCK_FILES["docs/architecture/PRO-ADR-001_Microkernel.md"]
   
       // PRO-REQ-001_Create_Data.md (Traces ADR-001)
       const req001Content = MOCK_FILES["docs/requirements/PRO-REQ-001_Create_Data.md"]
   
       // 4. Connect the peripheral files using the @trace tag and description blocks
   
       // Files connecting to ADR-001 & REQ-002
       const pipelineJsContent = MOCK_FILES["src/core/pipeline.js"];
   
       const pocContent = MOCK_FILES["prototypes/01_proof_of_concept.py"];
   
       // Files connecting to REQ-001
       const vsContent = MOCK_FILES["docs/comparisons/PRO-VS-002_GraphQL_VS_REST.md"];
       const pipelineTestContent = MOCK_FILES["tests/pipeline.test.js"];
   
       // 5. Fill in the unconnected stub files & Hard-written link files
       const req101Content = MOCK_FILES["docs/requirements/PRO-REQ-101_Data_Ingestion.md"];
       const req002Content = MOCK_FILES["docs/requirements/PRO-REQ-002_Print_Money.md"]
       
       // PRO-ADR-002_Micro_Connection.md (Strictly using @trace syntax now)
       const adr002Content = MOCK_FILES["docs/architecture/PRO-ADR-002_Micro_Connection.md"]; 
   
       const dashboardContent = MOCK_FILES["src/ui/dashboard.jsx"];
       const readmeContent = MOCK_FILES["README.md"];
   
       // 6. Map paths to their respective contents
       const files = {
         "docs/architecture/PRO-ADR-001_Microkernel.md": adr001Content,
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
   
     afterEach(async () => {
       if (mockRootDir) {
         await fs.rm(mockRootDir, { recursive: true, force: true });
       }
     }); 

  test("Running Synapse Engine through the main execution thread", () => {
    runTraceabilityPipeline(mockRootDir);
  });
});


describe.only("[Synapse engine] handles hard written links", () => {

let mockRootDir;
   beforeEach(async () => {
      jest.resetModules();
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
       const adr001Content = MOCK_FILES["docs/architecture/PRO-ADR-001_Microkernel.md"]
   
       // PRO-REQ-001_Create_Data.md (Traces ADR-001)
       const req001Content = MOCK_FILES["docs/requirements/PRO-REQ-001_Create_Data.md"]
   
       // 4. Connect the peripheral files using the @trace tag and description blocks
   
       // Files connecting to ADR-001 & REQ-002
       const pipelineJsContent = MOCK_FILES["src/core/pipeline.js"];
   
       const pocContent = MOCK_FILES["prototypes/01_proof_of_concept.py"];
   
       // Files connecting to REQ-001
       const vsContent = MOCK_FILES["docs/comparisons/PRO-VS-002_GraphQL_VS_REST.md"];
       const pipelineTestContent = MOCK_FILES["tests/pipeline.test.js"];
   
       // 5. Fill in the unconnected stub files & Hard-written link files
       const req101Content = MOCK_FILES["docs/requirements/PRO-REQ-101_Data_Ingestion.md"];
       const req002Content = MOCK_FILES["docs/requirements/PRO-REQ-002_Print_Money.md"]
       
       // PRO-ADR-002_Micro_Connection.md (Strictly using @trace syntax now)
       const adr002Content = MOCK_FILES["docs/architecture/PRO-ADR-002_Micro_Connection.md"]; 
   
       const dashboardContent = MOCK_FILES["src/ui/dashboard.jsx"];
       const readmeContent = MOCK_FILES["README.md"];
   
       // 6. Map paths to their respective contents
       const files = {
         "docs/architecture/PRO-ADR-001_Microkernel.md": adr001Content,
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
   
     afterEach(async () => {
      jest.restoreAllMocks();

       if (mockRootDir) {
         await fs.rm(mockRootDir, { recursive: true, force: true });
       }
     }); 

    test("Hand Link Scenario A: Handles no '.synapse-state.json' in first run & Hard written link with manually created table", async () => {
        //  Define the exact path to REQ-002  & syanpse-state within the isolated sandbox
        const req002Path = path.join(mockRootDir, "docs/requirements/PRO-REQ-002_Print_Money.md");
      const synapseStatePath = path.join(mockRootDir, ".synapse-state.json");

      //  Define the mutated content for REQ-002 with the classified Figma link
  
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

        // Overwrite the file state before the engine runs
        await fs.writeFile(req002Path, mutatedReq002Content);

        // Act: Synapse engine in action
        runTraceabilityPipeline(mockRootDir);

        // Assertion 1: The system should create the empty .synapse-state.json
        const stateExists = await fs.access(getCanonicalPath(synapseStatePath))
        .then(() => true)
        .catch(() => false);
        
        expect(stateExists).toBe(true);

        // Assertion 2 & 3: Preserves the link URL & the custom name if present

        const postExecutionREQ002 = await fs.readFile(req002Path, 'utf-8');
  
        const expectedFigmaLink = "[UI Data](https://www.figma.com/design/mAdsajylnUWeHLKTavrBCu/Animations-For-Traceability-System?node-id=1-2\\&t=v11GNWvUQ0tpON6J-4)";

        expect(postExecutionREQ002).toContain(expectedFigmaLink);
        expect(postExecutionREQ002).toContain("**🎨 Client Layer (Frontend/UI)**");
        
        // Assertion 4: The system should preserve the dynamic connection that point to the REQ-002
      

        // [REQ002 CONNECTIONS]
        // PRO-ADR-001_Microkernel.md -> ../architecture/PRO-ADR-001_Microkernel.md
        // PRO-ADR-002_Micro_Connection.md -> ../architecture/PRO-ADR-002_Micro_Connection.md
        // 01_proof_of_concept.py -> ../../prototypes/01_proof_of_concept.py
        // pipeline.js -> ../../src/core/pipeline.js

        // The trace links injected by the engine are categorized,
        // stripped of extensions, and use accurate relative paths FROM REQ-002

        // 1. Check "📕 Architecture" category (Matches artifact "ADR")
        // Target: docs/architecture/ -> Relative from docs/requirements/ is ../architecture/
        expect(postExecutionREQ002).toContain("**📕 Architecture**");
        
        // Note: Markdown escapes underscores in the display text, requiring \\_ in the assertions
        const expectedAdr1Link = "[PRO-ADR-001\\_Microkernel](../architecture/PRO-ADR-001_Microkernel.md)";
        const expectedAdr2Link = "[PRO-ADR-002\\_Micro\\_Connection](../architecture/PRO-ADR-002_Micro_Connection.md)";
        
        expect(postExecutionREQ002).toContain(expectedAdr1Link);
        expect(postExecutionREQ002).toContain(expectedAdr2Link);

        // 2. Check "🎨 Client Layer (Frontend/UI)" category (Matches extension "py" per your map)
        // Target: prototypes/ -> Relative from docs/requirements/ is ../../prototypes/
        
        const expectedPyLink = "[01\\_proof\\_of\\_concept](../../prototypes/01_proof_of_concept.py)";
        expect(postExecutionREQ002).toContain(expectedPyLink);

        // 3. Check "⚙️ Core Logic (Backend/Systems)" category (Matches extension "js")
        // Target: src/core/ -> Relative from docs/requirements/ is ../../src/core/
        expect(postExecutionREQ002).toContain("**⚙️ Core Logic (Backend/Systems)**");
        
        const expectedJsLink = "[pipeline](../../src/core/pipeline.js)";
        expect(postExecutionREQ002).toContain(expectedJsLink);

        // Extra Assertion: guarantee that multiple links in a table cell
        // in the "📕 Architecture" row are grouped correctly in the markdown table:
        // uses <br /> to separate multiple links in a single table cell
        const architectureRowRegex = /\|\s*\*\*📕 Architecture\*\*\s*\|.*\[PRO-ADR-001\\_Microkernel\].*<br \/>\[PRO-ADR-002\\_Micro\\_Connection\].*\|/;
        expect(postExecutionREQ002).toMatch(architectureRowRegex);

        
    })

    test("[Synapse engine] Handles 3 state comparsion with '.synapse-state.json', Dynamic & Hard written links added to dynamically created table", async () => {
            runTraceabilityPipeline(mockRootDir);

             //  Define the exact path to REQ-002 within the isolated sandbox
        const req002Path = path.join(mockRootDir, "docs/requirements/PRO-REQ-002_Print_Money.md");
      

      //  Define the mutated content for REQ-002 with the classified Figma link
  
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

        await fs.writeFile(req002Path, mutatedReq002Content, 'utf-8');

      // Second run to check if the system deals with the past state
      runTraceabilityPipeline(mockRootDir);

      // Assertion 2 & 3: Preserves the link URL & the custom name if present

        const postExecutionREQ002 = await fs.readFile(req002Path, 'utf-8');
  
        const expectedFigmaLink = "[UI Data](https://www.figma.com/design/mAdsajylnUWeHLKTavrBCu/Animations-For-Traceability-System?node-id=1-2\\&t=v11GNWvUQ0tpON6J-4)";

        expect(postExecutionREQ002).toContain(expectedFigmaLink);
        expect(postExecutionREQ002).toContain("**🎨 Client Layer (Frontend/UI)**");
        
        // Assertion 4: The system should preserve the dynamic connection that point to the REQ-002
      

        // [REQ002 CONNECTIONS]
        // PRO-ADR-001_Microkernel.md -> ../architecture/PRO-ADR-001_Microkernel.md
        // PRO-ADR-002_Micro_Connection.md -> ../architecture/PRO-ADR-002_Micro_Connection.md
        // 01_proof_of_concept.py -> ../../prototypes/01_proof_of_concept.py
        // pipeline.js -> ../../src/core/pipeline.js

        // The trace links injected by the engine are categorized,
        // stripped of extensions, and use accurate relative paths FROM REQ-002

        // 1. Check "📕 Architecture" category (Matches artifact "ADR")
        // Target: docs/architecture/ -> Relative from docs/requirements/ is ../architecture/
        expect(postExecutionREQ002).toContain("**📕 Architecture**");
        
        // Note: Markdown escapes underscores in the display text, requiring \\_ in the assertions
        const expectedAdr1Link = "[PRO-ADR-001\\_Microkernel](../architecture/PRO-ADR-001_Microkernel.md)";
        const expectedAdr2Link = "[PRO-ADR-002\\_Micro\\_Connection](../architecture/PRO-ADR-002_Micro_Connection.md)";
        
        expect(postExecutionREQ002).toContain(expectedAdr1Link);
        expect(postExecutionREQ002).toContain(expectedAdr2Link);

        // 2. Check "🎨 Client Layer (Frontend/UI)" category (Matches extension "py" per your map)
        // Target: prototypes/ -> Relative from docs/requirements/ is ../../prototypes/
        
        const expectedPyLink = "[01\\_proof\\_of\\_concept](../../prototypes/01_proof_of_concept.py)";
        expect(postExecutionREQ002).toContain(expectedPyLink);

        // 3. Check "⚙️ Core Logic (Backend/Systems)" category (Matches extension "js")
        // Target: src/core/ -> Relative from docs/requirements/ is ../../src/core/
        expect(postExecutionREQ002).toContain("**⚙️ Core Logic (Backend/Systems)**");
        
        const expectedJsLink = "[pipeline](../../src/core/pipeline.js)";
        expect(postExecutionREQ002).toContain(expectedJsLink);

        // Extra Assertion: guarantee that multiple links in a table cell
        // in the "📕 Architecture" row are grouped correctly in the markdown table:
        // uses <br /> to separate multiple links in a single table cell
        const architectureRowRegex = /\|\s*\*\*📕 Architecture\*\*\s*\|.*\[PRO-ADR-001\\_Microkernel\].*<br \/>\[PRO-ADR-002\\_Micro\\_Connection\].*\|/;
        expect(postExecutionREQ002).toMatch(architectureRowRegex);

  });
});



/*describe("[Synapse engine] Configuration contract & user custom configfeedback", () => {

})*/