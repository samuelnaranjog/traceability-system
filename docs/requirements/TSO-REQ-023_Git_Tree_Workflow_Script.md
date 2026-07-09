---
Project: TraceabilitySystem
Status: 2-Active
Priority: P1-High
Description:
---
## Story

>[!abstract] User Story
> `User type - Action - Output`
> 
**As a** Builder,
**I want to** run a custom script,
**So that** the workflow for git traceability is automated in the most tedious operations such as:
> - symlink for the markdown editor
> - worktree creation and symlink unlink
> - Default connection to the main while 
> - Deletion of the complete worktree. 


## Acceptance Criteria


> [!todo] **Scenario A:** Git Tree Workflow & Symlink Connection To The Markdown Editor Update
> `Precondition - Action - Outcome`
> 
> **Given**  the builder wants to work in a new artifact implementation,  config prefix is added, config markdown editor path is present  & the command is run form a worktree of the project , **When** decides to start by running the command `spawn <artifact> -s` or `spawn <artifact> --symlink` e.g: `spawn req025 -s`  , **Then** the ***script*** should:
> 1. Create a folder with the prefix if not previously created and move the main worktree dir and other worktrees present there
> 2. Create a new worktree with the artifact in lowercase as name and branch to work  within the folder with the project identifier prefix
> 3. Connect the `docs` of the new worktree to the folder in the markdown editor


> [!todo] **Scenario B:** Git Tree Workflow Intialization enhance functionality for VSCode instance & Symlink Connection To The Markdown Editor Update
> `Precondition - Action - Outcome`
> 
> **Given**  the builder wants to work in a new artifact implementation,  config prefix is added, config markdown editor path is present  & the command is run form a worktree of the project , **When** decides to start by running the command `spawn <artifact> -sc` or `spawn <artifact> --symlink --code` e.g: `spawn req025 -sc`  , **Then** the ***script*** should:
> 1. Create a folder with the prefix if not previously created and move the main worktree dir and other worktrees present there
> 2. Create a new worktree with the artifact in lowercase as name and branch to work  within the folder with the project identifier prefix
> 3. Connect the `docs` of the new worktree to the folder in the markdown editor
> 4. Open a VS code instance


> [!todo] **Scenario C:** Git Tree Workflow Intialization enhance functionality for VSCode instance
> `Precondition - Action - Outcome`
> 
> **Given**  the builder wants to work in a new artifact implementation without creating a new symlink maybe for multi concurrent requirement implementation,  config prefix is added, config markdown editor path is present  & the command is run form a worktree of the project , **When** decides to start by running the command `spawn <artifact> -c` or `spawn <artifact> --code` e.g: `spawn req025 -c`  , **Then** the ***script*** should:
> 1. Create a folder with the prefix if not previously created and move the main worktree dir and other worktrees present there
> 2. Create a new worktree with the artifact in lowercase as name and branch to work  within the folder with the project identifier prefix
> 3. Open a VS code instance


> [!todo] **Scenario C:** Git Tree Workflow Intialization enhance functionality for VSCode instance
> `Precondition - Action - Outcome`
> 
> **Given**  the builder wants to work in a new artifact implementation without creating a new symlink maybe for multi concurrent requirement implementation,  config prefix is added, config markdown editor path is present  & the command is run form a worktree of the project , **When** decides to start by running the command `spawn <artifact> -c` or `spawn <artifact> --code` e.g: `spawn req025 -c`  , **Then** the ***script*** should:
> 1. Create a folder with the prefix if not previously created and move the main worktree dir and other worktrees present there
> 2. Create a new worktree with the artifact in lowercase as name and branch to work  within the folder with the project identifier prefix
> 3. Open a VS code instance


> [!todo] **Scenario D:** Default only worktree creation folder set up
> `Precondition - Action - Outcome`
> 
> **Given**  the builder wants to work in a new artifact implementation without creating a new symlink,  config prefix is added, the command is run form a worktree of the project , **When** decides to start by running the command `spawn <artifact>`  e.g: `spawn req025 `  , **Then** the ***script*** should:
> 1. Create a folder with the prefix if not previously created and move the main worktree dir and other worktrees present there
> 2. Create a new worktree with the artifact in lowercase as name and branch to work  within the folder with the project identifier prefix

*Scope closure script*
> [!todo] **Scenario:** Git Tree Workflow Closure for symlink wormhole
> `Precondition - Action - Outcome`
> 
> **Given**  the builder as complete the implementation of the the command is run form a worktree of the project **When** the builder has `squash` the history and is ready to deploy commit with the expected `ADR-008` structure , **Then** the ***script*** should:
> 1. Merge the final commit to the main branch 
> 2. Unlink the symlink connection of the markdown editor for the specific docs folder and link the `main` docs tree
> 3. Delete the worktree once the commit is present in the main branch to ensure no data is lost

## Analytical Breakdown

| **Problem Solving documentation** | **File**                                                                |
| --------------------------------- | ----------------------------------------------------------------------- |
| 2026-07-03                        | [TSO-REQ-023_Analytical_Breakdown](TSO-REQ-023_Analytical_Breakdown.md) |


--- 
###### Links: 
@trace ADR-008 @
###### Reference :
- [[(Literature) How to handle arguments and flags of a script in node js]]
- [[(Literature) Node js interacting with the CLI for shell tasks]]
