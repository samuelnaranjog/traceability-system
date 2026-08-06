---
Project: TraceabilitySystem
Status: 4-Done
Priority:
Description: Scanning the project, extracting file paths and building an Interconnected web of artifact to artifact and files to artifact relationship
---

# Connections

| Type                                  | Route                                                                                                                                                                                                                                                                |
| :------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **📓 Requirements**                   | [TSO-SREQ-020B\_Classify\_&\_ Create\_Dynamic\_Connections\_Table](<TSO-SREQ-020B_Classify_&_ Create_Dynamic_Connections_Table.md>)                                                                                                                                  |
| **🛡️ Verification (Tests & Config)** | [PathExtractionHelper.unit.test](../../test/unit/PathExtractionHelper.unit.test.js)                                                                                                                                                                                  |
| **🛠️ Utility**                       | [FileSelectionHelper.util](../../src/core/utils/FileSelectionHelper.util.js)<br />[build-synapse-working-data.util](../../src/core/utils/build-synapse-working-data.util.js)<br />[path-extraction-helper.util](../../src/core/utils/path-extraction-helper.util.js) |

# Acceptance Criteria

## Identify & collect folder files

> [!success] **Scenario:** Folder File Mapping
> `Precondition - Action - Outcome`
>
> **Given** the `synapse-engine` has been trigger , **When** the script begins , **Then**
>
> 1. The engine correctly identifies the current `cwd` project root folder and operates over it.
> 2. Files and directories data including its name and path are store separated
> 3. Files of non interest stored in the `system-config.json` `excludeList` are exclude by the file extraction helper.
> 4. When a project folder contains more nested directories this process should be repeated for directories found in the root directory and directories of directories find within those **without loosing** any data.

## Search connections and build the interconnected web

> [!success] **Scenario A:** Regex Expression Extraction & filtering
> `Precondition - Action - Outcome`
>
> **Given** the file data has been stored, **When** the code is iterating over the files extracting each file data one at the time , **Then** the regex filtering should work in the next order
>
> 1. The engine extracts data between the keyword using `@trace` and end key char `@` to end the regex extraction
> 2. The artifact identifiers follow the next patter: a `white space`followed by `uppercase letters` followed by a  hyphen `-` followed by numbers from 0-9 (e.g, `@trace CAD-000 @` ).
> 3. The engine selects and creates a connection of the file with the reference to the the actual valid **artifact identifiers** ensuring its identifier is in the accepted artifact list (e.g, `REQ`, `ADR`, ..) and is following the patter of artifact Identifier and number (e.g, `REQ-000`, ...)
> 4. The resulting data never has duplicated references.

> [!success] **Scenario B:** Multiple keyword mentions within a  File complex data extraction
> `Precondition - Action - Outcome`
>
> **Given** the file data has been stored and the algorithm has extracted the data of the files **When** the regex match is perform , **Then** the algorithm should handle both files with one keyword mention and files with multiple keyword mentions

***

## References

* **Implements:** @trace ADR-009  @
* **Depends On:** @trace @
* **Parent:** @trace REQ-020 @

***

## PKB References
