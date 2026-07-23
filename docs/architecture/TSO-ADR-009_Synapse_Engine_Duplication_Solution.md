---
Project: TraceabilitySystem
State: Approved
Priority: P0-Critical
Description: The system when run for the second time with a .synapse-state.json fails completely to compare and define which link are hand written links because is using relative link to compare with absolute paths, identifying all as hand written, generating duplication.
---

> [!info] 🏛️ TSO-ADR-009
>
> **Date of Decision:**  2026-07-29
>
> ***
>
> # *Connections*
>
> | Type                | Route                                                                                                                                                                                                                                       |
> | :------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
> | **📓 Requirements** | [TSO-SREQ-020A\_Artifacts\_Connections\_Reference\_Extraction](../requirements/TSO-SREQ-020A_Artifacts_Connections_Reference_Extraction.md)<br />[TSO-SREQ-020C\_Hand\_Written\_Links](../requirements/TSO-SREQ-020C_Hand_Written_Links.md) |
>
> ***
>
> # **1. The Context (Systemic Problem)**
>
> ## ***Issue***
>
> When the system has already build some dynamic tables of relative links, it collects each file links to check if the table link is a hand written one. However to do so it uses a set of absolute paths, and when comparing it to relative links of course fails to identify that is not a `hand-written` one. Generating a list of multiple duplicated  links as show below, for each of the dynamic connection a relative link is passed as hand written link that is not catch because is actually different from the actual absolute path
>
> | Type                                | Route                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
> | :---------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
> | **🎨 Client Layer (Frontend/UI)**   | [01\_proof\_of\_concept](../../prototypes/01_proof_of_concept.py)<br />[01\_proof\_of\_concept](../../prototypes/01_proof_of_concept.py)<br />[01\_proof\_of\_concept](../../prototypes/01_proof_of_concept.py)<br />[01\_proof\_of\_concept](../../prototypes/01_proof_of_concept.py)                                                                                                                                                                                                                                                                                                                                                                                 |
> | **📕 Architecture**                 | [PRO-ADR-001\_Microkernel](../architecture/PRO-ADR-001_Microkernel.md)<br />[PRO-ADR-002\_Micro\_Connection](../architecture/PRO-ADR-002_Micro_Connection.md)<br />[PRO-ADR-001\_Microkernel](../architecture/PRO-ADR-001_Microkernel.md)<br />[PRO-ADR-002\_Micro\_Connection](../architecture/PRO-ADR-002_Micro_Connection.md)<br />[PRO-ADR-001\_Microkernel](../architecture/PRO-ADR-001_Microkernel.md)<br />[PRO-ADR-002\_Micro\_Connection](../architecture/PRO-ADR-002_Micro_Connection.md)<br />[PRO-ADR-001\_Microkernel](../architecture/PRO-ADR-001_Microkernel.md)<br />[PRO-ADR-002\_Micro\_Connection](../architecture/PRO-ADR-002_Micro_Connection.md) |
> | **⚙️ Core Logic (Backend/Systems)** | [pipeline](../../src/core/pipeline.js)<br />[pipeline](../../src/core/pipeline.js)<br />[pipeline](../../src/core/pipeline.js)<br />[pipeline](../../src/core/pipeline.js)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
> |                                     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
>
> **Another duplication source**
> While tracing down the data flow I realize that the ExtractAndMatch utility that generates the connections based on the artifact mention in the project files could create duplicates if the artifact is mention multiple time in the same `@trace block @` or if multiple `@trace block @` are present with the same artifact mention.
>
> ## ***Propose Design***
>
> ### File hand written links approach
>
> #### ==Convert the relative path to absolute==
>
> Take the artifact path and from it rebuild the absolute system path of the link ready for comparison.
>
> The problem is that it will need me to handle some edge cases that are not system paths, that need to be address so that the app does not crash, such as:
>
> * Handling URIs to apps
> * Handling links to the web
> * others....
>
> #### ==Use the name of the file==
>
> Another approach could be to use the name of the file to determine if is a dynamic link, per the system constraint dynamic links `link name` section is the file name without extension, so if the relalitive and link name are the same then it should be transform to absolute path
>
> ### ==Modify the ExtractAndMatch Utility==
>
> The utility must be redesign to be cleaner and bulletproof to duplication
>
> # **2. The Decision**
>
> Even approach 2 seems clever and low effort to implement it hides a destructive flaw:
>
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
>
> This is the approach selected, is stronger but will require more edge case handling. As mention before and extended integrating bullet proof validation for:
>
> * URIs to apps (Use regex structure to identify it)
> * Links to the web (Use http identifier)
> * Local Path Fragments (`../file.js#L50`)
> * Internal Document Anchors (`#`)
> * URL Encoding in Filenames (`%20`)
>
> ### New system behavior
>
> The algorithm should include an enhance link modifier that can identify the possible types of links and determine if should be modified and refactor to absolute path or not. This way the engine identifies possible relative paths and instead of relying on them it converts it for a proper and stronger comparison.
>
> ## extractAndMatch Utility redesign
>
> Action required:
>
> * Change the data structures being use from arrays to sets, transforming comparison to O(1).
>
> * Integrate a record set that will be populated with the files that have already been scanned. This set will help you track the system scanner and skip any duplicated scans avoiding duplication and making the system more efficient
>
> # **3. The Consequences (Architectural Impact)**
>
> ***Impact***
>
> * Requires modification accross ==REQ-020== TraceabilityPipeline.js, specifically in the method that builds the file links map.
> * Requires the creation of a link reconstruction method that determines if the link should be modified or not and makes it an absolute path if required
> * Redesign of the extractAndMatch util in the `path-extraction-helper`
>
> ***Positive Effects***
>
> * Solves silent failure. Corrupted, duplicated documentation connections

***

###### Links:

###### Reference :
