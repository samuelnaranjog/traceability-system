import fs from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import os from "os"
import { jest } from '@jest/globals';
import ExtractDataAndMatch from "../../src/core/utils/path-extraction-helper.util.js";
import SearchAndDivide from "../../src/core/utils/FileSelectionHelper.util.js";
import DevWorkflowOperations from "../../src/core/dev-workflow/DevWorkflowOperations.js";";
import { MOCK_FILES } from "../utils/project-files-data.mock.js";

/**@trace SREQ-020A @ */
describe('Function builds the relationships between artifact and files without errors', ()=>{
let mockRootDir;

// REGEX extractors
const textIdentifierFilteringRegexG = /(?<=^|\s)[A-Z]+-\d+[A-Z]?/g;// Global: from "REQ-001A someText" extracts "REQ-001A"
const artifactIdPrefix =  /\b[A-Z]+/g; //Global: Regex selects only artifact Identifier no num e.g: from REQ-001 -> "REQ", from SREQ-000 -> "SREQ"
   beforeEach(async () => {
       // 1. Create the isolated sandbox
       mockRootDir = await fs.mkdtemp(path.join(os.tmpdir(), "mock-project-"));
       
       // 2. FORCE the Git operations to use the sandbox instead of the real repo
       jest
         .spyOn(DevWorkflowOperations, "findWorktreePath")
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
   
     // Optional: Clean up after the test suite finishes
     afterEach(async () => {
       if (mockRootDir) {
         await fs.rm(mockRootDir, { recursive: true, force: true });
       }
     }); 

    
     test('Scenario: Keyword Data Extraction & connections object construction', ()=>{
        const objOfDirsAndFiles = {
            files: [],
            dirs: [],
        };

        SearchAndDivide(mockRootDir, [".gitignore"], objOfDirsAndFiles);
        console.log(objOfDirsAndFiles);

        const artifactConnectedToFiles = ExtractDataAndMatch(objOfDirsAndFiles, '@trace', '@', ["REQ", "ADR", "VS"], textIdentifierFilteringRegexG, artifactIdPrefix);
        console.log('Some data:', JSON.stringify(artifactConnectedToFiles))

     })
})