---
Project: TraceabilitySystem
State: Approved
Priority: P2-Normal
Description: Establishes the operational rules for maintaining an indestructible Docs-as-Code traceability network to prevent cognitive drift, eliminate merge conflicts on global design laws, and ensure cross-platform portability. The repository enforces a strict Lineage Protocol
---
> [!info] 🏛️ TSO-ADR-011
> 
> **Date of Decision:**  2026-08-06 
> 
> ---
> # *Connections*
> 
> ---
>  # **1. The Context (Systemic Problem)**
>  
> ## ***Issue***
>
> When developing and assigning references of what implements what the builder must have clear constraint on where to write the manual pointers. This way the mental working memory can focus strictly in writing code and not thinking should i write a manual pointer in this ADR or in this REQ or in both so that links are created in both files.
> 
> What happens when a REQ and SREQ (sub-requirements) what should be connected to what and where manual pointers go.
> 
> ## ***Propose Design***
> 
>  _Implementation references Context. Context **never** manually references Implementation. All manual pointers flow upward/forward. The `synapse` engine and `md editor backlink support` automatically calculate the reverse connections.
> 
> #  **2. The Decision**
> 
> ## Scenario 1:  Code or implementation to requirement (Execution -> REQ)
> 
> **Rule:** Source code files never contain file paths. They only contain abstract semantic tags pointing to the requirement they fulfill. The engine will auto-inject the link into the REQ file.
> 
> **Developer Action:** Write the tag in the code. Do not touch the markdown file.
> ```javascript
>     
>     // Inside src/core/auth.js
>     
>     // @trace `OPT-REQ-025`
> ```
> 
> ### Extended: ADR implementation Code or REQ implementation code
> 
> To make it blazing fast to figure out which function of section of the code implement the ADR constraint or the REQ feature or behavior.
> 
> **Rule**:
> - add a comment this time not in trace mode for ADR only with text like 
> ```
> // Implements: `ADR-009`
> function noDuplicates();
> ```
> 
> - For REQ implementation (e.g, A function that implement the REQ or SREQ) make trace call with the `@trace` `@`
> ```
> // @trace `<REQ-000>` @
> function noDuplicates();
> ```
> 
> Then when navigating the code base you simply use `cmd/ctrl + f` and search for the REQ or ADR implementation 
> 
> #### Not found ADR ref, what it means
> If the manual pointer is not found it means that the code file you're looking at doesn't implement an ADR constraint but does help supporting the functionality of the REQ it mentions.
> #### Referencing both a specific section that implement an ADR and the Requirement related section
> ```
> // @trace `<REQ-000>` @
> // Implements: `ADR-009`
> function noDuplicates();
> ```
> ## Scenario 2: Requirement to Architecture (REQ ➔ ADR)
> 
>  **Rule:** 
>  - Requirements link up to the architectural laws that govern them using relative Markdown links. ADRs are immutable laws and must **never** contain manual pointer lists of requirements that implement them.
> - The builder writes the pointer `@trace `ADR-000` @` in the REQ 
>     ```
>     #### Links
>     - Implements: @trace `ADR-000` @
>     ```
> 
> ## Scenario 3: Sub-Requirements (Sub-REQ ➔ ADR / Parent)
> 
> **Rule:** 
> - If a specific sub-requirement handles the granular implementation of an architectural rule, the sub-requirement holds the direct link to the ADR. The parent REQ does not duplicate it.
> -  Link the Sub-REQ to the ADR and to its Parent REQ.
> 
> **Example**
> ```
> - Implements: @trace `ADR-000` @
> - Parent: @trace `REQ-001` @
> ```
> 
> ## Scenario 4: Lateral Dependencies (Artifact -> artifact)
>  **Rule**
> - When two artifacts of the same type connect, the _Dependent/New_ artifact points to the _Foundational/Old_ artifact. Mutual, bidirectional hardcoding (spaghetti links) is strictly banned to prevent infinite loops.
> -  Only edit the newer or dependent file.
>     
> **Example (REQ to REQ):** `OPT-REQ-026` (Password Reset) relies on Login `OPT-REQ-025`.
> 
> ```
>  - Depends On: @trace `REQ-025` @
> ```
>     
> **Example (ADR to ADR):** 
> - `SYS-ADR-005` (GraphQL) **replaces** REST. `SYS-ADR-001`
> 
> ```
> - Supersedes: @trace `ADR-001` @
> ```
> 
> - `SYS-ADR-006_GraphQL` **complements**  `SYS-ADR-005_MongoDB` 
> 		- When a new architecture (GraphQL) is introduced to work alongside an existing architecture (MongoDB), the **Newer ADR points to the Older ADR**.
> 
> You change the prefix from `Supersedes:` to **`Extends:`** or **`Complements:`**.
> 
> ```
> - Complements: @trace `ADR-005` @
> ```
> 
> ## This reference in artifact should be written in a specific section
> The section to write this relationships should be `## References` in all artifacts
> 
> **Example ADR**
> ```
> ## References
> - **Supersedes:** @trace `ADR-001` @ 
>   *(Use when the new ADR completely replaces an older one).*
> - **Complements:** @trace `ADR-006` @ 
>   *(Use when the new ADR works alongside another existing system, like GraphQL next to MongoDB).*
> - **Depends On:** @trace `ADR-003` @
>   *(Use when this architecture physically cannot exist without the other).*
> ```
> 
> **Example REQ**
> 
> ```
> ## References
> - **Implements:** @trace `ADR-000` @ 
>   *(Use when the REQ is governed by a specific architectural law).*
> - **Depends On:** @trace `REQ-005` @ 
>   *(Use when this feature cannot be built until the target feature is finished).*
> - **Parent:** @trace `REQ-001` @ 
>   *(Use for Sub-Requirements pointing back to their main story).*
> 
> ```
> 
> 
> 
>  # **3. The Consequences (Architectural Impact)**
>  
> ## *Impact*
> - An ADR dictates _how_ you code, but a REQ dictates _why_ you are coding. Therefore, if a function implements an ADR constraint, it **must still belong to a business requirement**. You cannot bypass the REQ layer entirely.
> ## *Positive Effects*
> - This builder rules ensures consistency across code and artifacts, while having a clear map on how to connect and reference in specific scenarios liberating working memory for what actually matters building moving the product forward.


---
## References

- **Supersedes:** @trace  @
- **Complements:** @trace ADR-003  @
- **Depends On:** @trace  @

---
## PKB References
