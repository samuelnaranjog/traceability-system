---
Project: TraceabilitySystem
Status: 4-Done
Priority:
Description: The engine takes the interconnected web and the map of the project files to classify and write a custom markdown table containing the connections data as specified in the configuration file.
---

# Connections

| Type                                | Route                                                                                                                                                            |
| :---------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **⚙️ Core Logic (Backend/Systems)** | [TraceabilityPipeline](../../src/core/synapse-engine/TraceabilityPipeline.js)                                                                                    |
| **🛠️ Utility**                     | [build-synapse-working-data.util](../../src/core/utils/build-synapse-working-data.util.js)<br />[serialize-AST.util](../../src/core/utils/serialize-AST.util.js) |

# Acceptance Criteria

> [!success] **Scenario A:** Artifact with connections path extraction & duplicates guard rails
> `Precondition - Action - Outcome`
>
> **Given** the engine has the data of all the files present in the project & the interconnected web of relationships is built, **When** a artifact identifier (e.g, `CAD-000`) is selected to find its path  , **Then** the algorithm should find the valid absolute path of that artifact, making sure there are not duplicate artifacts with the same identifier and avoiding the helper artifact **"Analytical\_Breakdown"** & extra hyphens indicating an extra version (e.g, `_2` `_3`, ...) since it will contain the same artifact identifier as the artifact.

> [!success] **Scenario B:** Surgical Injection of connections to each artifact in a traceability matrix.
> `Precondition - Action - Outcome`
>
> **Given** The target folder contains valid source files and  Markdown artifact files, the `system configuration` file contains  the instructions of **categorization** based on extension or artifact identifier characters. **When** the main execution thread is executed against the root project folder... , **Then** Then the system should:
>
> 1. Correctly classify and map the files and artifact to their connected referenced artifacts.
> 2. Generate a Markdown table containing the classified connections.
> 3. Inject this table within the specific artifact Markdown file without altering the surrounding content, checking that a **specified header** section in the system config file is present and inserting the table or updating it right in that section.

***

## References

* **Implements:** @trace @
* **Depends On:** @trace SREQ-020A @
* **Parent:** @trace REQ-020 @

***

## PKB References
