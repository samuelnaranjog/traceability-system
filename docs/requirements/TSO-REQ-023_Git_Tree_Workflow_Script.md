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

```
# Git Wortree Set Up & Spawn Orchestrator
I develop the initial part of the system requirement of a workflow orchestrator that interacts with git and the system files to create a frictionless, fast and intuitive experience when bringing ideas to live.

Creating and isolated environment that ensures the change log remains pristine and connected to a specific Requirement artifact and its context and market value.

## Command and flags
The command that triggers the first part of the orchestrator is `spawn` with a string **argument** that will be the name of the requirement to implement e.g: `req023`. It can be called with different flags to modify the behavior of the orchestrator and achieve different functionalities:

- `--symlink` or `-s`
- `--code` or `-c`

### Flag Combinations and what it achieves

#### **Scenario A:** Git Tree Workflow & Symlink Connection To The Markdown Editor Update
Only trigger the command with the `-s` flag:
1. Creates a folder with the prefix if not previously created and move the main worktree dir and other worktrees present there
2. Create a new worktree with the artifact in lowercase as name and branch to work within the folder with the project identifier prefix
3. Connect the `docs` of the new worktree to the folder in the markdown editor

#### **Scenario B:** Git Tree Workflow Intialization enhance functionality for VSCode instance & Symlink Connection To The Markdown Editor Update
Trigger the command with the `-s` & `-c` flag:
1. Create a folder with the prefix if not previously created and move the main worktree dir and other worktrees present there
2. Create a new worktree with the artifact in lowercase as name and branch to work within the folder with the project identifier prefix
3. Connect the `docs` of the new worktree to the folder in the markdown editor
4. Open a VS code instance

#### **Scenario C:** Git Tree Workflow Initialization enhance functionality for VSCode instance
Only trigger the command with the `-c` flag:
1. Create a folder with the prefix if not previously created and move the main worktree dir and other worktrees present there
2. Create a new worktree with the artifact in lowercase as name and branch to work within the folder with the project identifier prefix
3. Open a VS code instance

#### **Scenario D:** Default only worktree creation folder set up

Trigger the command without flags:
1. Create a folder with the prefix if not previously created and move the main worktree dir and other worktrees present there
2. Create a new worktree with the artifact in lowercase as name and branch to work within the folder with the project identifier prefix

## Challenges
To handle the underlying mechanism of git such as the way it manages the links from the main worktree to its linked ones, how to move them without breaking the linkage and how to heal the systme once the main woerktree is moved represent a challenge that involve some hours of debugging, logs, investigation and testing to make it properly set up the initial state of the system and continue with the worktree creation. 
```
