---
Project: TraceabilitySystem
Status: 4-Done
Priority: P1-High
Description: The dev-workflow initialization, folder set up, tree creation, symlink connection
---

# Connections

| Type                                  | Route                                                                                                                                                         |
| :------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **📓 Requirements**                   | [TSO-SREQ-023C\_Enhance\_Support\_Configuration\_Contracts](TSO-SREQ-023C_Enhance_Support_Configuration_Contracts.md)                                         |
| **🛡️ Verification (Tests & Config)** | [SpawnEngine.e2e.test](../../test/e2e/SpawnEngine.e2e.test.js)<br />[SpawnEngineSetUpHelper.test](../../src/core/dev-workflow/SpawnEngineSetUpHelper.test.js) |
| **⚙️ Core Logic (Backend/Systems)**   | [DevWorkflowOperations](../../src/core/dev-workflow/DevWorkflowOperations.js)<br />[SpawnEngineHelper](../../src/core/dev-workflow/SpawnEngineHelper.js)      |

# Acceptance Criteria

> [!success] **Scenario A:** Git Tree Workflow & Symlink Connection To The Markdown Editor Update
> `Precondition - Action - Outcome`
>
> **Given**  the builder wants to work in a new artifact implementation,  config prefix is added, config markdown editor path is present  & the command is run form a worktree of the project , **When** decides to start by running the command `spawn <artifact> -s` or `spawn <artifact> --symlink` e.g: `spawn req025 -s`  , **Then** the ***script*** should:
>
> 1. Create a folder with the prefix if not previously created and move the main worktree dir and other worktrees present there
> 2. Handle the `config-system.json` presence if not handle its creation
> 3. Create a new worktree with the artifact in lowercase as name and branch to work  within the folder with the project identifier prefix
> 4. Connect the `docs` of the new worktree to the folder in the markdown editor

> [!success] **Scenario B:** Git Tree Workflow Intialization enhance functionality for VSCode instance & Symlink Connection To The Markdown Editor Update
> `Precondition - Action - Outcome`
>
> **Given**  the builder wants to work in a new artifact implementation,  config prefix is added, config markdown editor path is present  & the command is run form a worktree of the project , **When** decides to start by running the command `spawn <artifact> -sc` or `spawn <artifact> --symlink --code` e.g: `spawn req025 -sc`  , **Then** the ***script*** should:
>
> 1. Create a folder with the prefix if not previously created and move the main worktree dir and other worktrees present there
> 2. Handle the `config-system.json` presence if not handle its creation
> 3. Create a new worktree with the artifact in lowercase as name and branch to work  within the folder with the project identifier prefix
> 4. Connect the `docs` of the new worktree to the folder in the markdown editor
> 5. Open a VS code instance

> [!success] **Scenario C:** Git Tree Workflow Intialization enhance functionality for VSCode instance
> \*\***Given** the builder wants to work in a new artifact implementation without creating a new symlink maybe for multi concurrent requirement implementation,  config prefix is added, config markdown editor path is present & the command is run from a worktree of the project , **When** decides to start by running the command `spawn <artifact> -c` or `spawn <artifact> --code` e.g: `spawn req025 -c` , **Then** the ***script*** should:
> **Given**  the builder wants to work in a new artifact implementation without creating a new symlink maybe for multi concurrent requirement implementation,  config prefix is added, config markdown editor path is present  & the command is run form a worktree of the project , **When** decides to start by running the command `spawn <artifact> -c` or `spawn <artifact> --code` e.g: `spawn req025 -c`  , **Then** the ***script*** should:
>
> 6. Create a folder with the prefix if not previously created and move the main worktree dir and other worktrees present there
> 7. Handle the `config-system.json` presence if not handle its creation
> 8. Create a new worktree with the artifact in lowercase as name and branch to work  within the folder with the project identifier prefix
> 9. Open a VS code instance

> [!success] **Scenario D:** Default only worktree creation folder set up
> `Precondition - Action - Outcome`
>
> **Given**  the builder wants to work in a new artifact implementation without creating a new symlink,  config prefix is added, the command is run form a worktree of the project , **When** decides to start by running the command `spawn <artifact>`  e.g: `spawn req025 `  , **Then** the ***script*** should:
>
> 10. Create a folder with the prefix if not previously created and move the main worktree dir and other worktrees present there
> 11. Handle the `config-system.json` presence if not handle its creation
> 12. Create a new worktree with the artifact in lowercase as name and branch to work  within the folder with the project identifier prefix

## Analytical Breakdown

| **Problem Solving documentation** | **File**                                                                  |
| --------------------------------- | ------------------------------------------------------------------------- |
| 2026-07-03                        | [TSO-REQ-023\_Analytical\_Breakdown](TSO-REQ-023_Analytical_Breakdown.md) |

## References

* **Implements:** @trace  @
* **Implements:** @trace  @
* **Parent:** @trace REQ-023 @

## PKB References

***
