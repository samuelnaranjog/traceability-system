---
Project: TraceabilitySystem
State: Approved
Priority: P0-Critical
Description: The system when run for the second time with a .synapse-state.json fails completely to compare and define which link are hand written links because is using relative link to compare with absolute paths, identifying all as hand written, generating duplication.
---
> [!info] 🏛️ [PREFIJO]-ADR-[ID]: [Human_Readable_Title_In_Snake_Case]
> 
> **Date of Decision:**  2026-07-29 
> 
> ---
> # *Connections*
> 
> ---
>  # **1. The Context (Systemic Problem)**
>  ## ***Issue***
>  [Describe the high-level, platform-wide bottleneck, infrastructure need, or operational friction that requires a global structural pivot.]
When the system has already build some dynamic tables of relative links, it collects each file links to check if the table link is a hand written one. However to do so it uses a set of absolute paths, and when comparing it to relative links of course fails to identify that is not a `hand-written` one. Generating a list of multiple duplicated  links as show below, for each of the dynamic connection a relative link is passed as hand written link that is not catch because is actually different from the actual absolute path
> 
> | Type                                | Route                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
> | :---------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
> | **🎨 Client Layer (Frontend/UI)**   | [01\_proof\_of\_concept](../../prototypes/01_proof_of_concept.py)<br />[01\_proof\_of\_concept](../../prototypes/01_proof_of_concept.py)<br />[01\_proof\_of\_concept](../../prototypes/01_proof_of_concept.py)<br />[01\_proof\_of\_concept](../../prototypes/01_proof_of_concept.py)                                                                                                                                                                                                                                                                                                                                                                                 |
> | **📕 Architecture**                 | [PRO-ADR-001\_Microkernel](../architecture/PRO-ADR-001_Microkernel.md)<br />[PRO-ADR-002\_Micro\_Connection](../architecture/PRO-ADR-002_Micro_Connection.md)<br />[PRO-ADR-001\_Microkernel](../architecture/PRO-ADR-001_Microkernel.md)<br />[PRO-ADR-002\_Micro\_Connection](../architecture/PRO-ADR-002_Micro_Connection.md)<br />[PRO-ADR-001\_Microkernel](../architecture/PRO-ADR-001_Microkernel.md)<br />[PRO-ADR-002\_Micro\_Connection](../architecture/PRO-ADR-002_Micro_Connection.md)<br />[PRO-ADR-001\_Microkernel](../architecture/PRO-ADR-001_Microkernel.md)<br />[PRO-ADR-002\_Micro\_Connection](../architecture/PRO-ADR-002_Micro_Connection.md) |
> | **⚙️ Core Logic (Backend/Systems)** | [pipeline](../../src/core/pipeline.js)<br />[pipeline](../../src/core/pipeline.js)<br />[pipeline](../../src/core/pipeline.js)<br />[pipeline](../../src/core/pipeline.js)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
> |                                     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
> 

**Another duplication source**
After analyzing the code base the reader of keyword in the project files can create duplicates if the artifact is mention multiple time in the same `@trace block @` 

>  ## ***Propose Design***
> ### ==Convert the relative path to absolute==
> Take the artifact path and from it rebuild the absolute system path of the link ready for comparison.
> 
> The problem is that it will need me to handle some edge cases that are not system paths, that need to be address so that the app does not crash, such as:
> - Handling URIs to apps
> - Handling links to the web
> - others....
> 
> ### ==Use the name of the file==
> Another approach could be to use the name of the file to determine if is a dynamic link, per the system constraint dynamic links `link name` section is the file name without extension, so if the relalitive and link name are the same then it should be transform to absolute path

### Modify the ExtractAndMatch Utility

>  
>  
>   #  **2. The Decision**
> [State the exact system-wide rule, technology, or framework methodology being mandated across the entire ecosystem.]
> 
> Even approach 2 seems clever and low effort to implement it hides a destructive flaw:
> ```md red team
> - **The Flaw:** Coupling core system routing (path resolution) to human-editable metadata (`linkName === filename`).
>     
> - **The Trigger:** A developer naturally updates a markdown link's display text to improve readability (e.g., `[pipeline]` → `[Data Orchestration Pipeline]`).
>     
> - **The Collapse:** The strict match fails. The engine misclassifies the local file, skips `path.resolve()`, and bypasses deduplication entirely.
>     
> - **The Impact:** Silent failure. Corrupted, duplicated documentation is pushed to production, trust destruction.
> ```
> 
> ## Convert the relative path to absolute
> This is the approach selected, is stronger but will require more edge case handling. As mention before and extended integrating bullet proof validation for:
> - URIs to apps (Use regex structure to identify it)
> - Links to the web (Use http identifier) 
> - Local Path Fragments (`../file.js#L50`)
> - Internal Document Anchors (`#`)
> - URL Encoding in Filenames (`%20`)
> 
> ### New system behavior
> The algorithm should include an enhance link modifier that can identify the possible types of links and determine if should be modified and refactor to absolute path or not.
> 
> 
>  # **3. The Consequences (Architectural Impact)**
> ***Impact***
> 
> - Requires modification accross ==REQ-020== TraceabilityPipeline.js, specifically in the method that builds the file links map. 
> - Requires the creation of a link reconstruction method that determines if the link should be modified or not and makes it an absolute path if required
> 
> ***Positive Effects***
> 
> - Solves silent failure. Corrupted, duplicated documentation connections 



--- 
###### Links: 
@trace REQ-020 @
###### Reference :
