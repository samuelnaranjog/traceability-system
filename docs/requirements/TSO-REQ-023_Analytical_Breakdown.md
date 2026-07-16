---
excalidraw-plugin: parsed
tags:
  - excalidraw
---
==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠== You can decompress Drawing data with the command palette: 'Decompress current Excalidraw file'. For more info check in plugin settings under 'Saving'


# Git work tree workflow 1 init pseudo code

## Execution Plan
> [!todo] **Scenario:** git worktree init default
> `Precondition - Action - Execution Plan`
> 
> **Given** the builder is ready for a new implementation, config prefix is added, config symlink is present, **When** the user triggers a cli action with the *command*: `` , **Then** the script should:
> ==Data Structures==: 
> - Config file with data -> markdown editor project folder path, prefix folder for tree storage, prefix of the project
> ==Algorithm==
> - [ ] Check the config file is found and the config parameters are provided if not ask to do so.
> - [ ] !Check if the folder with the prefix of the project is created (could check if that folder has been added to the config file)
> 
> **Foundational set up**
> - [x] find the arguments you should use
> - [x] set up the parse args schema
> - [x] Check the config file is found and the config parameters are provided make the script create it.
> 		**NOT**
> 	- [x] Create config file
> - [x] !Check if the folder with the prefix of the project is created (could check if that folder has been added to the config file)
> 		**NOT**
> 	- [x] get the config data 
> 	- [x] Check if the property exists and is not empty
> 	- [x] If empty ask the user for a prefix 
> - [x] ask for the prefix if not created in the config
> - [x] ask for the obsidian path if running symlink script version and the symlink is not present in the config
> 
> **Functionality 1:** Prefix folder set up
> - [x] check if the worktrees have as root the prefix folder - if the current running one does not it might be a show an inconsistency, 
> - [x] check if the main tree has a parent folder with the prefix( use: git rev-parse --show-toplevel to find the parent) - if yes then it should check the parent being that for the other trees if not move them there.
> Note: At this point the trees must be all in the prefix folder, then the creation logic can be executed
> 
> 
> **Functionality 4**
> - [x] Create a new tree on the prefix identifier folder
> - [ ] 
> - [x] figure out the relative path to the worktree folder that contains all branches
> - [x] use new worktree by programatically if command as to do so **open editor instance**
> **Functionality 5**
> - [x] Get from the config file the folder of the markdown editor for this project and update the symlink connection that should point to main by unlink it
> - [x] !Check also that there are only one symlink if not ask the builder to resolve manually the conflict (use readdir and filter)
> - [ ] 
> - [ ]  !Before unlinking it you should check that it is pointing to the main branch folder
> - [ ]   !If not you might be running in a conflict so notify that
> - [ ] If yes unlink and create a symlink connection to the new tree `docs` folder in the markdown editor vault
> -
> ==Some Other Edge Cases==
> 
> - [ ] The algorithm should check there is no other folder name with that prefix in the folder
> - [ ] If so it should notify a prefix conflict
> ---
> - [ ] Check if the config file exist and that it has the foundational parameters, if not inform what to put

## Test
Based on the acceptance criteria 
> [!todo] **Scenario A :** Git Tree Workflow & Symlink Connection To The Markdown Editor Update
> `Precondition - Action - Execution Plan`
> 
> **Given** the script as been createn , **When** i run it , **Then**

 - [ ] Check 

# Git work tree workflow closure pseudo code

> [!todo] **Scenario:**
> `Precondition - Action - Execution Plan`
> 
> **Given** .... , **When** .... , **Then**

- Run a rebase relative to the current state of main: so this will be the wip start if following to letter the workflow
- Use fs.unlink to detach the symlink and place it back on main: use trow error so that if it fails is catch
- delete the worktree again with thwor error to handle failure
==Edge case handling==

- Each git operation should be handle through spawn and the .on method: to handle the errro you should check if git return 0 or greater than 0, 0 being success. Also { stdio: 'inherit' } as a spawn argument is fundamental this way you connect the child process to the physical computer keyboard and active terminal window passing up stdout and sterr and stdin.

###

# Git staging workflow & pristine version control engineering
### Context of the problem 
Now that the system is getting to its final shape one of the most important tools it should integrate is git, but how to do it properly to ensure a pristine commit history to understand the project, its progression, what has been implemented and how the project as evolved over time.

Also easily look backwards for quickly identification of the implementation details we are looking for. Nor in a messy uncontextualized way but rather having clear context on what are those changes related to, which requisite is being implemented, refactor or updated

Managing docs and code within the same repository carries the risk of "micro commit bloat" only small work and temporary struggle that doesn't carry a significant weight when backward looking in the future fill the commit history. When reviewing you don't what to see hundreds of micro commits that doesn't actually inform of a complete feature.


I've analize the possible architectural decision including:

- _Workspace squashing and isolated staging_ of `wip` commits
- Git worktrees
- Clean commit guidelines
- Clean Room Extraction:  2 branches one for the `workspace`, containing all the **wip** messy commits.

### Edge cases
But the one that must be picked is the one that adresses the edge cases:

-  Probable cross device synchronization commits that should not be part of the final commit history.
- Another key edge case is the synchronization of the cloud repository and the conflict it might cause with the overall sync and the atomic commit history.
- Handling two REQs that modify the same file in different lines
- Complete vision of the doc files from the markdown renderer

### The decision
The final decision combines some of the previously mention alternatives and discards others but to make it short the solution is to use worktrees, one per requirement implementation and then clean it out, but this also comes with the frictions of having to update the symlink connection to the markdown editor of preference. 

Visually explained this will be the architecture: 


### Benefits

> **Semantic commits**  
> The repository becomes self-documenting. Generating "release notes", "architectural change log" or revising the project evolution becomes a mathematical query:
> 
> - `git log --grep="^type"`

> **Structural Bracket Identifier**  
> This makes it possible to audit the overall evolution of a specific requirement implementation or architectural decision over the project life by using `git log --grep="[ID]"`. Ease the debugging process and version control navigation.

> **Git-Tree**
> 
> - _Concurrent file work history collapse solution:_ by using the git-tree the edge case of losing track of multi line edits that belong to different REQs in the same file is handled gracefully by the work tree capabilities
> - _Dashboard blindness solution:_ Eliminates dashboard blindness by using the symlink connection
```mermaid
graph TD

%% Styling
classDef ui fill:#4a154b,stroke:#fff,stroke-width:2px,color:#fff;
classDef os fill:#0b3d91,stroke:#fff,stroke-width:2px,color:#fff;
classDef git fill:#f14e32,stroke:#fff,stroke-width:2px,color:#fff;

subgraph Markdown Editor UI
    V_MAIN[Main Vault]
end

subgraph Artifact And Related Files Implementation
    V_REQ25[REQ-025]
    V_REQ26[REQ-026]
end

subgraph Git Trees Dirs
    WT_MAIN[Main Worktree]
    WT_REQ25[REQ-025 Worktree]
    WT_REQ26[REQ-026 Worktree]
end

subgraph Git Data Base
    GIT_DB[(Shared .git DB)]:::git
end

%% Connections
V_MAIN -.- WT_MAIN
V_MAIN -.- WT_REQ25
V_MAIN -.- WT_REQ26
V_REQ25 -.-> WT_REQ25
V_REQ26 -.-> WT_REQ26

WT_MAIN ===> GIT_DB
WT_REQ25 ===> GIT_DB
WT_REQ26 ===> GIT_DB

%% Individual class assignments to prevent parser bugs
class V_MAIN ui;
class V_REQ25 ui;
class V_REQ26 ui;

class WT_MAIN os;
class WT_REQ25 os;
class WT_REQ26 os;
```
#### Workflow & the custom Script

Now finding paths to create symlinks, moving trees to a parent folder so i began the implementation of a script that ease the friction parts of the workflow to ensure the developer never gets out of flow due to administrative stuff:
```mermaid
graph TD
    A[New tree and link to markdown renderer folder by symlink]
    B[wip]
    C[Squash protocol]
    D[Final commit]
    E[Sync to main]
    F[Delete symlink and point back to main]
    G[Delete tree]
    H[Repeat]

    A --> B --> C --> D --> E --> F --> G --> H --> A

    Note[Helpful script]
    Note -.- A
    Note -.- F
    Note -.- G

    style Note fill:#fff2f2,stroke:#ff8888,stroke-width:2px,stroke-dasharray: 5 5
```

# Excalidraw Data

## Text Elements
Git Tree automation ^FWHSOwxc

Restate ^tZaXNOmG

Decompose ^YkLRmZ5b

Edge Identify ^KC9iosV9

Simplify ^0OggpH1T

Elements ^PZIGphwC

decompose headers ^EAm98EIw

decompose arrows ^7nbPabga

Some title ^Dgr7qRUQ

sub problem headers ^2HF8LSSz

sub problem connectors ^Y4aNwi3K

Subproblem ^UIgIzry1

Some title ^vRLQR6Jf

Subproblem ^nnpBDQUb

Subproblem ^ffp5HxzM

Pattern Match ^5NeV2XOF

Logic gates ^qLfTvZU3

Git workflow init ^UrggisfH

Git workflow end ^lEV3bZZr

Multi-tree concurrent implementation ^BmrEFdW0

Use a flag to identify this workflow ^xUzfQf91

Make sure the builder wnat to delete to tree by I/0 operations ^QiZPpNIP

spawn: Interaacting with CLI without creating a system shell, doing it directly in the binaries ^ty4DUOCT

readline interface: to capture data form cli stdout and format it ^mT4ZmEbq

fs static class: interaction with the hard drive ^erK9SaHV

Execution of the workflow inti scipt ^TeRuCk8j

From where does this script run  ^I24GEO8J

It runs from the main tree, when init the workflow, or so to say. with the main tree as reference too ^J6i2coAD

But also will run from the worktree itself when deleting ^Py18Ht4l

Add guardriles for deleting main that should eve happen within the script scope ^FQyK3hmu

Pseudo Code ^GBppVdqY

Handling the folder creation ^biDE9YpK

running from main branch  ^EzuQoVD1

does it ever run from another branch? ^CvoYvy5F

Probably it should run  from the main branch for the edge case where anot prefix folder is there, since thefore it wooul be neccesary for the script to add other folders  ^ctocDV7o

Then in the other folders for the specific case you should be at the worktree folder or main to create another worktree ^DnnCNsYG

This means that to find the absoulute path of th eprefix folder i can use main worktree position to guide me  ^nuUGt9um

If doing so from the other work tree the prefix folder does not exist it should mv the main and the other worktrees to the prefix folder. ^hc0CIM6x

How to receive flags and which grouping of script files ^sWkEcflo

New worktree, symlink and vsinstance ^y8Rwtnyc

New worktree without symlink update ^jUpc9N8K

New worktree, no symlink and vsinstance ^sEKo6j1T

Merge and editor back to main ^eJaw0fA4

Merge and editor back to main ^47KBhQcX

just delete the tree (do it manually)! ^uCkzPME5

Define the command ^sMd5Fqjl

Flags and grouping ^mhUDEnhq

spawn ^H7TgmdJL

collapse ^SZJQ0xoh

Creating trees and folder organization ^ImpGNLQ8

--symlink --code ^1OyNPUKV

Merge and deletition ^tzIYLAtf

-sc ^ivtNQA4p

spawn ^FpfQmG7M

req025 ^fu9ntARh

spawn ^xrhEuOYK

req025 ^t76T8O52

 --code ^g7SlcxHK

-c ^CRkZN7rB

spawn ^wEfc5VQl

req025 ^HiQCmvFi

New worktree symlink update ^WbFoNZSG

--symlink  ^um6khC79

-s ^Z5f5cXls

--symlink --code ^HZTeluMz

spawn ^pbTfBEAE

req025 ^snzX4Cvq

MICRO ADR ^Z7H1M9lD

Handle the addtion of prefix and customn symlink pathor ask to manually edit it ^y1oXyO8M

Do it automatically ^HSfbzT8o

workflow closure ^owq0WXsR

Set the script ready to run ^aYq1toKa

Handle errors using apromise based approach that runs spawn and .on( to handle errors. So that you dont delete until the rebase was successful  ^TlfBZjeA

What to test ^rqlBUvkP

The 4 variant commands output ^FWyYcRZI

the method that cause ^UZ7GRrVK

the content of the config file ^Ynhzp4D2

The proper set up of the folder ^ojEywxgI

Not need to use a hard dummy but intstead a temp creations of a basic folder ^wLnuzsJs

Add key rules for brach deletition so. that it doesn`t causes conflicts for example when crearting again a specificn tree, the previously tree with the same name must be deleted properly ^egZCvava

## Element Links
YHFXA8YE: [[Projects/Traceability_System/docs/requirements/TSO-REQ-023_Analytical_Breakdown.md#Git work tree workflow 1 init pseudo code]]

%%
## Drawing
```compressed-json
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
```
%%