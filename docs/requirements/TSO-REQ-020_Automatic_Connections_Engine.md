---
Status: 2-Active
Priority: P2-Normal
Project: TraceabilitySystem
Description: Engine that automatically connects and updates the connections between files to artifacts and artifacts to artifacts.
---

# Connections

| Type                                  | Route                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| :------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **📓 Requirements**                   | [TSO-SREQ-020A\_Artifacts\_Connections\_Reference\_Extraction](TSO-SREQ-020A_Artifacts_Connections_Reference_Extraction.md)<br />[TSO-SREQ-020B\_Classify\_&\_ Create\_Dynamic\_Connections\_Table](<TSO-SREQ-020B_Classify_&_ Create_Dynamic_Connections_Table.md>)<br />[TSO-SREQ-020C\_Hand\_Written\_Links](TSO-SREQ-020C_Hand_Written_Links.md)<br />[TSO-SREQ-020D\_Self\_Healing Global\_Orchestrator\_&\_Operational\_Contract](<TSO-SREQ-020D_Self_Healing Global_Orchestrator_&_Operational_Contract.md>) |
| **🛡️ Verification (Tests & Config)** | [TraceabilityPipeline.test](../../test/unit/TraceabilityPipeline.test.js)                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **🛠️ Utility**                       | [TraceabilityPipeline.mock.util](../../test/utils/TraceabilityPipeline.mock.util.js)                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **⚙️ Core Logic (Backend/Systems)**   | [TraceabilityPipeline](../../src/core/synapse-engine/TraceabilityPipeline.js)                                                                                                                                                                                                                                                                                                                                                                                                                                       |

# Story

> [!abstract] User Story
> `User type - Action - Output`
>
> **As a** Builder,
> **I want to** avoid the friction and cognitive debt of having to switch files to create a connection to the artifacts, support all kind of files and coding languages, avoid manually creation of fragile relative paths and refactor the whole connections when something as small as the name or the location is changed
> **So that** there is no need to manually refactor the links when name, folder name or folder location is change or need to think about the relative path to the file. This way I avoid the debt of having broken links across the traceability system and manage to create infinite connections between files and nested relationships between artifacts.

## Analytical Breakdown

| **Problem Solving documentation** | **File**                                                                       |
| --------------------------------- | ------------------------------------------------------------------------------ |
| 2026-06-17                        | [TSO-REQ-020\_Analytical\_Breakdown](TSO-REQ-020_Analytical_Breakdown.md)      |
| 2026-07-21                        | [TSO-REQ-020\_Analytical\_Breakdown\_2](TSO-REQ-020_Analytical_Breakdown_2.md) |

***

## References

* **Implements:** @trace VS-006 ADR-003 @
* **Depends On:** @trace @
* **Parent:** @trace @

***

## PKB References

* [[(Literature) Regex expression in Java Script]]
* [[File handling in Java (visual)]]
* [[(Literature) JavaScript cool loops and methods for selection and data modification]]
* [[(Literature)  Library for easy data extraction from markdown files]]
* [[(Literature) File handling features of node JS]]
* [[(Literature) jest support ES modules]]
