---
Project: TraceabilitySystem
Status: 4-Done
Priority:
Description:
---

# Connections

| Type                                | Route                                                                         |
| :---------------------------------- | :---------------------------------------------------------------------------- |
| **⚙️ Core Logic (Backend/Systems)** | [TraceabilityPipeline](../../src/core/synapse-engine/TraceabilityPipeline.js) |
| **🛠️ Utility**                     | [ResolveLinkType.util](../../src/core/utils/ResolveLinkType.util.js)          |

# Acceptance Criteria

> [!success] **Scenario:** Handling hand written links with hand written table & system first run
> `Precondition - Action - Outcome`
>
> **Given**
>
> * the `artifact` has a hand written links within a table of two columns `Type` & `Route`, which in its row has a valid type of the preconfigured classifications in the `system-config-json` and in the route a link corresponding to that classification.
> * No past state snapshot json has been created: `.synapse-state.json`
> * Some Dynamic Connection in a system file with `@trace` `@` is pointing to the artifact
>
> **When** the `synapse` engine is run.
> **Then** the expected behavior is:
>
> 1. The system should create the empty `.synapse-state.json`
> 2. The system should preserve the  link url in the proper classification
> 3. the system should preserve the custom name in the link if present
> 4. The system should preserve the dynamic connection that point using the keyword

> [!todo] **Scenario:** Handling hand written links with hand written table & System >1 run
> `Precondition - Action - Outcome`
>
> **Given**
>
> * the `artifact` has a hand written links within a table of two columns `Type` & `Route`, which in its row has a valid type of the preconfigured classifications in the `system-config-json` and in the route a link corresponding to that classification.
> * A past state snapshot json has been created: `.synapse-state.json`
> * Some Dynamic Connection in a system file with `@trace` `@` is pointing to the artifact
>
> **When** the `synapse` engine is run.
> **Then** the expected behavior is:
>
> 1. The system write successfully the system snapshot in `.synapse-state.json`
> 2. The system should preserve the  link url in the proper classification
> 3. the system should preserve the custom name in the link if present
> 4. The system should preserve the dynamic connection that point using the keyword

> [!todo] **Scenario:** Handling hand written links that survive in the connection table like prototypes to figma or others
> `Precondition - Action - Outcome`
>
> **Given** The System has collected the files and related them to the specific artifact which they reference , **When** the command `synapse` or the builder make a commit , **Then**
>
> 1. It should extract the link from the connections table & identify which ones are hard links.
> 2. It should Include the hard link in the refactored connections table
> 3. The hard link should be in the proper row where it was written.

***

***

###### Links:

@trace REQ-020 @

###### Reference :

[[(literature) AST in node.js]]
