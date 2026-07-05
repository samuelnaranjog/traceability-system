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

> [!todo] **Scenario:** Git Tree Workflow Intialization and symlink wormhole
> `Precondition - Action - Outcome`
> 
> **Given** the builder wants to work in a new artifact implementation , **When** decides to start the creation and problem solving, **Then** the ***script*** should:
> 1. Create a folder with the prefix if not previously created and move the main worktree dir there
> 2. Create a new worktree with the artifact to work on within the folder with the project identifier prefix
> 3. Connect the `docs` of the new worktree to the folder in the markdown editor

> [!todo] **Scenario:** Git Tree Workflow Closure for symlink wormhole
> `Precondition - Action - Outcome`
> 
> **Given** the builder as finish the artifact implementation and its related files, **When** the builder has `squash` the history and has the ready to deploy commit with the expected `ADR-008` structure , **Then** the ***script*** should:
> 1. Merge the final commit to the main branch 
> 2. Unlink the symlink connection of the markdown editor for the specific docs folder and link the `main` docs tree
> 3. Delete the worktree once the commit is present in the main branch to ensure no data is lost

> [!todo] **Scenario:** Git Tree Workflow Intialization enhance functionality for VSCode instance
> `Precondition - Action - Outcome`
> 
> **Given** the builder wants to work in a new artifact implementation , **When** decides to start the creation and problem solving, **Then** the ***script*** should:
> 1. Create a folder with the prefix if not previously created and move the main worktree dir there
> 2. Create a new worktree with the artifact to work on within the folder with the project identifier prefix
> 3. Connect the `docs` of the new worktree to the folder in the markdown editor
> 4. Open a VS code instance by using a command flag
## Analytical Breakdown

| **Problem Solving documentation** | **File**                                                                |
| --------------------------------- | ----------------------------------------------------------------------- |
| 2026-07-03                        | [TSO-REQ-023_Analytical_Breakdown](TSO-REQ-023_Analytical_Breakdown.md) |


--- 
###### Links: 

###### Reference :
@trace ADR-008 @