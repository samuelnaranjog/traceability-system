---
Project: TraceabilitySystem
State: Approved
Priority: P0-Critical
Description:
---

> [!info] 🏛️ TSO-ADR-012
>
> **Date of Decision:**  2026-08-08
>
> ***
>
> # *Connections*
>
> | Type                | Route                                                                                                                                                                                                                                                                                   |
> | :------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
> | **📓 Requirements** | [TSO-SREQ-023C\_Enhance\_Support\_Configuration\_Contracts](../requirements/TSO-SREQ-023C_Enhance_Support_Configuration_Contracts.md)<br />[TSO-SREQ-024B\_Enhance\_Support\_Git\_configuration\_Contract](../requirements/TSO-SREQ-024B_Enhance_Support_Git_configuration_Contract.md) |
>
> ***
>
> # **1. The Context (Systemic Problem)**
>
> ## ***Issue***
>
> ## The cross device sync problem
>
> Within this json the is a specific property that causes problems if set for all branches and devices
>
> ```
> ▼{"gitWorkTreeScriptConfig":{"markdownEditorFolderPath":"/Users/s_n_gr/My Drive .../OBSIDIAN/Projects/Traceability_System"
> }
>
> ```
>
> If this property is set and sync across devices then the system will break completely when using the system in other device. But not synchronizing the `system-config.json` will also introduce friction and a critical vulnerability.
> If the file is `.gitignore` then each worktree or branch and each device must implement the system rules, this makes it incredible fragile and full of friction it will definitely end up breaking the `synapse-engine`  & ` spawn-engine` or causing a massive refactor across the **artifacts** leading to a **polluted git leader**.
> However if it is sync then the `"markdownEditorFolderPath"` property will be set and the `spawn` engine will not work in other devices.
>
> ## ***Propose Design***
>
> # **2. The Decision**
>
> ### ==Local variable md editor path storage==
>
> All worktrees share a same `.git/config` that is local and own to each project, the system could stop depending in `"markdownEditorFolderPath"` within the `system-config.json` and instead relying only in the **git config** which is local and enable `system-config.json` to be store within the git history and shared across devices ensuring **Traceability System** consistency across all project branches trees and devices.
>
> ## **3. The Consequences (Architectural Impact)**
>
> ## *Impact*
>
> * Requires modification across REQ-023 & REQ-024 implement utility functions that interact with the git config to ensure the md editor target path is added properly and validate its presence
> * Requires the inclusion of an util that commit the project prefix when added through the CLI.
>
> ## *Positive Effects*
>
> * The system becomes resistant to cross device synchronization and team work, since each project copy in all devices have a local target md editor for the symlink creation

## References

* **Supersedes:** @trace  @

- **Complements:** @trace ADR-010 @

* **Depends On:** @trace  @

***

## PKB References
