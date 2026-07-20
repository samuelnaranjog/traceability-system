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
N4KAkARALgngDgUwgLgAQQQDwMYEMA2AlgCYBOuA7hADTgQBuCpAzoQPYB2KqATLZMzYBXUtiRoIACyhQ4zZAHoFAc0JRJQgEYA6bGwC2CgF7N6hbEcK4OCtptbErHALRY8RMpWdx8Q1TdIEfARcZgRmBShcZQUebR4ABm0AZho6IIR9BA4oZm4AbXAwUDBSiBJuBnoABQBpAFUAUQB2ADZCHgAtIQAhTEaARQB1CiEASQB5NNLIWERKwOwojmVg

6bLMbgBGVoBWJJ4ADgAWVuTk1oBOZN2tw8P+MphuI+TtZsOt5MTm463dtrNR6QCgkdQvQ6teI8XbJa5nfaHG67YFSBCEZTSbg3VHWVbiVAJVHMKCkNgAawQAGE2Pg2KRKgBiLYIFks9aQTS4bDk5RkoQcYg0ukMiSMhDNABmu0lko5EElhHw+AAyrA1hJsGTmMxnJJcFBsJJ5SSyZShmDjWg+EUBKSKQg1TANehBB55fzMRxwnk0ETbRA2HBuWpn

mgtgl/TMIHzhHAxsRfah8gBdVGS8hZBPcDhCZWowiCrCVXBbY4e4SC7067glaNzAnJW0AX2JCAQxG2fwSl0hCVarVRjBY7C4aEulxt0eHrE4ADlOGJtjCy5dYa0p2VCMwACIZKAd7iSghhVGaSvERrBLI5JOFGbFW1lBuVA+YKAcrediT0ABKABkBl/VoACk5SfVsnzraMKgkTAXHqXYACskP/DgJkkfAAEFfzgHdsCGJCsLGT9ZngAkIFwUgySo

CDgUfB9IFg9AelIapNBgVoRn0aoKCMMYAFl6nqABNBAJgSRpSOgciS2othaIfZtbTTAMhDgYgDUPcMPmSHZDl2Xtey2VEiA4ckczzfBTLYHltNQY98FPAN9WYAAVLAoH/QsLLQRywiKSDSmg8pv3QP9AOAsD5RfCQ3w/VFNh045jm0BIARuZp+y+WEUQDMNeHud5Pm+BJfn+QFUVBYhwXHQ5tFaZoJ1OQ5mrLftUUkdFMQ/a08ujPEXSjMpTQdYV

6SZNlWSQM9uV5flBXG0V0FJaxmGDQIcnlRVlSdF0pG5DRAhNe1zUtbgkn6kbTsddUKLdCpUU9SRqyTYbICDENYG2SNUVjdSEzvVTowzXAszC3N8wDQtiGLCRS0OCsBWIV7LKh6MwnsrYtiy7HLjuIcmFnMdUDXQcAxnUcFw4Jc0FxnGeDLAtd33ez/IQM8LyvTJslyApgbKdTNIPMKcaRfTDNaz4bLssL2dReLKhVAwEFQKA1DWJ7KA898lZVtWN

ZmgNJU4KAVUIIwCUSdNTYAMTBpUCqu2ZPKwohlBJiAxByJh5WHdX3DdjFPf0EhiE1gM9ByXBCyYbMfxqBoWnaLpen6YZRkmeV6QxQsCB13r0GVrIDagCOBqEKA2F/cILYJUkhA5gMzIQAAJbqsXDeJnYO9zPO88yjxPJvozM3zUEh/BAseELmIgIZsEaHpOknSV9AEhT9EkVuVTzPY4Bi2SJEWZZ8XlJLUGcZpmmK5oASRftjk+GFUQKr5jl2bR/

j0hJknKgEBxVXOtaSE0JYTwhuAkJEuwe5dQxJ3VArR3qURWENYkN0lqTWmuyWaPJ/qLVpBNMUEppSym2kqVUd1KhajYDqPUBojQnTNAgC0NUrS8HQcwva91aSPQDM9VGfpUSfWwKGH6yD/rxkTPzdMmYEDxwnlZAsRYL6US2J0JGVYfS1ifDJeYaAmwzCCiNdsosEjHF+AZNcxxCYjk4D9RmtjibU1prwdK+MPgwKBNDFmwQRZDyciPMo55kbcxv

HzNA94ZjQWfEfFanlpJzw8r+IQVJySHCQhACCKlURCy0qLXSuxTitHFjwZIpkfJo2ss3WylI5bD06qEAuA9x7s2nkUWeYUIDJNSekzJCs4nQASYlbgzhWipROE/X+Fw4Rwifq/bYkCv6wgjH/P4ADybRmqrVXgSCUhwhOH/WBHdC77FxKggkyDRqUkwWKKaOCAxcjwQtIUhDlrQHIBwdaVFebkN2lQiQ+ojQiCNhjG6rCdmXU4Q6bhlQHqdiesIL

02ihEBhEWI8Mv0AySMBjI42ciFGT2UbDVRuAeCaJRiixR6MTH2SuFsCc5xfhONHD9PSLL5yLgJDjCc8IGXMz3H4tmDTHlc2vLzIGuSNL5O2IU4ppTyk1NlgE5y9YEkSEaJgBA2BK6jlQGwSUasuqoAoPSckko6QUAADocELOrVAzBRFwASvw7W6r0Cau1bqzg+rDXqFVqa0g5rLWoDtYQB1TqXUg1NubS2LxkEmxyPbUO+AnYK1du7T23sDwMlsQ

HAgQcPaVFDsQcOoKyhRyiLHUgCj56L2Xqvdem9t673wPvbOpBc4cHzu6iAnqdXqx9Qao1AazUWoUqGnI4bHWEGdfKXAldq61zjWgBuQTIAt3bvAwuWxu6NL7u+FpKr10QDHlU9pwVoZdJ4MwLICAjADDYMoZwyhIQcFqLsQg+xGgAH1D76PQCfQa5bIAX12JCVKzQywfDaNcW4Dx8qLOaG8M4Rx9j/2vkAthEIoQ8BhLMhEUDkSdROdwJB5yz6or

Bcw256BmTYJAxAJ580Ly0YgOKKUMo5TpgobCzU2pdT6kNMaaFZ1sPWlE7dZ0PD3SIr8C9KlyD0XfUxRI/kUjJX4rBvIiGSjoYqJLEcClgjUAxL0Y2FsbYsbZWvmVHGHKSYRmZRTImVMuWyruN2G4myty+IQP4vyIrowhMFGEiVBQoJPjIgBoZut6JMS6QpAAjgkIYAANZgv4slKRyWpaVAXUBi3WUiLKelFWj0qWgIlSq6nHv3c0yrDlh4XoYl+S

oyXUsZaywMmLisRloEMjwG+hwypFK2ENo5Pc35wl3V8NDZV1mYYDNs9hOwki/17BB34SDrgIejHAnqLwe7AYupJtj9GprymY/g15IpXyfO+ZtKNZQdqUOk5UIFR1GPXJYcAwk2ge4/b466XhCL+FIoUzWKjZRlNvyxdGHF0jIkC0gKDcGVTiVw3QGSgA4sZql1WMamO4PcNcf8viXAc9sMsm5ICU05TTAkzRGbHEuHfe4ArWb1MCZzUJ4rbx4ujH

kgrRX/gld/l8GWtXAs84DIrCQgbg0TuwHSZgIKPRut1grsdIaVe0PVzbHIsarYJrtg7VN3Ae7xULVm3mvs83mALZm4tYdy4VtNjHb0Nbr23vbA+p9L630fq/ZJP9wjO3+B7Vr9Aivx0UFQHrtXx1cSLprqwFdatSCNwqd6Ldh2u4vxck0/ujX5bN0a5PFrnTKiEBArUHgKpmhJZgEYUkttnBJeqHOASFBbZGH6XLwZQGLnn0twkHYAP7hFNOHBgm

iHwzJGOCh74BkFsVUalhnZRxcP4YgYiYjLlSNoHIwGE70O7Q0beVgy7uCWPI3OyQrjfy3v7RoXQoTjDJMQvYbTiAQOAUg6ybg7yYmZKbBiiIqaFbw5lCI6aYgwEq6Y0pMQGbww8C1D45Q6ma6KxSoCGKlDGICDE7hglSwg9jsouZ2KOb9jIL04cAuIEhL5lR4a7CF4wR+YFZl7BZio8wC6RKRaMTmavjDJRahQlgiRJZbBVy1C4DZZGK5ZC75ZYx

yofCNRwiU7l6DxVZ6ajy1LCqy77bF6Hql7Nb4EzxXpiESFSEyE9YUR9YBhgYJAwhpT4znA8AfyL5L4LIL6tCzYr7oaLYb7LZ/Y8BXDxAMqfCfD/BlIpQkbbpHYUZoIBg/bnb3KMbXYvJsarRfIbS/I8b/LvaAqHQG5JHgp/ZQolFcIAF/6g5IzIqYFgFfRw5qZxi4rI6yLaaEraFbgoHY48BTByZaKYGE60phSTifBL54bqHTiub2Lhhi4Ob0EvD

YxwjjJII9zbiCr+Z6GqrBLcHhJwGCyKEFLQIWKQjIYThS7bEnry5Fz+YjoRqdrOqoCBC4DEAwBqxsDPECga4UAFxKx3H+oPGzpQDPEhBvEfFfFcCG5mx1zxrQnJqOyW7prvg27UJ265oUH5rYTO4SAlplryiVqe5xxdK1716N7N6t6kDt6d7d69794dpdpR6FwQAqgAnGqOqPEgkvHglVyQnzqp7Lr1xZ4nqbpH6FZ7pF4HpeTGH6FlBnpaHKhV7

mESDYQABq/4rQYgJgIECQ1QAk5IPQFAO4IEygPQFkNhCw2qp8buoG2IE4UIdwJwXwVwNw/K8+hWrpKQhk42ay6+3iWywRoCzBBGkC0CxycRx+yCZ+hIZ2V+dyDGV2c0N2D+nGZCeRL+FEb+gmDCImFRDo3+LwkmwO1RQB0YAiimwi4BGKUBzRAMSOyYKOCoCBGO+mJKhmqpGBSYZmOBeBYABBf+RBqAH8a4IRkY5WZQtB1OHUFBzi7m1oC2Q2DK5

wnOQq3OOxnIex4WfBD4MS0WthwhAhc8YwbhOOjQEwhwIEsh+B8hhxwsSh0C1ihwiQ42Oe48wxG6uha5J6rkDWmhTWgSSpMEXSx5xwp555l5FpcUB5Gw3AxwkYcQZw42DK38ZwUxTwiyuwUINw+MZSGGgRAZ4mvAyG+ybOT5UGT8S+d8sR+eqAZyp+I+5+f+GCcZdGqRiZzyrGLFHya0ORW06ZxZn2xR1G+ZZRAORZVR8KtRkOb0lZjR4if06mrRD

Z7R6OCp1SMEPRlEqQAxlKQxXRhB9kxwjMPY/YjiM5rKcxsICxc5hWPAvYMIiQPhK5WxX5vOoW/OESyleWd5xx2FRST54+v+dIyqMu65sWzJtsZI+gJqXUgQqAxAbA4QRq24QJzqNqWeHA6AWsvxvakVBgMVTAqsCVSV6gKVHJwJkJWVxsMasJ858J5uaacuGawcaJPsGJ0xpAWJqJuJrujGhJ1ataapGpWpzAOpepBpRpJpZpDJke+AfxEgeV0VF

AsVRViVzAyV615VTxGVVVFcVcaetVme2eGhbcYpu6rBZQP5Jef5nBcpFeVkgFbWP4zgOwEwkomArcSWmg/4PQPQcAaWvErctQtsB8kFgGVpJ2/WhWewcQ5x4ycF4+RlH8Xh/2SC+GOw+MT8syZSm+P+QZu+My++MC1FCCOI9FlGMZeZNyXFF2007Fd+BCd2xCqZ3GxsvGVRWZ9CwmTCIlhFv+/+BRgBfCZZEOoBslEBTRClLR9ZqYKlOmLZGlbZ8

MyQeOOlJm3ZcSvZ/ZmMosLBJlI2dFHVxMP0ku5lDOriiQnwAI4GlwyCGxXOdWoqfOPBnlUSl6AhOB4ViSXSO4fITev49QAwV5fZN5kAwu955iUChwWUlwZwr5Ctcpn5jtBhUpR6oVCAj1CWlQvtpA/tgd/6+5cW9hsqpwAOPpqhVwMIk4KNn8aNKy9KWN1wv+K23AvYDUTUlwLUbUcFPmkAB2CCF1kA0ZVyzFTNrFCZt+yZXFWRj2uRbN+R+0gly

eVNv2hF5RwllIxZklcmdRMlaKVZkBEYtZGmguL2zZalmOpKyQHZatBO+lA5WM0d4y+Mjhv+k544TU1ljO8apwmF/Y4GzlHBQWuxzt+xp9YdRxsqI2cF9wMdcdNWVxyJzJxcqs6sZcjG5AOV0eLJ+saDNpCoNVGe1s1VSaDVSJTVKJOJ6A2a9umJju2JLVPVpa+D/VXuta9AL1rQb1H1X1P1f1ANFAQNINM1ecc1vaKDpc+DC6+1gp3Aa6Oep1EZ4

pg9vcv5rSwDG691ipphHSyp6A+glwIEO4hwgjnQxAuwP6+Axw9Qbktsts2A9AhwoNg+MWw+Z8UNV8bwT5ahFi8ND8v+BUL1jM2gv9sdSNyQz81dQRhFLBlw2gk4i+VwJSsdFw/pl1YpT5ITyGS+GU0Gd8x2DFlNG91I09D2vFz2nISZGRNNj+aZ89GZcKNRX+f2JkK9W9TTwBu9p2+9clqmUtdZBxqO591K6l3RSt2O5Yt9mBGtAGWtVmostt4G/

YkCVO4YQ2aTdOMxdBNlMIRlPhH8NiPimxQDspG5oDW5yY/BD4ghUFRdh5XStsQwO8EwFAOAwdykMwjZ4dxxkdSIi+zOQVWjozH5IV/5YVV1RhN1JhfZZhQFlQjzzzrz2ABdQhdzMFBicT42HwjMZxKUFirT0YgTR98TdlbhZwHwa+hzBFOyyQ5iaU4RFwRl98424ZNFfwITCRlysZY97GkYfLCQ9NU9PLM95Tz+AlRRy9xTBZfoYlbTElHTItIBF

ZPTEt8l2KilMtjZaO8tF9rZWOlEuwnZCdBloszBd81wEYqzpMi+X9ri4RZUyzONRzDt6dbll4HlgzEA3zUDekQ2frETvdp6SdrrFDzJOOagqAbkgQqs0jBgBorK2V816A4bIJUb7YqAsb+g8b9i0Jxu2IgbiaUACJFudMSD3V1D6JfsTAXVVDEAeJLDHuA1XSBjRjJjrcZjFjVjNjdjDjTjIj3aYj2DKbkb0bGbi6Wbg6UJp+Ap6eQpx1FWueZ1y

y9W116jpzp6QLmdohEgmgcA/4kgyQSEygVImAqpqpaWCAtQEwzgtsVIhEQwKLx8ENI+UNYuqUyx4yRSkxsdgbBUjByyA4cysd4GS21LP+jhITtw4RfwZYCIJNhctLnL3TxTmRZTPyfFjyVTnFPL4olw2qCArNIM7NgtXsAmXNn+K90rhW4lJH29nT0lyHMOB9kt6r0tnr2rnRSB5QmluAzQqtwBgxXZ2BmtlmSRg5CNdlZOe2E5WzZGhktrTOERq

Gv+9tq5ydID7lLtd4Vz9Ygydh9zlQHAHAcAPQO4Aw9Qmg7z9Eu5276A8EzgiEKEaEGE2EuE+EhExE0kntVENE7zodXrkDOk0DUdcD45mjf575QboLt1fdhh0pULAFOj7tT16ARnJnZnFnj78SaLtp4Y4ybwtLzOq+a4v8JSKNOTAHqFrOew0dGzEALdaAJwaUqFDK/YyGT50sh+SjxDA0hTI9l+OH/LkYgr1TwraHT2YrVRS932pRa9srxT7TpZZ

Q5Z9R4t1ZR9/TJ9bRWmqlIzl9JYzQN9AnulSYkXOt2wndkIOMvwb9sn1ogCZt2z39jXTU18rOndgDiDTtmnYD23ChPlUDvz0dPY8DOh0XGjXtEgu8u7ZImg14PxSbLJWgcAsP8Pubh1Ow9VKajVaqlDjDFbbVVbnV9D5bdbvVBJjbbDXSu7+7h7x7p757l717t797/bTJSsyPqPmQ/JMjs7cjwpCjeeCC51sCcXadYLIpm7SXrWWdEgAwPAYwlwR

gIE/4zQcARghw9QzQmgkg1QOOmgmgaWQdYNEAbj+DF8dwtwDUNtjUetJSL57p/7/wgHndwHtXuN8acQH8eMTpsHZN+2YpiH5NiRKHpTPF6HFTTGWH9+NTeHYghHL2xHr+ZHH+uZUrLTNH+0dHirXTjFsOarCOGr7HwzkXMM+ruAndRraAMzFmRi8zF3ExfwJSt3lB3AUGYXDAWzix1oWLPYbhNrzranIbXB5zvBlzO5Ihnt+n1zc8socAuwrcmAR

gAkVnOnKXEArE7EnE3EvE/EQkok4kkkXngyPnCkfnnzUqAPQXQPcDVLd1EX99wV0uEvK7kLa7AU0v1eEgc/C/S/K/Jv0/XLoVhfraADIo5KDJOGZz/ByuNwSrkBxq6gcygDXVAE12Wb4xbaqhDrgS3SbdcoyfXblkQjoxDcBWk9UboQO4rZEI+k3EjtNx5piZIU83a6JUVo4KtluotZVtGHz59NWOAzcBk2Q6KIFgW3HcZpRF7BV89uYnLGOcCfh

QYnyVrb4C31nLPdUAMGcxNEXWLsEvuI/H7hc1lreUZU1/WEEiHxbfBLirlUNhzxh52A0erqLBsg057WDue6PDPJjxIZFsyGA2MtrWxobtUZOxPQOLW3rZ9VKexJSoPL0V7K9Ve6vTXtr11769DexvNFBHlEaI9oeKPRwfoB55Lo+eq6AXidSF47oJSKdNRup3C5vkHqn/PRhAAGCXA1QCQZwHOHJA44jAKoCgHpBxxsAeAcAVoCqDchZdTez7dxs

XTy7XAv4UCCxBcC+BQJQe6FYglCCxqL5Ma0DLFh73nJe8oOvYGDqcH944CaKQfXrhTX65jQw+lAibqQOw7kDcO+HBPqjiT6ZkU+OZOgavR2TYCL8MKeVkt0gArc96nA5jgXxgJF8+BHHQQft3hiXB+OirQTjomuY9lROROeyLcDe5GVLWj3MjHZQU4k53urURICp00HmDtB7rLThFgn4e09O0FOFhIHqBjBlAYwIwKQBgBbBz+pQL5oF0KwUsYGw

PMJvHV1Zg9n+MXVRqu2PRbs54VImkXSIZH9DABEAC3nfDiC0tGYc2AyONge6EsLuu6BYazjLDLChsqwlAalDQGtdMBRwV4WiFwFIdGKyRGmsQJG4XD3kIrKgfxSm4SsZuzCKjuvSYHvCWBnw03uwNW4qt1u0BSALASBEl976ZfUlJcCO6QiTuxrB+gUgRCaiB+RtCyrwDhAYi8uldMYj2E+74iNOhI37l5X+4GC2RBtCJv8y+Ad8n+Wg58OIwcFw

8nBtg1IXWJsHRojcGPAtmbmx7kNceUAUnj4KJ41t8eZPZhsEOjhNswhtQqAPUMaHNDWh7Qzod0N6Fs9B29gqwfWMyEp5eeh1eRvkKXYqMIW8Xd/pLwf7aMYWujCkegGSBiRDgQgW2LIBxzBgdwQwVUjAB4BGAEgO4ckCQJcYUQggRAOQIxgvhGUUgd8D4ClAnAwIcYd/SAE7E/ix1IiUyAEAthiLRMt8BkUARE2MhXA74iFeDmRmgkoJDhBAu0eN

znrBZo+jNS4YvmSC4A4K1ArPqwLeH0D2EBEgWgxO9HfDGOH0P4dwML5scQxAg2MeGJLBYRxBNfF4HCJGJt9vStLW4DQTu6FYUogbWgt3zcSzIyx0nJiHiNKFMZNyY/N2jL1iS9ZyR6/KAJ0FwBpY5wEwfQHjmyQX99BIudkVHVODXxA28pCQbyOrGxdU6MpD/meOS6y8Vo5kyydZIhFGTC6kfC3kcHeDDlBsdlE4CwRRpZQUgPdUimVGQxNQO+yA

7GHEDZzNQIJ2MWQZpNNF7CCmREleudllBVSbhUfDijHzG7h8zh9TcVsCklYejmJF0L+JnxkzC02BSrTAiaK4E1lNuSlPQfAUEk8ixm5fHoOILO6DlGYd8f4PZStYGQO+KkmyuNl5TdgsoOYnSSFnzG6CWRV/EsUDxcltAzBOkm4hADTxRADwCPXtDdK0jbRCGVsYqYW2LY48axePItJqErYO4AhQ4oIRTzHFU9KgV4hADeLvFwAHxuAJ8S+LfEfi

vxy4xHo9Lumbjsh24vIQu0UY0URer/Q8TpPcmV5KhF4iAMcCSyXBMszQOcAbzYD1BlAjQLYG5DGADBGgIEC9v0L/Gzowgo+AxMNlajpRUKsdMqBuCmzYhaWAOIjAoI/hHATguotDBhKlgY0cJ5BAPko3GTmiim7Ukpg1NOFkTgkFE27FRKXy0TvxRHBej1LBzp9CKrEm6It16lfDfRPwpjr02Gk8CtuhYs+hNI8lTTSUPQKMX1KhHV9hOAGHgJJJ

NZspSoPYD4Fax2A7DNmlBVSVi1KzjIVGqnFyntL0mu01+e5VFhU3X4iRyQ/4X8PoE6C7BLOdk5kZf2LFix0oZYwyDd25E+yQWfIiHgePF5tISZBcouSXLLmWcAB5I6UT9ChC5QykxlVYjcGKkFQPCoAkbPjBYITDHSPcbKU/BCZDZO6HdaBiUmKn90EOZUkPtrMqnVSap6RW0fdkan6zbhFsj7M6KeFuiupcrL0Q7J9H9Skwg0niW7L4m8C/uXs3

bqXx45UhZp99c7mgAoo7APgkIWOelDq7rTlBcknEcuUH4Zzh+eYsLPpKOk1yKWSzX4E/HREINcxLsbBnuD0D6A4AtCDBprmZLEKDAZCnmc4NelY9ESng0Nn2L+l0MAZP0/RuT1RCsNQhEgcmZTN/DUzaZ9MxmczNZnszGMOcWaoj2oWkLyFWQg6hnh3HYyCh2wIoZdTF6+Tjx5Q08cYi/6AYQIuAOcCBAmBQA3iIEJCDxA4BGA4AQgcYKQEAUm8u

ZAE3mbgXqhFcTKA4XxktLFkDY9gaUT4CoSPoDhew8s9CUiCVnYTMKqs3YQgg1nB8uWFUk4bPQw7kS6plE95IyGommz6Jlsu+X9ltnMD2Jz8ziXnw/kbd3Zo0rVqGK47CT4YVIAOY7ORjq0Q5VscOXGO2AAgyc4+D7qiOIKILkx5tblMZSyhYDdpKCs5joP0k5ybm2XfOYFIgC1AqQlwdgMwFVKXAmRYADBY5PFgw09IwPJuZFyrEEKBRb/IUV3MW

XLLVltCDZZKMHkXwIlNOE4HZmfiQL3S3SyDkvnpSOEsov8XUchQBwWIcKDcvYKLLwkGJ95SS0Pjh2PknzDZqHC+WksT7XzCirUl0bzQYEmi2J+Snegx3DBrdD6gYmMICJ/lDNvZ/8kQbDKAVccQFtlJljAmWn9LbKiAhOUoLtZFINwS0pykgpOZhV9paC12jsvvJ6R9ldwHafgsum9pGgxAZQKrATC8xCAkoZ4Im2lWyr5VsMKdMqueltiiGb0zs

UwtopeChx/Y/6U7kBncLI4IQ73AsCMUmKzFFiqxdUBsV2KHFTipIYyRXGVAZVcq1AAqq1Uqrp2W45RVjPv44zheGi7ySUMmUbsTxU8S5bZ0oggQ4A7EWoJoEaCHAEAQgIwDuAmBGAccSWW2PoH0AiROZyobmYBJeA3xMxMIZnHpCmHxyIABUDutbxYJqFIiLBOrsgMK7xMyC42cxCwUrqst4lBE4esRPPl6zkVlTDJUbKyU5K6Jjop+VbO1lUcil

nokpcuuaW58tZ3E12ZUq/keyxpv8nVs3OEHl8dwkzY7q0phFxIw5dfSQWFCRCd0GU4K5lS+oImwKLa0cv+N4rQpaTjmXk3SaP2zkkib1xknLuv12BzgEAqpHgGlgmC2wtlwqn5kYLgrfLAWcai6TGvbnaLhRXSKDTBrg0Ib7lOXIeY1xF4+kUo42FKHWpRrjE0oQ2J8vFIOWmDUJ4HXdG1ybrjYBZr6tWaVM1lHDqasK4+TaPqnkD7RTU82Q0zRV

fYClc3bFXbI+GlKnZ2wQlSxwPXVK5anHIQfUuxzGMaVQgulbbW+DArsYscgNumPcWtQP4kYE0enL5UnoBVHrPgd60MERM0NFwIKsGxf4WCJA1QA0DmkyoCRHhqq7Bv5pkBMAgtIWtwXmxASMKS2Rqlhd4LYUdVBxnC4cfiR4XWra0uAZNamvTWZrs1ua/NYWuLWlrw8nqxHuFsC2oBgt3NdGUornbHjw1hQ/cVooS5hUiZFQ/yTL0TXgZWoKoUgD

+lIBpY3InQHgI4skDHBW4koJLAgGqBlr/xdC4Ye4veBHAewq4NcIiORrulsYmTRCrS1s13xf4XawMp/EiVYS2cMSk0bvPwkCbx1cUUiVOtqkM1Z1TIedWbJRXSaham6piq6MKXdTGmHElTeUr3XErgxZK/gX/LDE8cdwYU5pUHKwJgb2l96+EWFEaj9gnyDKD9QpKgnyTE5Nla4Ba1dITKfNBIwVdp1A26dwNCyxNQkAmDKBlAcAVuEzKQ3Vzdlo

qzUY4T+BHLH+3m/kTho60Z0E1c8enYzuZ2s6B5pGi3npDW2OFGotXJqChNVFzE2caUX+PcFpYMpYQRlXUROHeDYVikMCCbMrriV7z7tyS4TdVNE2ZKJ1qSyPq9hamybmm8mwHRIGz59Tt178sHcfU007cT1lK89U0pfmI65pWMTzAyjsrOYhljmTzJZvAURN+wsdOrvZsA1OaiRkO1zSWM50v03CJok5VKuwbmxSFRAbVaFuQaEAS9SqwNa2JhJ6

r4tn0whb2OS2E8zVDDdLUDKy0gy+F6AfrbUKG0jaxtE2qkFNpm1zaFtFWmReI0r0+Bq9ii2RrkPnZhq1FBeUXj5KF2869FsLdfvZ0c6oR0ImEHCHhAIhEQSIJvU/lQFfaZT4gbOc4OlGxjUE/1Ta7EG4WKhzY18ACU7YRQjD1R0oI2AyPcDKTfBzpXXGivrujorIID+wMzYkq4l/bjhOHNiucLE0kSkVDuu4TfPRVyat8bun7VJTFr+iiVvuzVlp

pBF6tSUjQYPS8hMxh7RYP+iIgoKtY+Ee4n6xsHpDvjUTipqe05enoLFHqIGx0sWKKqsRSw3JQLLDWTrKBkK7UlOmYAZLADvRSgCQJ8CjjADyHFDYAVnA1CfqGQ/4x2mBCofojyGXqUCNKEswAPeNgDvdUoFoZKRtBdD18fYAYYfCqHjDP+sw//v61AGhs1hsAOAY4PiqYE4+LYCof84kgqIUAHoDDELDKBoR0YDIOEnYaJwmgbQDoN0D6CDARg4w

foron0BsBYY7WUgJoDUCfgFQhALVMQGqBsA7UxIh8EkHe57BTKrOVqFBM0mlBZs5FNDJ0YMhQZdgoR1HWUGyDEAojgoGI3EcGMeVa0NPA9kexPZnsL2V7G9neyQgPt6IdbfIxRHpDFH85ZRio1UZqPbk6jITCCdQSMGRgrgOTeLM4CSB3Bzgdx+4w8bvWfMOl4RzqlhHkjLUwSsYoY+8ZohdRXi3x/AOeAoD2QVFifCo6yWUAFizuUQTqmMGYAqh

EAoiAgN8cFDwnET2qKwPgFjGC6jxeGyoJvw4hcQKAPEPiIJGEhiQJIUkc/R8bcU8o3gUeu/VB0f0o0TNb+0qHhS/0vDDIITaOmUi5Wjy/4EK0mHEwgMHL8mwRi3TCsuFIHMOM6xFZOvQOor0AtAl3Tgcfkbr8DHAl2aq14kAj+JkO4EUJJ462wqDF4Gg8Avmm/w9mjMABsyt+BP7WD2IEbMhg2xcHtJMa3g4dPZ0iqJYRkPpQu10VCCC9Ma6QzMo

fDqH4syhlw0YaiwaHbDOh64I4fSh9GYzT4eQ0tN5N1qBTNwXCvFgTP2Gkz+h1M/ZIjNRZMzMg/k7adzNCmos/hyAxKexj9Gq5JRCIyMccArBxjkABI7zCSN1AUjKcdI+nCyNZw1jeRgoxIC2MlG1jioPY9Ua2iHGZg9R+0vsA3DNGPE8ycs1/G6MAhnlu5ks8yI6VDH2zYx4Odcx7M5Ba04QpXirzV4a8teOvPXgbyN6lHxzmxoo9Od0SzmOw+xh

c+PyOPvdVzdckbEnr2AbNSg1xr+H8weMwXvgzZnrXaAiO/GFI/xsg/EcFDIXPjAJyad2aBMKRQToa24RCYQBQmLmMJiI+iaRNYnUTxASi5iZRM4WzlBM9OviYkA45kgs2oNGwEuArLCAlcY4L+BgBuR9Sc4f8P0JbhuKImQK6IrS1v3tQAmoyWEM4R8JXa8YUCNnOEtmwDg1zZUODEiGFN4Dyp0prJbKfSWvaFT9uvJUDufk/YqO/NRTUuq1MDS1

N/woMaSs9nkroddSnjmJamZCdkdEkgYxHLmJnAkmiNK1iERNFOnwwlFVnPfrtoenJDUyg6egp9M/MYG0ggFpvuDP86IeYZkDXIbjNRnDD6ZqLMaK/jaW3CulyeWFyUPwXGyrxyI9Ec7OMXjzzV2I4xcauYXULNF7q18cYtkLU0ygWYklaYsdzoW+iqoY0EIBUh6AZgJCNiZN5m9K1C+MsIEqfKx0JwZFBS2gCCZxMzgEGbxiUiuCOFdRLptedcFZ

wBtzDwp6+PVEairgLgmwopFCrgOWirdVUm3W9se1oGrL7uxifAY6kSYNTuK+jiZm926nP5+p7+R5ah0B6YdVK//leqpTiSDELxwcuKuZzjJV8EVixJZqMoWsjBpO/kV6dSsOSI6HI2/tlYkMC72teJkXV0mYDHBTFMAXYKqWwBlI0sjeOAFSFtg7gtgmgZIIxm860nX2yTeJrgpnwzZwr7pNurLKg4DhJkZSE0dlOjrxBEKkEsXDdzq63aDEX8JG

vYbGzkUDaUpw+VaKG5fWLLorRdYvVvlqmWJuBkssptflwGhp+66G4epqUUqEb5fASGaZaV31aVGN7SwZH63KTcdY8+PVBhULXB9hvmADTwazmess9tcymyDwIldauOIZ0a/ldkOlBIzcZkq2WcYjir1bekTWyByMrgWwAbwGnL4xgR/Bjb6Ueq+gjbPtWaLJ5lq6eq6sfGerrVjC73f6srRO0kNAMEEGBOAbvzxASE9CeAWwmoAdF5E9if7u0WET

VFhi6etxM6S8jjAASCQF/O5ALQ6gQVRcp60GKIA1QToGMAfGSAKA7q6nRFLpOLDZ5ndKq3/B7Cx0UazgUYb8HQxQDLaTUZeS0zgpQW4QdlFKOcF0M7yxS7LUdfgMt0ymJ6cp8yykutvNSlNv22y8EUdse6t1+K6joQfU0e2/d40ryzpp45zgDN9fccH8FtN3BFBKYqio9yTl4ZqujhFEWwQTuZzgNyd1kanZC7p2abEPK6RTvunYNRH9C/Ng3rb7

Gr0twQSUJH39gk9a2VcZxtGF4U2rGL0ilIdKuc0NaF9R1ZrSvvFLQDJS0a0a5nfjVn2prWEAxocEaBjBL9P4vOU/at5BHf7pwdeUw5V28BnCETfyqVxSaxKQQwRHwu8C2ux0qr0RAibrdwKvWLRo9RBzfmQdCtxNT2pU99qduYPZu6phbhg6ctvyXLeptywadhtGnGLumyiDkejEWmg7WMRlcbsHVWsY5zDmyvKO/iebibEPUm0KrSuA807XIyVT

GqumwwSFtC1WKhaJhiPmSozmheQtQCTOWAOquvQwrcEfSScsjz2PI8UfVtlHQ41R8DKrSgytHyQgdoj1mfyKwgCzsElM/0c5DDHgvPcWvvMf8jLHrF9ADwFbi2xDg/4FUCqCMAkbIpGFXdO44OYbhXufitkVCARAVRMKiQQWfLMnAA4trLy1whLmFONqx1CDky0g7MupPUDipv63gftuFkQb1l37WUoIe/CfdI0kg/7u02gjscEwf26HstMIjewq

GGrrHNcEx7VJ+wVnB/G2xdP12PT3h4IacmwNBHQz0a1dLVyaBUA6Q9cdc9eK3PGxvaOVwq657RVFneQSR3FrWceCUBmzyoNs4HF7P0tBzrvUc572RdtHZz9V1oE1cZDlXsMJZ3c8xlL7wuLW9RW1vX1Hjsr7ziACJGODGLQQyQdAlLqBcL4WCoAsnB/GSZIJPC7pP1qA6Gycr/97ysDhCFyls4rgyevFm0A76xOJVBwg+UxJ1lJO6ayB23T9cJc2

3Qb1s3J9rPtkUuQdVLnUwGOIPF9vb3lqlRMEWvI29KdT9HQCHWbhFY51wfG0Unxi4thX/KpOy5r4cSvORCSzyactleOvFX14G1FHG9BLB6QurtV9gw1dbvMgCeTgHu6rhuuYth1I4NI8a7GuVSBHHZ/4PNUWugwhzokpo9PV2v2e7uzd1q/PdGcrSB7+ffc9eexxjHeMsx4KJjVvOGblQZoBwE0D+bNAygaws49uZRuPSbj/wpyq8eQvfgKQV3rj

Ewo8oDI8s0umoVtoyXvHZu7EPE53WA2K3OL5J3i7IEEvLL9b8l9gZ/w4OAblLiG529pfduyHjLyiBPsHenc2XosJ9a1DDvcucdBO5QeAoCqtQWnnDl1qNdFeLvxXwXSV4M7XeF6Zn2qOZ1c4v2HuyylCyoBc/GcZsPjlnl7C9IhD3ujXSWocaa7b2k9LXVq7vd+9tenO/36AWz/M4s9gePXRjp5/jPGvrt4P1j0mUln/CSg3I9AToPUG0qYf5lbi

tcA1EgFhXRsMdFGrbV3R3w0NEw5+szgBUAg0oHdGELCCgxkFoHSjTF/A+MvX4q3KTjj3brQdSaW3vH0l3k8ct4rwbRTqGyU5hv8G4bDL8gyWESE1PA7hmjG/BXoft8IrDD4ZcuEnA+Ff4eCzT0P208LvM9S7vZXsCutRMjPwz3tP+CfTmBUA6Hg8I56+HWeJA131QNgDu9aRHvBDXVas9r3rPmFPY0np5/YVvvPYPn9R9lrQsw5AvXql7zd/e/3f

wg4XkNZ69jXevV90X7RQG4Q9xQYAxwHcPUAmBUg+hkbp+28Hsq/A2gkYUCVAiK9QYGoZSFo8hgq9ZSWmQ2VKHm5xZ0e+6gfRj4JpY/teHk7Hs+bW64/oOhvlHbB2S/+vA6XbBKwh65ZJWlPJv5T09ZU9wADAWXMYzqxjdiYnbFysczc7y42m6HBspOOd45sO+w2U7ukHYAOGd74VE64PddrK+DAUAOAaAMYG1VwDch1YKwE1GoEkCoAqQ/4MYAH/

UDCAQSWoEIH7+UAZsHUMAEkGe+YBdR8w8Vec3H4jaOAT4qaSdPcWKPdpO0SP8vXCjd8e+/V3v33zEfD9B+Q/Yf0EBH8rgJ4Xisf+P8wET8HhoqKfv8dQHT/V+s/hAHP+8ULD5+84Rfr74W1i2FRXPVuZqnI+fdmuOFYPj91a6/fTfOBMPxHt8nd+e/K/Swavw39r+h+a/kf5vzH+r+4AE/Sfrv6n+sh9//fA/of3n8BIF+qIhAYv0Goxko/IvSja

D8UNg8WOUvPF7r8+gG5DHAnQPoCNAmgEliAuT9qlBs4x2qcDU+SEnVxw4dlOrZwU7Boyy5uZ1q1Dt0GNHcCd0KyL/ixOLXkZZm2iBri4Gy8pqg4Oi4vpqYkuwNoN4MBYNlShCeRBiJ4CSYnjN7wwAwAO7zeQ7ot72QROk/DeKMCrjoAglmtpZySDKE/rcG3DtMq9O5Nr5R2+z9NRJCOLvr2jckLcJOg5ox4GICronxHgDOoIKPFQGgl/ibCkA0VC

rjTo5iqf7WAxAA5D0gE7KGiR8mDIjzaBscLoFMA+gQgCGBCeLgAmBcVMLAWBzgQnhEADqHYFN+DgU4FWBBoK4HLOU/ne4GuXYgD5fSzeh54L+Xnio4r+vnta7+e99L+6w+4NK8Q6BdqD4HcgfgRCTGBUAKYEhBsQdYERBJIAlTRBgoA0HxBn5ntRf+TWo86/+kamNZY+GhEGaBuTALUC1CuAK3DB6U/A8qLI5PmRS+MyAWMoo0P+lCC20jdjjDYB

IBlm7H47LOaz2GvGvR6QqptuW4pEVAdOooOusmL69e+TowEcI0vsS6sBzlgr7FOSvhN5e23AYrTl8AwG4HmmC3tQ5siaGEvh/MhvuIHKedrLIL7A8LnIGJWJNlb6TeNvid7gYDcvnq5WmgdgySgm1LdK3eKuKEDyA3geQD7+PqIf73E+oKQCOBZAIQCMA0zpUAYhkQfGzveOITqBoA5QQSGTsNfiSFUQ5IZ2hUhertP4pBhqrP7fSWzlkEg+7esv

5qO7uH57r+0PpVq9otIeEYBw4QbiHMh3voSGZUxIYCSkhXIZSGMYsbI1r88qPqKR9Bvri84Q8cXpNaky9QKQCM624JKCtwsAR4yrIksl8CyCVdmMo7WQ5IkANQIsldabS18CrbBEZSKAJXW5Yo1DwSTXqVJrajUH8DYimFAczHBzHqcFse1ARcFpOv1tx4y+Nljk58e9wVk4FOqms8FjerwZ7akGxplSrdYUnrGJ0qqcuTg0aUCsVLRWhWGRSQgz

Bhb5usojkd56eoquhgrEXms75hUV0sOyx4IaIWCdBy3M97JsEbMOEToo4Q7rOeBiBxoDgyGJbTmIttIsyuedXNbi1swPqlrmu4oZ+7jiJzrKFDsU4TrgzhtqJHx6hBjmCZeuUHsuwwe5ynB5ABFoevz4AlBskCaAnQJ0C+Cuclh50mI2KAJQIRSL0YAs53rMKehSQD0YIKfoVBjyy0UhGDxuJwOMTuEGLp/BY25ULGGfscDuQEnBNNKZYph+Lt15

0B1wRL6NuOYcwENunuvg7sBRDuN4lh9LlD7IEVKiqBUOD6rBQbyMslFYSBLBl3wbSrOMhgRMsgW2HfcKVkoFFiHOjsD74hXBoEDhvaEOFnh8eEMbUhbFqeFBoceKgBKRvIbLr9gqhCuFxW64fyEJam4XP7ChCjov6g+r4LkEQ+UoYxGBgm/nJGqRSuIpGCgyPj0G7ifQaY7/+j4YAFxqgbj0D6ApAI0C2wxAEMCfav4Vl5Q0/JvEw66cFETpgqKj

AVAK6yLjBj3AnGnjZsaLwN8ANQ4EjCCtQO2PJ7CmhtGUBYubXvGTJh5wYRGi+PXl9p9etwfZbFKlEXg4jehYe7Z0RJDserShTEeXwk+lYTr5YwP7LQ6TgXEa3xzEw0eyom4kYEUjv2Gglw6emcIcho+skkSETK2T+tnb8iV0gJB5g6sM4Ckg6bFHA6o1ELzA2oM+h5TZsU7FZ52ClQJtH4A20btGqw+0SIBPYoaCXou0Z0YkG3upuKQypBiWoD7b

hIobuFL+lkRKGQAGjp1F2Rx4cyTXRt0aOwPRh0TkDPRPgK9GTsrkYTKQeUXg+HMWPkcME4+6AAMCEAnQNUBwAc4GMCSeD9i44eM+wPEy36KUNQTUSVwCjSNQ0Lhti1yYYelHbBqYghQ5RNvD2AFRoBggjc+hEmW6JheEWcEvalUcPbph9AY1HMedlvx6y+XuqN6tRxYe1GeW8Nr27dRWvrU5CBYUFXQbgsdjxEjRbiI6a8RKniyxrg22DNFaesIT

w66emCnsosET6sSprRwjr2jBalIA6imBL/kIBKgrrjaju+8QbySwwQqBCR3RNqBxB+qCgAkD6oiAOQCTsX3u4GuxuAO7FJ4qDMaiaA3sfgCuuJqN2ggkgcazAhxo7OHFjAkcdHFMAZ0RP7zhbiDP6Pu6ADuF+CaWvuGr+h4T+72R2DG7GqwKcfn4ZxWcf7G5xnxEHFbEBcemxFxJcUGBlxccSjFPhi7MaHPOAARB6+ROMRABIQMAJKBDAnQHOAJA

VIDwD1ACAF+LHAPQFhBJYygEIpsA4lrHBuKLkjfqTEi+P8CwgRwKgFkY6EjAxDRvrOaxAOfNKlAfw4COcCbWkIGZR8aA9A6TgYiQCsRMs0GAmHvWlbkL4ERXXlVHERNUTcGS+fNHLHO2CsS1Hg67lir61K5DlSr1AYkm0qBW0vMFbACQRr2BIhscuHZgh3KP8D/0bhDzq8qaevNF9OQXN2FVWr9NTbSu/Irna1G+dkVaF2aZsXYPgr+l/HqSv8Vy

pXGIRMsgBUoCSuAWILdq2adUndh1anqbVqMZd25Fm8aD22FiokD2fxkPaRcg1jADDWJMLTZ+up9i+GLKmAPUBGAkoAMCSg+MA6ErasTMpZR6EYAqJP6iUVJZs4IRFYi8oE4FyZ40bwNT6LSpwBRRHIwpj1zFRrXhQFQJaRAiq0BkmggmkRK6lL4URPHsN5sBisRgnK+7wWrE4J5fJrF/BbEZigqE3pDqLMqPKsb6mxayCcDrywkeTrOanYXbGsJk

Bj3DOxaIcyT1A5ng5D4A0QBCQkAiqsqobUJqApHKR6AF0kxsPSX0m8kAyQGrDJ04U4616U/jy5OeX0QKE1xp6P9H1xe4UDEHhxzi3EQxlQBMnx+FqNMmfEsyerBDJpVOtQLJk8Q87uRuMv0Fb2U8djHABiymwDVAzMjjjMAzQAMCYA24MQCdADMj0CSgc4P0DlamXmj4XxjUCEwE2ckoLJ3GSUr/CBKDcnGELkgbKrbvAYuKhS7M7Bk/qxOdwFin

gYOKVNE8oECYk6seHXsL4oGREYklXymTrg4yxqSc26IJOfNRFZJXblwF5J4nrgCrGvUUjpkx1oOjb2QKxNHR/w+lsyohElmhcD36lUAwmJ2NsU0kSRMNNbRz4gZrGLtJYVNwmLmahnwmMQ0ZqWaFWJdh4rYpYDqSmf05ZianEpZqUvg8o8iWCht2aicomRcqiR2bOpc9khZaJtkT8ZepsYoYnGJOks8kS8gbqCk9AKoMwCgQbAKzI44O4PoCqkpA

MeBGAnQL+CUOJvBmCmImDNl43w9pC2FNQPhDlIehxkECr+JkVk+obguouti2aBlurrj45KQNyXC1otW7fWEsXW5SxmBs7pIJDAoDgOWLAWykEG1LpDZKxEOmU7YJPKWlisRaOmRhEYGOsE6d8hsWtImxriBvLipq3vKkKBokWK7NJqgTAg/qHCRd6jWOqCSAGAO4OYFdmzHhMDOoo4P5bXMkgPAjuw0gL7CTKkoeEY5A1QIEA6g6uE+neSEwJXAS

WX6YGC/pscG6LxYgYJemcA16TCK3pRnKeao08WAIB5GbAKVRd27otcymgIQPoB/p/2M7DxGoQDBkYAoQOJCVw5sN6CkQiFp1Rdm6joEEGh66DCKBBj6TurnmuGV3Zo+VEMHREJ6FmFC7kFaFRmL6NGfWB0Zy0BoaDGTGcoksZDIFFgh0jEB8xyEQVhADap/5rwn6pxVgIlGpRxnyyvCShjWkhGLhv5wo8PoCCiesrAPoB5gWkG+n6Zx0LxmY+Quo

G6XAa8ceS9gL6JICtASWJgCaAv4BmCVGpAK0D9C6aR2CZpr7NjAhMG4DNgWIIHOVBFe+MADj2+7mltrLEFaVpnVp6mXWkIGDaRbZNpVtvAn0pTukJQpJNsigmtucvkx5u22SW8GlhFTjxwQpAgdJ7DurdAzC9gvwAunzp8eqIG9g6UOlD1JqCo0nW+x3qKoDgACLOmWOMkSeiHpVcPoAnpUQGek/YF6RPFnmN6Xenbo9GTFzPpywFABmZH6RZlJW

miswA/pZcOfH/pkfi3DAZIhEGAzZAqZBmFgtqMhkNQcGX/gIZSGcokoZ1GOhmYZj2cJmsAzGSEBhAO2cRkgYDqeRmzZAhMYHUZcGbMACZXEoxnvZomS3CsZEmQQQcZFGdxkHwlmRJmg5MceDk4ZkOSa6xwMOYxCSZOWPjlEJcmfOYFWimXUbKZhqaTlLmCWXGZaZ9qVIbvpKcYZmV6JmQeBrZKccDkYxMXn5IWJialSC50/4I0C/gFACBCqkPEP+

A8ASEDwCSgVRjwDT2PmdGyeAiyeiyFY/wM4RR6b3D4T5pyweYipQgkbuYbgG1nhjxZliD4SuSjKulJrg1aVtYNqjUMzitZtabAYJO9aVkqNpnXiL4tpVwUkm22WBrcFrqm9KylUR/aR24cBVSnS6kO3KTwHY4GiH5ZVh80hjQDqtZjHrdifguNHbAMNGAK9gHfPIFzRiqd1ldh26X2D564hpwkQ8I2cemnpAOeW7TZV6RRlSA82T1CLZGjMtnWAq

2Qzmfpm2d+mAZJGftld5zwuwgaGoGadlcZ0AFBmXZD2ddkSZt2WwCIZUGePnYZTAs9l7ZWGTdmfZeGZ9mEZMJCRk3ZjVgjkgxPGfcm45qOfRlCZ3ZiJlY53oDjlSZK+S5GV5lGUjkH5uOdABg55+BDl4Z0OeJm450mTJnf5CFkTkyGPCbqlKZ/CRTmAFRxm4RbauUQzC6GMwjMCQW73P/S3GkINAZHIRdqplU5Juddx7AhkBbnz5kFtbm0sqTHbk

gW2mSAXqGMUldxm52BdfCW5UWHgXGQBBbbnxStmnTmQAemetlI+kOkZks582m3kbZN4QMHWZi8VYqkAc4M0BCASECLm4Au8YcA/oRgDACHAkoI0DOAEFJCm+ZiuXSY9gXpIkxPk8NLZq/sU5Luh+MSZhNhAG8WfAV7AiBdjYTEBlsllCaqWfyyW2CSZfJlGypgdA+5naQ7a5hjKZS4NEg6SVn0R4eWDHq+GHlVmx5hlDsB/AiwgbHG0oCvHqyyZS

PLpZ5MId05MJygYtHSBndDAWxqQZkNk8KQgEeljZFeWdlV5YGV8i15t6ZiD3pOaKULN5r6bwUEgS2Z3m7Z3eR3kAZzRX3no5g+TXm35swKPkwZSQL4bwZ0+fdmdS8+RfiL5LRa9mn5mORIDr532efHb589rvlew++TeG0ZaOS/kY5b+djkf5V+ZPlKRPRXvn35axfxkbFDGVsXMZ7+Wxl45P+TcX9k8mQZIF2+qagWU5mmeYXwYAbGEm04dVipmv

FChscYYCHxYdbWFwBYeYU5cmfUVM5xmb0ms59RRzleRmMZ3JvJiaiJBfOaWFhCHAIkNSaQpmQJoAdgmkPWJuKzgBYg3wMGACDHa22IW7LBuMF/AJMjRglKksuogjTCmEYGcDxAi+OMIBG5vo7lMekCS7lpZbuTSlwJdKS4WZOqph4UFhaSZmEFZaCQOnCe/KbQat0MYQ2ER263k9zghu2FlCGQgbAiF6QndBYjwFHWW1Fh5nWRnqw27khAD5A+QG

+lsASEFaQRAUbJUG4AxRkQCwAP6CqAd+mQAoAJU2ABECBASWN7GBA+xAoBuQKoNey/ggwNcZlIP6FhADsMAFiQ/orECEDkgCVO77aA+gMQCMg8kUGiZ46bAsmFYk6BGwASQgAlTnusMCmApg8oJqknoqvpFxBp/Io6gEABIAZIaZJBdsp5FBReNkyEleXWyeZQYBBmCwX2fYAkATgHuDHgW0UmCNFYsS8h1aRoFSDWA9AKEA1FFUTOU5kJ9sjkCE

p8kKV0Yn1iBlblgoBemuyJ+JuX0grrrOWSA65Q/lcEZIUwBHyNwrsQ3lpAIeWQ2A+TtDZA2mKqTbghAISUsWBOb/nq+FcovEgQKcHoBYQO4I4nRgF8HCB3w8TNfA+GUwrHQmib8JfGjuUGAqIKijviE42yauhcAQYAbMZqTufMYXBwUthQL5igrudSk1uHudVFZZTou4VkRsFPln5hoOn4WcphpqOmR5lEMiwx5fUaLC/0hkGMSNZMRbwBFIzWWT

A3A3wJbH7e1sYoGbpHOoZD+Uz5H2GtyHSZUBjAXJAKDrUGYPlSAkWbCP53Rvfp8aZUs4fcQLJvfvSAOonxFXA2ozALgAwA2gOyG6VnuLmUxs61IECSghVIzgfEp8SX4SA6lZCRaVUVPcR6VmVAZUFUxlReGmVCkeZWkAllRCS2V9lY5XGoIVS5UZsblQRyeVYgN5XvRLgh2JrJCWoKEZB8/mZHZB+zlZGSh+QWDFFBiPP5UZUgVTpXJVzlWFVGVh

ZbnHGoZlfqixVggPFV2VDlRqGNV+laOyhAoJB5WbQWVVXA+Vn/vqFTx6Psoyzx3kfPGvJPOXPDVADIocCtwUAMcD8B4UuTEraByHEDgYekDByyWaxMsFTRxUGcC2aSFPpBMl5wGMIzIsGMQHDqhcJElD00SbhGDcApZRXNpFAp7m0VNAnbYSlsRV4UCebbr4XylGmiaWqxQRTxwFZrLjVmgK8NIW5pizKr6yWaiQIBbZMdmskUiuqReJEiqClbgq

BUuRb5osQ0QU5CfEoIMqCVU2ldFSAkiuHdGuBYQPgCGoLVQPGx+YyRvzk13VVTX4ANNUFX01ZqIzVqAzNazVdQmVOzVjGvISsmo4BqgVUbJdcQnINxuyU3H7JAXockSAPQNzWU1FCPzUNVo6EGjC1uQEEBi12QPFT7gUtVNXXhhFmj53hJoXPFmhz4dvqLKtsAMAwAtQMkCSAxmRBXK5+1ZPhHVyxCDztZu2jEoXVh2jlLYwKokgKFKttO8DguEC

idZzIwpiRU8l/PudgUVMCe7m/VNFaKXZZbUuW6rqTFRkl+icpSHmQ1onhHmfBpKBgy/Bggf8FJmg6t7xWsT8NEVuYygoBz3AqFCno4187rnnwhPWYTUBUDvPunrRvaFhClod3kICchnaMEBaVFlZLX++KVeoDxBKfsICZxGkYwALOgQYgDqhgfoWA2ogJFtQgkjqGPGc149Y4HKAU9WSEz1SVJYHm1fiNX5L1QmA6iSAa9Y4EIAm9fqBwAO9TX76

V7JFqAVUJ9fMDS1eVe4LfRhVUD5bJStTslxQ5VSDGQ+sYtVVj1E9ZfXT1SoLfXz1FtYvVNVz9avV5g79Z/Xb1ZtYf5/1HcQA1PEQDbqEzsh1PPGzVf/ltmmhsXk7Xni6/GMAwACQDABjAIkK0A9AmqJIDoeuAH7Y/UkoLbDYlgqegBqF/mXtVbaITGQRlQQSi1BnVxFH2Ba6KZn2AESyApWkO5ACYXBaNJoiVExJ/JQ4XpZThc9qO6dFR2kMVTAS

ynJJTUdqa7qrFZwHsVPbvkmkoNUtQZFJk6daA/wqFNo0p5KYvjDo1q4Vjo3xRpUBqyVtsfJWPkSlXulO+KlWFRl5hRRNk9lU2aUUDlfdPXkPpy0FOVRwL6a3nmZDRU3lNFmGVOUHZQGWUQgZJ2d0XFFz4H0VXZgxVPkz5/RYwKoZu0WDAvZLTRcWiZcxURkLFk+TvmHFKxccWEW6xcfkg5+GTMW1xOxdcVw5gxjfk1NiOfCWP5UQGcUn5EzdsUX5

uxX+XXkf5fcXE5edqAVLm5OS2aCJVOUlk056mSwUQlBTVCXcFbOe3n8F9ZRNbO1iamljGKIkNjBDAgQKQBGAaWK3CHAm0e6VIQcAEjbiNTZBmmUAkljI2xRhXG0CISBEshUwVjLDkyxRz6gEmdS5zTo0YtVaanUPaRAl9WZ125dnWZZudRY05ZBdcynlutUY8HOyDjRDXEOUNVN62R6vrEY8V3drr62avrBKlJ5dMK3Ube4YJOApQabvZhrpOeRE

1KpBNdE3E1QwRqmohCTfkWjZXZZNk3Q1eeBnlFmTdUX/puTStn3NG2VOWuQO2SU1FNbRYdkVNx2Wk0I5I+RdnNNDTbejDFs+aMWLFLxBhlL5Uxes0fZBGfMVb5/TUsWDNQORuXLNz+ecVvZGzSEBbNQVvDl+tqxSM2nFYzSjnutUOdM2w5UWF/l3FqIA8WlWQBc8W/FhzZpmYtamcwU6Z4JWwWM5fAlwUwlPBQU1LNUag7WJcyJXPBVwCQLUDOAH

ABwyK82AFeK2VVIOYAqg+ADAFLWgwubyjIf8HEzj47BsdbU+p1iHUbgk+L8rNQrwFHVYVW+BBze80HNjDbCz1diCGWQsXyW0pzhfuU/VVwvHxEupHLQjZk9WkDXtuVLQHl2NJdcHm0RysYy21lPtqShp8gctr7FFcynMzFJ1rCEQCVGlvabTkVSXazsOcFMiFhNOnjqk2c0wRBqLKOOH9RwAqpMQBJYpapXLtlaRSwngImFGhWrRxeSPVtydNuYk

vNc8PB3f1SHSh0+1QAs4Ar48QL/DgIYqZ/pnVMKUszryr9kiCLt9XC0yRgGEpHoQOJwPsERJ27dCqGNTIBnUrlWdRJrOF5jQDX0VuWV2lF1NLa7YVK/hSrFMtZYeXyEAE6VJLH4IRA17QV8gkb7+N/LbwARgkEoV6itB3n3ULRmHXCDYdm0iTU9ilQNUBhAJZZ8Q0gBRr5XoAznVmqll7nYxiT+7YtXHue6WqaqihpPJ3p5Ba/l0iNtzba23OA7b

Z224A3bdgC9t/bR6pT6YWi52+dGxncn8FRoY8n21C1Y7ULx9bV0jNAygGlhCQ2AK0CaALQr+CEALeP+A/oaWOSADAAkD+FzKAwksCj2kFaMg/s2UREzs4SCA6xIVXSjO0Y1D1mx2pM8siu0bCvvBu0YuQnW9YUpe7c9oHtD+HHwEcJ7ZzSp8/XvL5SlDwX2n2NoGTS6h5FdTDVUqhAPDoh6H7aja4Ewqejp4YzOBwbGxhsbKLx6Isn8ySBFnTJUb

pABdB1kisHYmqdAzQCzoCQlwPgDgVaHdZ3Z6WHS6Q7a6qYxbVlVmfTaldlQCD1g9EPeBWk+HjC4S5e3jEVyVW+heGDYdtHS5LY6C7ei3jgI8gJWMwIRKEmTIgnaRXp1BLeJ1EtknWY0YGMmuS1Mpc3N2kNR6SYp0sV9LcaXndzLTxyEAhSXXU/tOUHnpwUptDy1Dk5iJZoJM3YBsEQdeNbeTNJWHQCwaecTYBobRYwFSC/gEwKgBgVFYRdGI8AkE

b0m9ZvTuAW9qySs5p5QXb9EmqKWtsmAxTDJlqRdzcRADldlXfUDVdtXSqD1djXc12td7XcjKuxNvab3m9uXTbX5dEaoV2IlxXUtXEdXSE+puQO4DwDkgAkD+gIAuwKQCSAxAG5BJYPQF8A7gGXmC3LW/4YYWhZITRODxSTHXEATdEAkZTsd78cu3rCPvFsJwcRFWPjM9pjZHzrdsfNcLbdDwhe1WNV7cx7UtR3Xe10tZdQy1i96naSgD4oRT2Wwi

smXSovqYsBTh8tJMFBiUJqecfjk45wIcga9fdbMowdtOnPDFGO4I0CXAIkHADoE0PcwnZ6HhLpalcsTS3KAaTzXW3LV1PIQD39j/c/2UdZGkbFRZgrVESoYmFEx03wrfRT0d9AKqXRIIMGCkxnEjpMnVLdTuSllGNfLI4WXBOddJ3e5ljXJ395LTTP03tL8turg1i/aL1cpF3eXzmkCpTJ4eY6UodWghwldhQq9OCtRoI98dlbEpFVnW/1CGH/U1

AnaDnekGVArcA4FmQcfoCQmwmcUwA7uLfgmxHuzJDIOCgcg/cSKDWcdH5vRIDS73pBrCq3phdgQparWRlVRn1wgWfTn159BfUX0l9ZfRX1V9MoRl0aDsg9X4KDtIHoOqDObFbX3OeXWjEzxKPajEldAA5UDkgv4JgD0AihYQAUAAkEMDMAHANUDy8z6PQBJYP6IhoDt3XS+wra0GPVDXA5iEhRqETfSHV3VKhJJxTdq7tHV80s3T33rtffVi10w2

A7yUrdwpfu3xJOHAgCbdNUsQP3CZ7eRxvtFLd/oKdc/bS0ndjjWd0MD4vVSpNC+CQFZo2W/br7Ysa2LcDNOx5UZ3ql3KJ44Y6/oRf3itCmYZLhRXtCBlzwzAEMDkgjQNgDjobOhh3v97hE/DWI3/VFzxN35IR2/laPe7qXD1w7cM49+QxRTbmiQM+pkEiKeUMeKf8VtILtGjS0yRZyesYIWIf7QcE8+6sq0Np15tsY2ClVFcS0il/Q+2k89WDnz1

jDgecd3FZbFSOkuNPKeSBS91WdrGYiSIew7N13LVsOqSNmiZrSRP3UIOHD/dV2GL4OuvJ4Z2crdcS9orcBOi8kiwOiCb1pycoDrUDgX7G3pRoHd7qY1fsOhH1NqG+XxxE4RACij8eOKP4cOoVMkyjGbG0HLU5gEH6SIKo4ahH1DkOg0VxP3s72GRjeuFQmD1RaVUd6FgxVVRdkQ9EOxD01gkNJDKQ2kPOAGQ1kNR92DDqMQkEowaPSjsoyaMKj5o

8qP++qo+Q0gkGo/H2GhwQwV3zVKfUw3hD6fd6pGAQgI+iqk/NmAMW8hKVA5GU1EvpFTyaeZ8C0l/JjPh5RdpuzHKiYwpT4Tg/wJqKdczQ0r2D9n1ZiPfVGWbiNc9KpoDVT9fuVJi9pJI/P2TDIvY+3L95WVSrbVCOh+2Kl93IgFjYsclKmtOyguazfwsIEkWzRlndyOzKc8N0Aq0hALUDNAv2ScMX6dw/jUqBl3CwRTCkg03oLAAoGPkOQUVDagp

VmgJ8iKjnNRlRfjtNagB/jAE0H45V3KKA3/eP0cYN/RJVWYNlVwMV7AINR4e4Mfj0Gf76gT4E9YCAT7rhni0NdtdmNc5OiueiLxs1mwAiQ9AKzbZDkKVKJAS6Aex1tZ1Y2uHUlSILBVnA3ykZAcd2Uovhra7fOlBPwI2G4TCmmw29U4RwsQOP4DJjYQMkteI9z351vPTsiTjs/TOMTDZI040UjHwb7IlgG4iwMI1TYbBhgObpIr2MwQlW3V2sy0f

qVkEBw390StT4zIJ/AKdfh2qVEgMVTrUEbB/VMAkJOqNBV1gDPnKDyHhBMAA/JzUeTrgRvU+TO1KBMBT/qLFX/jeE5IBhThg46PJ5TepA2ITAMRZGwNKE6DG2RSDdgwRTXk8OB610VHFOxUqAIlM0wyU3clET6MQiWkT2Pl8PUMVcNgA7gqpM0CTVYLQxNt8SQLZ3DkeTGjQd8b8PYZEpBuUiGsllHouEDg5kzv3JBvY/2r9j9hTJNYjP1Rz0ZOe

dRipA2Q5MSO3tGk8p3kjWCZSOcV1gFp3EJ2KdjD9ZEVvTG7jriJlLdKiInZMdhRwzZznjQgJePXjt45133jr/fcNCG2OmAIthb45DxedsPM6W5+EbHg3r1O1N+MGAB9QNWZU1U4qN31gJB2ByqO7gRkFUcVHFOauBHOUZOBSg6QDHR61PFMcwDqIWDjVXUJYGqwagH7HT5eYFVOqwe7mIC2V9IrEEjoNlSmMQkrxI4GBTsVboNEwu1OOGXRfmuDN

w8w/sfWv1+DZVRwzdNYjNVTEExzNoz6qgEFXOnxjjMcAiGXjOzmhM1nEpUZM737vZVMwRz0gtMyCSmoa9UzMTw2qKzNUQ7xKjP/1nJDzMT1/M3rNCzUEw6N/ehrhA0ITL7srW5TeyTa6FBrccyQ2lXIBLORT0M44GwzoE05Uj+yM0H6OzqsOjP3RWMxrMxsWsyCR6Zus4LOxVBsytRGzlM6nGmzcVKeFWzeJTbPYAds+zPJzqVH3EZsrs/FPuzLA

MLND01DYRPFddDU8kfDWMeRMtTEABePhsX0/0L3jYtjfAuSNXAhETCHOLtpFcDY4yxXAzY8VLZSDUJlCOGayEsxXTi3QDhjyB1ldxwUaGMtN4Dw3LJNphraSREkDBI9mGMVINfLH4OtAw+3Dpx0zpNdRpKN1Pvt16uI1PGv+XSrM4SzJMIWTI1jLVzpx/SrlLSmoqzjPTXWTyNbpz49vjFSg2SXnrsGbac1KGxzeh1oLYAC9Rrz5JRwa/2I2NvNR

YEsm2ohEETAfOOEBkFc2NWSiWekXmC9l0iNAhY8WOljY5jl2TmH5jsZT2B9gAX/Fg3TAglIi+CJMqWewFGYNQfA92EMo7XLcDwW/ZK6kwZZmPQu1o+7u1OdTH82UBvmhRtsalG3C8Tm8L/Uy8rqe5rEgihKTrPqkpAhiwgHalbXLIut2miXonaJLqbokoWQ9pRCi2Y9nhYgmpyn/3c5+Yy97M2CQPgC7AuAPQDmcMcBQDkgHAGzaSApADwB0TYLW

PN7Vd1YcifA4+DrnSLywakuQcahKEp5RGKX9hFI8TIQs7ACEQ/AXAGLrvPREgi/sCRgnjh3wGNH1StOnza08ONSdo424WkDIwypN7T1Aw/McpWky/OV1uk/DAoTHjdMwEJQqcsP1O4GGLjB1ivbBF3TjYGoK1qbMQIPSVXI/ZN55cC5Wa0OLw8j0BgqC2gXoLoJZgtHLYAIUutZkdaUsMF8WG8AsEVS9Ah8sdS9Qvz2tCyvZvL3dvPZ9Wji/fQ+p

Di10iJL8Rp4u/9vc0iURDEgDuBGcVIHODMAIkNd3X9klslL5cyzJMIvWHoeKq7oTKFtp1qk8s3TBESlssSmd4+GR7OTwpiNjHzTIHCoED5839WktMnZ0vKTnhQd15hxdQdOnd5dTMMr9ckOdOdKazHGFzIFHpKm20UgWoKxh0C2aWwLEkSVxJ6ETCDNXSbkOLXP+xqG7N5zc9cTM5A7JFRaKgDIVjMwAwgC/Vv1TMzagBx7VULWjsec51VgTnuAf

VGBLfpnNuzDNdGyc1Cq2bWkN+qM3Oqrys5quYm2q2rOqweq0IAGrMs5XMmrBteSCM1FqxZVL1tqzH72rzc46vtgns3lxGDGU37PmRYoSrU+9atSHMa16AC6sRV9xCqs+DQs3XPrQPq9iG6r+q9HPWzoayMmG15q8WuxVUa01UxrWkMaMOrZq4msEThTbmPdzyfU1MytalIG5pYIkCqAgQGJYkCjz7i7107BWFFVZPwZYHtpQLu2vjAca8vS6buEy

4bqL8TTmLcB7r9y5MLVpL6uw66QyGGHaZuUSZJO7tYoFStnznHkQPtL4pROM9LPhf0vTDzja/NnqpKPHG11A5XMo/z2tBjaYS0CqtLyCR/ZZMEgoshuA8x0IceO/dL05Ku+mJXPT2NqSC65Nap+zQAVPFdRi8W5tNdu+yjY/wLfF4Yh6zTnHrC0iViTykIJCAvLjqW6kd27dp1ZfLvqSvbfLAK9OsTGE9t4ugrzzSw2LKuYPUA44UAJcBCA+kz1M

zBdMDjApAjMC4T8udSbtqk47dMiKY0agjUNLt4HHEBiwjKAjQxhVlP30vBDS1JOXCt6y0tD9J7U+tkDt88yveFYNW+scrH60MtvzJYD8EB20vV404epndpavdwlVItSBHiFyrY1cGxssIbMPQDMlc6nuWnILskdgwKrKVFkBrQRqAHGfEioIKAIzMbPYBr1lcKrDBg6gL6hGoNqAgA5zBMxavhoeAJlT5FCAL+POVCa9lu0IagHqjWVKwN7GwwYE

6rDOrt6etTxbXyIlsNzKW44GAkzpYIB5gWWwq4GgQfsOi5bhW+5XFbja6GgBB5W1c4pVNWwq51bbIbySX1Aya1ttz33k73JraU2kGprmQVlMe9OUytBwNqEzZGINoc5UCxbnWyEDdby9b1sww9xINuZbB4KNu5bE20H5Tb+M5gAtzc22VuoAFW1asj+y27Qr1bPqOtvNbqsCXB1TXc8ROhDLyf3PgrKptgCbxgkK0CbA/wzOsimcTI4a9Gcm01Cj

dxBHgHRhMm+1B7MMI3UOabHwNpu1LlvEW5nULk5es7t7QzuUiad66t2bTZLUpOEj3S3fOoJfS+glHTuSYwOkoQgDyt0qOhUfSRF8gsTSLLmIu5oOUUlcgonjmy4htPjtwGSxMwUW8KPYMYwIagJU1ft1VxzXUDagdrOZYzX+oNqEVt/bFqxFNZzBW/8kkgUc9LPr1+gPQCczHAClUxBgJPzP0z9a+2CkzVlcai276o42vaAnNQbv3+cfibsC1yq/

GtmoqVYCS27/2w7vazWANuAgkUM27uOBHu8FXOVvuwnuVTNW8Hv3Eqe3nOR7qU97PgNCtVA1zpAc2dt5TaEwckYTflYbsZ+cVabuqwFu+SDJ7oe9Nt27s2+nsgkmey7s57hq/nvxzmVEXs97ie4HslUIe9luD7Lc1XsBDNDfDsNTDDbW2dazDQFJ06VICJBDY1QK3AqFCSxxtACRASSzipVwJhTYiCLWqJxM07s6R2+KULPPsxsuuAq1qOInlEpM

Nhbi3YulKxzumbckyOOuFFm10tMrNjdOP7TSneytL9nK0uPl89AAsPfzD3Qx5Y2movv3xECu8fiROavYFuCDuNcIP/TtvmuDKiIPHstCj6bZhs6p2G0ua4b8hp/uNQ3+5QubWMBT8XPG4JTQuMbOicMa8HGib2IsbfB2xtyQvnKiDj2+FtxtmJnwyjsQAWEBQC4AyytgA9AaXdX2DtK1myKFLG4H4yAO/iQ/ECtdLBcYmUSut8BZFK8vVCJMFPvs

wwIcgvpsqCaI3i28srPdOUSd6TuZvjjlm8DXWboNYVmPzivs/Oi7XSElgqg+oLgCB046TylK5q41/M7VSw4Tnb9FYrpCDKWw8uBjREG7BS5QBkPb7irfBlf2A9N/V0jyFQuVAAcAMAMix/Tj4z6w3AM81NODrp6vsuNTuGovHFHFAKUflHZY7KhEek3XWpGU+GMsFrhuXrFG6WExOYdcd9UHV5wYitkQGzpsTuJOCxwnY0snzYUa4fs97hxmFjjs

nZAdWb0B9LGvrwuwMtBHlQCEdhHER/KDq+WOwZN0jJ/fcvjEnAymJaizWT+p/2hB+svEH3I6FvJHwEYJFAd+veu69o0GvHg1b1ADZUwALreZDGjxADaj0A72S+lLgnnRACAnda+GvRsRs2CdjwkJ6gAwnhYHCf+dlcSAvvSPsxsmhd2Uxmte9DbJdsSACh0odUgKh2oduDOjtgxInwJwn7gnfezEHYnXyMsDwn6+9/69BWY4jt9zQ64vFCgQ2khA

yF+fVUa7AaWIcATAbAPQBUgxwMQCXH6h7kNDCOO0NjIpCAWzg8oAlayrP6ArVlH7Ah2qzFmHVOy8KryVh2RQ2HwCbdaOHgB+RUuHI/aAdtL4B54fbH3h7seC94w3AdTD9m9pMnqEADwD6AIEE+hpYOfecc8cmAJerr9n7Zv0JHg5HrGwc2uhFbEqjYfL1HIoi5yPvH6u/kc063tJUAIARihQAJAkoFhDlglR1r0c6rpJjQnWVB/2HvDMh8GmLxRZ

5QCln5Z50fWgaFV6REbElWVAjTDfDfDGn5xqYf09AKrLoCVrUJODoCk4CQEwO9p6VH4tg44S3YjG0x4dbHjKzsfXttjb0tB5C/U/OYJRxxIDBnoZxV0RnPKZgCIwbLeuPAC/EdRr6n79Lsj46YCzoXHaY7bkfempB8YIwg23iVByrrsUwC+qMQR2BqA9IGHFzQEJCFWc1AkIBeZz79Y4BXuVUxBe8kUF9XuO9sE77Nu9pg6SfhdHo/A2UnwXnzk/

o4pz+iSnbANKeyn8p4qfKnYY5DGwXmJyBeIXzGJBee46Yz/4CnnOYMGI9IzIG45AC4MoC7A1QEhBjAUQ46jMAAwP3gTAMSv0I19kUaViwVr3Lqf6HKNCAlBJn7HYad0ZhyvPAOlh02PwVX8XYe9jJbizuLHRm8sfUr96/JOPr7p5ueen25zAe7npI4dOHHZWR84hnYZ+eenTmAKJJstd3d+3ubdWeERV0EVp5EsjNlM93uatk9me91p41TpxHEUS

IRzwFiLUA9AkgAMDYA46ZWcCGzSTWewcwq/UfHK1B5xeCFA88lepX6V5Ef0TEm0RTjYPZ7cB9nyGCpfmIv+upfR0ml+UmtjE5xE7TnsgUbn2HzOxJOs7zuaJ1OnXQzSsPrbpxud87UB/Zd7HtmwcfvrAZ7WgnnHl8wNV1JYJgD32n8543adbIv8xR6KjI+dpu0qUuGMxKuw5rthMC58ffnZHlAg676G3rt0X1oXBcaRCF2BfIeyF58SoX6g1dH0X

wF29cJTn1yDvnRjvcskwTRJ8F2242FydtknXCiOJBz37hAB8XT6IJfCXol76USXSEFJdnAtF79fPXDFwDdIXPICxeFgbF/ydJ9JE1xf38afXxuJq/4GShYQQwM6BjAQgI0DsW49SwDegUADjgqn8V113Wkmh5qfk+1BdHZrgyl8m5xyJLDO6mnIRPkvf6lp3pdtAZYLYdznSjMZeDXpl9etLnq00ONmbGxx0vXz/2nlkC7MpULul1B5zkmuXQZ+5

dnna18MvY4mANj38pfl+gcgIITZhTYH3jekfGdvwI/DbesG0QcxXuZ3FcnDgAuvy9IRgHqSNAhrFlcBcvI7cC1nYEWUKytDZ4Kdgrfi+gAR3Ud4azY7yuYuQeKtvLaZkLElSpf6QUt3cAy3vEy0yEpgIJrqHaHwCyxiTC5yJ2Ony52z2rn6x22mKT20x0V2XlAzuf7H5twEeHnVtyte23kZ1Sr9Aku4OTmxgreTgGd+/apKksT3ZJUfnZNlUcsJT

LL+f3Xfx8Z6VASEAq331g8dbs5Ao7AAAUpZXTPe71gFPXKgMAAACUAAISc1B9y7vs1Jc6lUX35ySCRZsuYAQCpoT90mvQ0Ka86Mt6ro0hPuj8N6rU96EAPTc8AjN8zes37N2QDJD/mDze43EgK/cgk79/cSM1X95FO/3t9wA/P33a9W221W+zW1FduYzTf77c8DACqkWEIw9YQ6V0liNAMAD+jEAAwK3DYAMAEMBCAWEP3KQpsl/kOleDProdi3C

AU1c7rmp1HrtXWZ62MK3S8/pcq3dpxSut3OtyufrTnd5fMUQEB7Ze7TJt8xVFZzl4teDLtaCcc++ZxxefXdYy3+vxnv8xjZbevyqFkUJQC9sOt0plBET/xay6rvwbMC3meP2Zw4zaNAtQGwCtASEKzqx3upTUftcdR9xeFXqd8Veo9ch8wAhPYTxE89R4m9LqyoM7dsJ5SECl+xSPmLDI95Sox532rYWUZN0/AhbiwdN3aj9rfNLuty6ec9k1wyv

TXW5/3cOXg9/e3D3ltwxHHHoR5Y8DAlV+tfwwp7NPf2Qy0SwdXcqZ24+qSvt+QtEYa92JFVnIqjE8/HbkkVeOdEgMyedr5M1rOgnbJ5CfQnsJ9ycUKos+gC7PC+735azrJxiccnpz3hN4n9o3ts176yZDetU4DzhfmDUD1mswP9D0w/MP2AKw/sPnD9w+8P/D4I8b+ua4icIAQJ3s83PnxO35HPDzzidnPZNw8kU3ad6n3I7GdxvwqgIkGwATACA

D+idACQPQDHAcAOTL0ARgJIBYQzgG5AO9Jw8I847OMNof09MghI8CxBUDiwIUXKnoZyPctxae6XSj0rcGXqtzRTq3Cx8t3DX6j40+aPrSy09ilNl+0993OKt6fqTvp/OOBHVtxY/hHwzxPfl8NettfjLiw/d1TLZiPizTuNBWZOmTYV8oKr4RwDRrd1QWzmcIbAT7tUGcmD/UBwA2AJcBzghwC/1/l115A61Hvx8ndI9Wz9vtUPvi7TdzwSED69+

vAbxG5VX2TzpChEVY21AHKdHaXdq2s0y6GjnVd9/o138GJODqWhyALFzHzd0scjXbd6scd3ksTo/4jvOzfNqvPaXNd+HdmwgcOb5j4M/6vIz/beUQALteesDxBIhU90t02ZORbwHdyibz0woE3RXlviQcb37/d8epLmz4k/bPlz3C/InocRwCH+p/si9jwNqOHSc1Vzyid5lgfoe/onPkEDuKEQDwSdy1To1uFYXXzzDe4Xvz5YNejmtQS9EvJL2

S8UvVL0lg0vdLwy9Mv4MW3vbv8Lwvsn+Tfke+3vp76Q8Btt4RQ8CF/rgVfdachwbzEAFAPUCHAWEP+B149QPgD6A7xs0BjAbkJKCHAHXZ7QsvyuWy8c+HL21d6nkLmPK12I7ePijnVPYpIiv1h8re2n9h1K+GbWt84d1vzp+NdWXrT4beYqM1508dvNA12/0DPb8Ed9vVj6dP5qqB/Ff+Xu17bTiDd195spio5PHpCL/oS3XLPBzQD35nQT5UBDA

mgLbBsAc4J0AqgtksG8iDXxxML+JiC3h2732Gjxv/9eL7Z/2fjn85+dnbIszhrz3VyAnXwBh6mJSWLocV5cfAKrVd6lttPfohEZODdrzn9T6J8aP7d1o+NvXubo8qvrbwY8+H983udzjdAwuOIH6AHq9qfoz9jhGANI2EW60nwHrHmT8gqJO4HQ5LHbxSAd28dB3IW259fdHn6RT/nTJzu81bhzxieIfP1zs+Tfez3c8If972hey1+Vc+8mRnz7Q

zfPFqp++ejvvdh+4f+H4R8NAJH2R8UfVHx12FTzJOe+M18HxCezfXQdNVXl5DyENJPYQzQ+9ac8O5n/g4l5cB2MMlxodwBHiryiyCOEqcDLBtvGlAUUT5IdUdc5p6til04+HybFendDm/2HRURrcyvuA7W+5f9b/l8XzhX82893ssYY+srWr1V86v/T0geqImgPK8xHKNhMvmvCZ/1EHM12vccjWpumyoZHArSwSQhU5+Z//dk/AUcFn7ugJDmMt

sElgLWD46s++UfI6kw+EXn5hq672L/59xvjNuL+7Akv9L+53QAl8AAR/jjMha6SosT3Q0AEc1e4KcP069nWcQPx2ZFdvo312vKI2yzVvZl7j/0/+P4q/c79K9J87T9UeuryfZtz08vBVP4EWzD+rHT+MiI74ZP6/qGJAIc/JMOUvdfbiffqCRrx74/BbV18N/SC64EreILUb++MQr+M96Be7JCr/cUuWo2OVeBgJGX8OBD7+De17Hz79LQ30DZ71

w33vV+++9P3398A/k+oydUKxfx/e1/LkUh8vfifa1qU3G+hh9b66v8WhGArQK3AWIy8WMD4APAFYAJAmgBwCqknQPgCHA8K0PhA/r7ALJjCROiBxxhpv+AqfwFv7D+RK1vxlExWUIMj925vSpgGbtA2K78ifjIGJ2e/et13ebHbTyV9/fv7kB7vNch7iH8R7tT81fJpQ6fuShfLkz9tPsQlLaF8ADxgn8ScAZ8fbkZA7gMgDBflB1hflZ9Ers2xJ

APUB7+hwBJADAEongPVHyK4QM7N58f+tIdGGrG9aHoQDiAY0BSAfSdQ7tVdI9GhEyKH4lD+vQkfHPpB1sDD9cohEw7/uzFujhAJqnqFYIBFgNsvl/9RrjQFmnt78r5i28jbk25Zrhq9YDsL1KfhACw/lysd2L/AJnnxUkArHYsio+c3ElIFraHZgXXoHcl3h8ds/oPVXCG0kC/qDMIALbBekkaM5RisBExqy05vugB3AdEBYxhfUfAfX8QHi+8Qu

u71W/qdsMtBScrBnP8F/kv9OGqv91/pv9t/rv9rutd94WB4CggUqM4wJbUnvtbUMxtPEOLk0cp/vE9MPni91lLbAEAEhBMALUByQGMBnAP+AnmIcBsAAMAfCKqQjOID81TkO0DEMUgQJM+pYGOf9IXJf9ofkhERAfD9kBo/9xVHZQX/uj9expj9pXjgM7CuZdOdh0MlXltM9uncEyvoLsKvppNTHkecoASII6fhExNPuFEEAbysoCIK0FpKFdufs

AtsxMn9d8FERmRv+pbAZdcJVh68/wtZ9j4Elh8AD0B6gPQByQAtoKAV2FCasV4BsrQDXhiCsmzundZ/j8C/gQCCgQaF8hFvMJLaB4Ro7NHpwIvHkxgZb9b/nLJ7/lAQ4JJPJSKIuQKKDE4xSK9UlgW0NZXg08VjuJ9LLmAdlXlNdAAS+tQAcH8iwqH8OouH9afr/AbHr+sWviTgfDMaJDrrjok/jO8LuKSw3uAu89vBn83Xln8vzn5Q4rNgCVfqT

V54M/VeSA943AlqMhgOqCrKuEA5wi89gHvts4JodsIgS38G9jA12/rEDv3q6BVSNUDagfUDGgc0D/mm0COgV0C+/va5sGDqCktmrB9QRi9VFKh8fFmRNhTgPNRtEkMgUhwB8AOSAy5Glhu2vQByPlSBhnqmlIUhJZX2Kusv4BXdSvP1pIQB4kLuH/BaSrFFliPxVtLnzQQXA9Ml8OTgewHBQdbGKQP/mzscvh796QUAdtUBOB1zgAC1AeREvTtKU

jHv4dwAX089ARIA6vga9xPCcDmvhv1b1K7deAHFYnAVAolPGAscoBjo45DgCtltWdgIjroFetTcU7m8MaDv/k6DnqkcNjm15DMExulDUcmUBGA0ftXYDUmCUTmtdA6NjBknFvwcnUlWFmNv8terMIcDErSAjEiNZTEgwDhdAPNiPoNob0GlgUkEWNyQDuBCxhwBZQA0A8EibxUwfkN0wXtpbeB/B7gDmCVLpPIv4Bx9zJr/QhXj/gywXBgKwQ14L

wf/tS3Jrd6wfICxPmNcslLKAWwZsp9bno9VXtsCuwYd1NXtoCLbqVlIARAAhwQO8nNgYDkgNHlnbkz8ANv8FzJjMtgRm49lwIvcNpJXR6ert4fHhdcRIkN8FQTE9/KE79siluDANIcs/ihoYrwacs/iseDywWeCqwWVAMFimAwjK8sBDr8tBQB8tBDqIdWNu+D76P6lvwQR0YQbxsmAZUBMAD+g2AGlgqXq0AhABoAQIMkAf0N2hkgNuBiIPaFYI

X01WXghDMwS9YUIZO9wIo5RinqVgx2thDWfKWCAcAZDKwURD7DnWCaQQ2C6QZRDmwX69aIX/8DbqoCZPgN4mISyshesY94Dkp8lrip9TjsODOKicC4ard1BIZOCywGshbUn407gbHoVSlQk2+HqVFpGYs5IYwll3rL9qjmu84npuDI3pu8pDLQcjhvQdODjeC9IXhDTwVlDqwSZCzIXeD1EpZDHwfRsmNp6lXwXZCToaepHISYlnIb+DA3EhBJQH

Z9zJCBBSANw0RIKqQUPJgAnPqzZUrmfFvWlFDAsohCswXFDcwdaAFpA1B+XiVBUofLJ1oVNFNocZCcoXIDv/k2Cb1h5VioW2Dffr3dGIRoDuweT9WIb092IQODavqp9moQ18mML/Bhhjd1YjuFEhITL1xhIJEdTob5nzjz9EEE91OPq1BlwRrspoWG8xDMr8HrjuDwzGcttIYwcyrFDCCIeeCtoSctTIdwdzIU+D3lhZDaVC+CXFj8suOH8sFYbZ

ELoYGk/PowCvvl0hVSIH1jgFhB0SuwDOunR8gBHT1DCmAJsYMmcOOm/BBWkMcNtDGFKfDhC08jm5NpJJwOSt49nfqTRcoTj85XgVDFAZcJcALsBiAAoU+htZdmQR2DKoZjDmIVoDaoX6du3g1CBnk1DuIV+tKgCcCVxuTDGfma8LgXSo74jmCq7LHI9en1Ck5FWDMoFkVs8mrt3XiHdOumHdFlFsAJgDAA5wNUB6gLUAOyCCCcrtNDw3mpC5oduD

3vrIc8XrXD64Y3Dm4aF8WcLDQnhtjpjbAMd0AsYdMaOKpfGACovQpCBBulxN1mB4QmegAdFzvlCLLkyAA4UHC6mE29u7lsCgAVONA/nsCTHv6czHo1ChnknDKnCcDRlvyDeKj9BLrGB1+Aakd5yOBtjOshQacOuC2YSG91nuu9xvsyRnAM4B7vn3sgEXoAPOn4CIAEAiQEZfBnAOAjnnrtsjQW895ak38CeG+8ogbDcYgaOI4gRIAdYdgA9YQbCM

HugBoETe8ITmAicuqP8ghsUCsXj3ChTjxdF4pqhraCPp81GgQTFEJZjgG5BkPEYAYIUI9D/itpTYdoYXxo0M7fGhCl8BhDxBnnpo6CSUAVDO1OxqSw6du7CSpJ7D4YQoDUwlkod4cHDUYeVC/fqyDO3gtdz4YcDOIYTDr4dADf4NDIzgV+1JwTbQFfv8o31KzDuvo5QacKZ0jxm8CFIf49K4QitvgZnd9AK0ByQJIAqQE1AZftldVwT4paWDQDuY

T59RrEGDA3KJtfEf4jAkbr9wBozAYUqSx5PFrpbDqIj6oPF9udLPD9TsgJ6fI4ZBWs3xTcqpDYnJSDhPmRCEYYVCxQBoi94UT8D4XVFdEQp99EXHCL4QnCr4Ya8eQckBEOkYC08r4wHpqgCe+OgD3HiT0fCHT1aNIu93gXwZf4cBE7DKNC6AXvcJACQijnpzVlkRidQgcaDMLmaD0ERaC2/lgiEbrWhGEXfBmETjhWESBB2EZwjaujwjoXpB8oEc

AjSEX3t/QcvpAwRrDgwfQiB5jZIs+v+AdwOnFhgLUAbEhr5iAPUAhgLUJhbAf8egYLckKIIiFRJbDTfj4YPFM902cPbCsaDIjnYfIjLrIyN7DnHYsfssCyKrSCt4TUjA4Zoi6IcV9w4dY1I4dVCfTjjC+wXjCuQfoD0ALfC2oRTDLERa8ulEvhc3P0c31AGZ7XnawKfK4RMKuUAe6nYDg7tEg8AYE8CAdINOgB5BfAAJAAXK3CQkW0Ax5Mgg0NpE

ifwTvs/wXId22NKihALKjh4TThyCugJ8WIZ0YJFWpiKHBVXuMiiXgZx1v9AvCDrIW43QqvD7DuUj3qm78fYQSi6MLUiQ4VJ9tEejCj4WpNo4b2COQboC6UTT8U4WYi04bY8BQY1xySuYgJkWZM+ruKC8uNkjn1D/Ds/jE9gspSDGjlIMlkfcijnuQiIEZb1e0Gsjb3vmiEEWDcwgZt9m/jsilHHsiIup399knWwccF8ifkUWMhgP8jjwAMAgUSCj

WSEQi7kTAjS0U8iUPm99Sgeh9ygTP83IRIAZRlAAJgK3AOADwAhgM6pbYMJZVSDvBiAJZIXAN0CBbm4oBESUghEbCimroUte+GEjZ4SWCXhLIicKNOcMUYojSAl7CVge79fYWojt4USi6kf9UVAST9KWnJ9NAY5dZxvsCDEbq9jEZ0iw0ckBDYZGjxwbMxOoXT1pBKcBvbiTB4XPHpJwPBgJsP19ZQYN93EaKjSRPgCvXugBlAM0Be2tgAPqEG8f

8jMjOYfWdu4SOiiOnCDsMbhj8APhigaHqiYKt8p7gKIEwXAOd5yDyYj0cUMpEaej2EDAgszEQEBFuMhTKG/8q4uvCW7vii1gR6jn0V6imQe2CKoeSjP0VjCaoYGih0sGjoapfD+3oBjeIR11QMey0sYEuFiQbOkjrrJDC4TsxO6k5gRWjKD5IQ0kJVsRjYnh3Cs0YX90ALAj4EZzVnMRQib3LlUK0UKEtvh10a0dEC60ft8G0VOiZ0XOiF0RwAl0

X7ZV0eujnAL2i3MQWjioh3M3IgGDh0dG8cxrvs8xpRiIAMQBQ/AgBfwJoAdwBQAVQK3AYAMSU8Pv5pqgMkAqQGJs+bsbCkkVCjd0TCjoMbNMBjsx1f4NT5kUQLFspOeiXYQojMvs15b0XijN4RJj2MJ6itEe+jkEmT8lMYp9qvsp92kRpiRwb/Af1q5s7HiJxWUSTtxUiUMJ3AND5wf/BgeInkxoQqlYruhizXqcMJURIBKQlAA5wAMByzgfB5UW

s9ZkVMJwkTkUVQeRje4ZliLsVdibsXqjIsrcA7DF1D7eKxjgBOF9hzmvgpEZ1jgiAVwvHHnpjKA3U14SRDsfnei3UcNjGQKNiSUWHC5MRjCFMVHDv0WytY4fVC2kYOCAMQtjkgCgdo/tccVcpQtdmPJxJUjuNE0YgghJhvIFlpZjxofYClIQ9iwkQAjKgMAjuKpAjucRsjkERt9vMVWjtvu+8fnh39AsTA9ssWMBcsfljCscVjSsYcBysZVjqsR9

BrtksjHUIOjXviUDUsQOsx0VY45DpKAqQKKMccBQBqgAgAeAL+BkgDUIOAAJZKuskAegFC8asXwiNTvVjzYcIjmscm5ZkOIiaPB1juPjsA0UZei3YX1i9hANiWehRC/YeoipMWNjD4U0ig/vudcYQEUQ0QTDE4ZpiGUb/B6AAkAxwXGdVsSz9RiOz4b4i/C+oZ7x49ButlRDYCBvsKiK4cdisnoUd0ejKBdgBlcnIEEi47m3CfFMiNO4Q0cXAdEj

F4mXJpQI3ivvJ4j+EdrogVJ3VV1pT4YvmUg26NkjJEePiqvGXYEAm1kG7vuIKQaHiMRnj9EYZJjd4dJjNgY0jJsVSiY4dq9VMWp1CcSnjicfQAo/lcd/gnVlwHGOQIrIZjF0q9IyWPMCDseulFISu9RBsBE61MZioQf8dsGMAjVkXaNEEY+91vulNQHq+8RcRgiP3uLj8LjgiJGkbi2ACbizcRbircZcAbcb+A7cQ7je0f/jKEQn1MxjQjXsXQji

ZAPMEgG5B/wAJB9ALbBfwEaAKAJcBqgEYA7PlhAETDuAKXpuieunndXcXuimsQKieXhtob9DoUZ8S48CQf7iqYj1ir0cHjlEaJia3kjiQDv7Co8WjjZMToi98SxCD8ToD+wUnijEafiWoenirzgJDM4ZODYopLAU0ZKkLMTyiRlAZcTtOn8rMaaU8jh4iRfl4iIAMb1owaIVSADNI7sXL924XVwVUQsjfPi5C1fhOj0AI4T14s0AXCd9jztEggkC

uSUgQk1dY6HwTloh1jynl2AIvpsIphFYhwkk6jV8dJNGwdUjN8cSjSofRCWQUoSA0dNjOQWpi5sfV9B3icD6AHyDlsVGi3EGtg2XvMjQFoZ9VliZiHXnXIgIqmiFQVvcf9CAsHMa4C4EasiecUslAupsjiTpEDdkf5i8LhdtYCRAASCWQSKCVQTb7LQT6CbbBGCSqBmCTGcGTp6DAEUMSEscGoksc8iUsZQ80sW8iiCQbieAMC8iILsAQbsy9ncf

R80fsGFgDLSwp8A8CBAbOcCwRtpdRG0AeOiNgDkEhDeoUoiEOBkSmlg+jxYuxhNAFLkeAAbxo8bvidgabdT4XVCZsfHCT8R0jiccO9dCeI0s4br4KKOuB1hm+pFEY2EWWGGEv2JYSWcSKiApHzdq4YmoQaLYkbJM0AV+G4SOYRwZZdtP8crPNDjiaRNA3DSSBgHSTQWpSTOAWTBu4OgJrTG1wRgZAIPidKDahipM4JLygLjE+RkRBAY4cSZcEcYN

jyIevjsiSNi5CXkTSURji/UVQNunvHiaUYnjSiSiT5sVoTkgBp8ycf8Ev4kK10pM3V34SMi4nNHQH9JKTXgRXipkZ+d38e59mSRuDvCTK51XGX5Oatv4biTtty0aMTUEV7BxiX5jMEQFiYCTaCFQBcSpflhBrib2jgyZrjx/j65J/qOjZoe8i5DmQDNAAMBJABMAJgCbjyQEMBWgHOA3IMQBWgGlgf0Pw0z9k7iIUXSYHiYcgJsFHR9gEDDUxGIj

p8cQIEfm3woQOLBfiRy5SvACSb0Sojw8Y+ixQBCTJQFCTHca+iivujjFCXCSewcUSj8ar4NCaiTzSUYBfLBiStPp1C4QILJCFsMiuwGqUk5JlBgEuIlJkW4iPgbYTMMTPwukHABNAJR9eGlhApIIySWEspCF1rh0IkX6S1UTG8NUXi9Hyc+TGgK+TQvtrpcMN6RjND3RuXplFV5D2ShuH2TQFDKT7SJdw3CFz5hMc6ir1pUjVEWCSUcVqT94f/80

YaT9lydjCVCWxDjScfjk8ZuTiYScDI7r0ie+G4RtSr6SmiSNYBUYSToFGhhoDJ0SvSSN9SvJ8BVoi4DXfJQAQyQnFj3IGTVvjtsMLmMTzQdGSoCdaDfevmTCycWTSyeWTKydWTayfWTUyeJTeTgcSh0driOSVTcI3rmS8XpoAegBMByQDAAegNV1rEq3BPajCQIZMoAdwMa9biU2S0wSA5Wya6YXiZ2TEgIeihbsQIO4fkiBydm8/iSOTxCUCTxy

eqSI8UyBpybOSYSZe09SSAC9EWACg0WoSTSVRSzSTRTf4L80LEfY9ANtZhvGL8pYYYr0KcFIFmcHI0BYmXC/HjeTq8fySgenPBMAEX1GgEIAJgCJBCMTs1VoS3iFUT8dPCZCC+id3iB5g1SLys1TWqWBTBSVXRWuByVbeAeikoW1jiBI7CkKVTEUKZLZ0KUqScUdSDvYeJiZCZHit8XFSp+glSunmyDDSSlTaUWlSNyRlSKiVlT+IbGcbzrIEtvB

YgASY+c1NixTHSZhQ4MH19uKZNCPyR4TOce7ptKYWixKcJT+cehcIbq71tkRASJiTGSpiflMU4WZSLKVZTWgDZS7KebAHKU5StKYDScCUUC+1lmSPvri9MsfQBVDmwBjgAEiZCkMAhgA45JANgAT9kIoeAFMFwUVui3KZBEJiJ5TiuCpccRKDDzJiBZ1MgkS6YEFS7gG6Z/iWFSt2hFSsiVFSpyZCToSfISiKR+j1Xopj98cpiVOk+1hmGdTyiTx

C08RaSQiia8VseBi1scAJNLouszARIEHSUnJScChCYlGzDPgQlcsMfVxGgJKBsAGzY+As3jont9TWSSDN+qXIcKADbS7aaqQHaYkiLeGNTIKSKSpqcm4fgOzT9fkNxbgdajpSYtTNrMtTAjKtSqQeiNMiaCTYEjkSX0XSs30THjCiTjiKfuRTVOuuSuIaniSYRaS5yenC3NrtdF1jxNv8Y+cexqYTZUEJNraCkc3SShjK8fKCeKaG87MZ4TBKQGT

0aZAi0yRJTCTo39QaVDdq0bs5a0VDSW9gwACaUTSPgD+hSaeTTKaa3BqacHpMgb9Se6QUDAhrgTqERP9VfuljPvufYNwMQBTTCrxbYCJAsILUBjgHaEvxP+BnAKUFWCXkMNThLgMAmhT2ya8SsQe8TsdJ8SCQd8TByfzTQqYt1hacnSs6oyBZQH68/XrtSvDpjiZadjiDSZV9c6YrTvZMrSiYRdSLSUyiM4ZiTJwdt4phALFzAUmJa6cQQ89Jnly

8c3SPSXzCKSRwC6qV0hJQEIBUCb2JfwMaB3yau9QsjfFKxL1Su8a8iQ0tQycgDhAyYYPiH6cBIoEOPgSkKzhDIKIFJ4TfAP6a6TI6TxjP4LdSoOGD8MKcCTVgVtSn0TtTJaT6jiKVVCbNklT2QSpjUqZRTEGSYjjgVlSI0ffDdMaMRoNipYTCUXjeWir1VwshsiGVYTkrG/jPqYwyfSZWIu6dgx/So4Qc7pAivGTCAgaWt8wGu88h6T5j01nJTsE

fGSD6UfT/wCfSz6RfTW4FfSb6eHBe0X4yfGevSIvOTdt6bQjFqrjT/CRABVSPkZnAK3AhgHABPIaQB5eCBAH0PQAeAD0BqZGnDaPncSTYY/SZIUZQX6d5TqJN7jHCL2SvibzShyWcQikKOTA+Ioz70e6j2MCAzLgGAy1GeNj1AVjjKUcoT5aSLt/0ZoTMqRaSVcaXStabXxc8V2A6OrT1xIST1JISp4jgEiNCKszjDseSTjhlXCTJIspkhr80iaR

kNHaT1lPyfxTSMdCDroYvEbmWlg7mYbDeGXnc1BIEpBGScAxbqIzPcXBTMId0yCQbxjZGYVI46ekSAGaMy8KaoztSYuTfUbHiESXjikSQTj0qSrTk4bxCjACJTTGTed15BMRBIlaxP7A4idcjuladh9TgkfdjQsl+SfqeDQUsP4yETqkyAmZJSQafBNwCb5jR6ZMS9vnGTfegUziAEUySmWUyKmVUyamXUyUmQgAmWWky9id0EyHhmSMfNkycXiG

C5DnOiksEYBW4M6gMQjuAKybENcAIBAfmjwAnbqqd6afwjmmanJWmV5SD0e+w/KXNSemT8Tf6QMzBaQYhhmdISmnsZtbaRMySoQRSyodMzOwRSitGc0jkqboyTqfoyC6WiS74TUSwMZsyHHvZB2uMzhwJMeSSeqeSNpA3c0XFajKqZn9qqWQzLmRQzXwG0A3ILKcWCA8z47mG8eqT+Sf8erDfCZrDz7FABC2cWzYAam9sPBjU4gAIz9IMIzLuHCj

3EF/A7WUNx5qbRQZGbyg5GTCzexphShrhtShscozCUYizfWfkSyUZAz23l+iYGb+jWkYYiI2VuSXNvDVycbalFfsmzrWE8ddzLWoXEe6TrydMi00c7SeYaqDWWSyzpWd4y2WQPTgmZyywadyzX3JDS+WdMT4yeqzNWdqzdwHqzjwIayjAMaypWTKz0yXgSsmQQScmaqy8XkIARIEIByPhMBUhpIBmgO6V6AMhAyacoANSHylTWWwSmmbLoWmZbQW

acHSIOPm9E9PywI6YFTHWSFTnWf/TJCa6jNqR6yqIV6zJmUiyFCSiys6Suyz4WuylmdRTkGUYBScbuTzgfuTtvCYtJGeYD4oa0S7WOx0RsEuFzrmSSq8bmyfmaTJW4IQABgFVj6ALbBNOgwyP8eWyXmfQD1UYG4VOWpyPdppzh4X8z22UIygWResTUcDCyoKHSyOVzTdRJCzh2dCzFSbCy6OZ/8qkaLTU6dviedv6yI4bMyg2XHjYGQni86UrSN2

SsyjALzcGfmXSLpplJycP4luXAzCP4UygzgEBxqWZ1TaWR3SGWQMJQObey8uR5joJl5iiqsPTwabJSxcfJSG0bBz4OZMAkOShyVQGhyVjI0BMOVxAQOfeyMaexd8CTrjDKR3iziXi8IuXzdtWHSYGvKA5saCO040ViDgeJPg91rIF/HLYj2YjocQJKVh+XHjAbXocFaKMRQ0lpA40KjAxsIhOzEcXRgDeCXSN8TiNXTgykAbAxD9qSfCnLoiSSiZ

RTA9DyDNiTFzaRlfj7SKd4vEBO5hkUnJ+XP6ElyBlyEQhMR34N4wi8pWy+iYk0lWj2VtWLRgbOD9gmQFhB4HpcAsIPEtrmK9gmQE1AOuFtdowN2gsgOdgBXLbBMKFsp+yNjyKIHzlz/P747ojkDI1taFrABbADBsqy/CVrDKgGPdwznbcThkNzIoqsR3gOIMSSilABFiMCpuZNMF5MSkPEEyUmoNFErEFUMqxnMt1uUgEy6A7FSvCkS6uBUi8oYy

AjuaMy1zvrdGUpdzUWTdz0WXdzn2urEeQd5krST+0ZZDGErrIb5U2coJyFjoVBXP9zjvIDyhFpHYXaS9iK0Aq1y8sk1P2lDyWKDDyboHDyEeUjzpIKjyxQOjyjgJjyygMTzceZ3R8ed5k0OkTztMHjcgLm0FJasjEd6QBTMsVhB6AMoBjgMoA3IBJc76eqd6Pk6846h4R4JAKtqSgUjjBEVxkIY3SpGT9AJ5nfo34ncY4slij+ptAo9aK5I5kKJU

POdhSJybhTqISjCpmZnSSKVNiWkfjjDgQ9yw0c0AcqTni42WFBXJHnpejPnDpUul8soD5TzabeTxUVbTW4M0A3IFCZiACrxS2TldBXJqd+BkZSEnmRjuuSVdNUbvz9+YfzfaYshVclMh4KIajvGRXzVgjMhhJicA9gGlCo6X4k5SWhTR2etzx2aRCVeV5zJyezsaIeAyPTouyBerLT5mauS9GQbzXGmGidCddTR3k2FnSZrkq6QpJsUc9Sk5FEQ4

UgCSs2XKCbMdn9uiXdd8/uyTXAX3Te6X9TQbiMSBcaATwgaVzX2Y3t9kdA9Ebpnzs+bnz8+R6CgvH/h6Be3N9iQqzwOZmS0+c1N3aZoAxgE+VqgWjs14FhA4AAkBbHPgA4OcoBI+A0zXKQCMkXGW8PCIIsN5J2TruCV4q+U69Dqt/jspHZyKwaNgycOcAW+b2MJZLJJZROlIquN3z4cbiiw8ZFSIBWMzkYa2Ch+bCTNGb4dg2ToyFaYuMjgRH8oE

NUTEdC7cdaXsxGYkZAmDDBil7upZ9fg3cN+TVTyGbXioeJ0AQIAMAEgJgA2APQzXPkpDkIc8Clfs9ir2ZBzXIYzyshTkK8hQUKwKb9jQYRto+fmf0YvpgV4mJ/yUIb/QVGMgIeTOQdLrMhEnqvHTleZOy1SSLSvBcAyfBT6z6kYRT1GdLSl2fAKiiWPyMWRPyX2qgKs8TdScJItI83CtI5wYzDQJJsJXuPbyuwhQKIiDly9AMqBAgstp/qcyQLhb

0lXFP3Sn3swLK0WgiyuTyz32dATP2b70KANILZBdqhSzqR8lBSoK1BZHwV6dQxaQPcLrhXKznvlQisaRILWSTdDWgI4AhsG5APporwAQZgBqgGeQYAJoB2bN9DNDu1A8dgFR3HINhAcRsFLDvaQjBZlIASd2ps0mMitdFlBoMVO0x2YYUxlKICipCIy4WcjiB+b4LWOVLSJsSPy5aYgKw2cgKFsdMLnuWekcCFTCArkfQXCIIsKEujUKcPFYHGfJ

zW6S4zRBifyoEAmicyRfyNIYtDHivuCGDoeDaCvmDEKgkUcYOYhtvN8UwAMEwMdLf8ORZ3RaNoolZYUIJ5FntC5YcdCVYW+CzoR+ChrE5D12G7S8XmMBSFDjhRLAMA0BbVTsPP2or/jMtm+FItv4JksvgIBFWHLMs9Sr/zcIRSKgIoxpKFiij+rm6yGOQq8aaDyLxRenSFyWxyNGYGzAhcFzV2ePzXLpPyDAT5dL8T+1IiK6Z0vvIJkuY6ToMWm4

k9McLj+TMsEpCwzQeR4zmSKTz42OTzo2JTzG1ubtqebagjAHTybhZUBRxa34KeZicqeeh5ZxfOKGBZ5jwySEyn3MdtICTkFm9gRd1arcilxV4MJxauLZtvSB1xbTzU+TpSwhnCL6ebWyqhGCkf0IcB8ef+BqgP+BWuomUENPgBJAGYjkeScM4Iay8aNKAI1zHz8mMRA5qSlJZeedYg8MNvh5uVKSWJDGLadpMQMaMJjVcmktjIC2EoOATYuRdOzI

BYPy+RXMKBRQELyvrrzD8UgKOKplSZpHACzXtKLy6Q/pniRyNFerXzGwiwc45C0ZexdWcShUCEMNOULVUXlZ9RZm0ycuLDYzIxAP4GYY0JXZQMJfFgsJeeClOBYUacJcAnRU1ZpYXwdrIR6l7Fl6LTobpLzoZ+CA0j4S3mQPMoAPxARIP+AsIFAAapEpzwBnkwUpPR0bNC/tExalAjgMBwWJpayqvJYcFdOVAv4vI1hhS6jPOThSU6d4KoBX4L4q

Tryf0VxzaxZAD6xWnjMeeszaicpsajgSSFJFbzXEB2TadsOQeJWs9BpmRRlUawzqBRtE/rsnyLaneKFxRIAYLvjcYginy1BsMTtxUwKDtmATiqv7NLQdABzttDT0Jv39E+S9dapf4N0mXydMXhByr+ck88XgyIvITABzyHySMhUSUIJAxpoKldY0KVz8DTtDRAsq/YSNq0zWhfLIYKuSUEJYqjwEC6z6cXICEABLg9IPCzxmSxy52TqSlyeRLdgZ

RLVCSKKaJRdSTWZrTaiS6F+tIFRPbh6QvuTZRbDkgF79DlLfKOAhtvPGFXeY5jtRrIMP7rzM2QsOhU9l4DEmplQYETltX6rFVQgH3tGtoQ9/7u8RGLgkEETpoMy0C9tS0DDLDUHDK2ggjKlvhCdkZRZU0ZSxc/7nfdXrhGwxwoEywyY1KTQc1LTIq1K9keD4JcQUEuOGCKIZVoMoZUTK9ULDKV9jEFyZUjKxttTLmAOjKvrjfcsZQzLs9peFEsQ+

KEdk+LTiRUDMsTvA7oUYAi2eos82dh5v7J3RBEZ2yTNHQlIfpFkwwkiJVLtZy6+V2dP4LtKnuqLIZsAFKsKSrypcnhwUoOdLmOSWKFJrML/OfJioGXMylhSGyQhTV84pSTCxGq9KH4QYhF4WsFKkq/C2RB2KWHIQsDyRJzBUa69UMWQKFQcDKFpEncq2Zd4iFN/cx2KNl6QljLOajuBi5Zmwy5XfcH2U8KmpSwKTXPXtyuchMDkQVM1cegBK5ZFN

q5ViQLcKP96pkcS0PjjToOZli3ICzVl4HaVGxTXi3FMAlMVkhjquJhQL/i3V4gA1kQeMrdG7gSDJOL2p5RPG5RZI1d7DuSse+e7L7EggAvZdyKfZdAL9Hldzl2YdSQuUaSwuSdNMqUBLEpTHKmwpEUmCFaijrniS6cVixUBjyhA2CQKs5eeyvzsVh37GVgcufjLggBpF5IK3N8ihf50hKHArnFyAwgFCdu0N/UyQIdAetgFUHUGX5MTtoBOAGfcP

iDah9QILLoFWSAWAA5VlYFgqA1un4cgDagcHgKB1YHzVASIEBkFQGhhqmrhq5j6AqGRGitRpAqU5jAr1qHAr/fIEEoqNuBVYGwrHAtvUMFYqNHttgrgyXgqCFRCQSFQTKmAOQrmAJQqQ9vEEaFQlR4Ygwqp0MwrjUKwr05hwqhAFwqdQDwrttgF0GpcDTB6c+yOZWEzDxW3KrtjC9+FWQqD3EDtIchmwEFeIqkLigrvFekJMFXIq6qjgrhKYoqOA

IQreSCoqoFWoqD3JorqFfqtdFdg984owqlQPcRjFerNTFeYrmAJYq4dr2s1ZZULqHrkzqhf4CmbiJBsAL+Ar7MiCvcdRJGUBcY8MBf8wJC/ZnSD4Qz+nptWxgyggspIi6OjgoWxutz5jiMKDuexgPZafKnuT/9hNKAzfZaHDyxfMK4BdAzb5TWKVhXWK1hQYDIhWuMMBSUhvGc3x92QXD8Bb9LIrHZQYEHJyzmc4yaWUDKICh/ScuS6shyFic3/C

3kd3AYBy/swBzdpXA7FFqCLnt0hjUMcBblSPZ4YsP9EwPqhXlZXA65SASG5S8LNkvuKIad54OpS3sTxd1KJANcrvlYuVflVH5HlQ4F1qJH43lXkr0sY+LClbvTilefZ6gCD0ccL+BSAKqQU3tPKoaE9ZuAQgEZ8H0dGlU1xRbof0KxKBshCZ0rPHDGEelbzyIwgggBrgnSnDoyARlWfLCJd4LJlZfLteRxyFldFKllbFKVlWnjwoU2KArmMpakur

031BHTGwm2o1kPp0rydZjgFW3TtSm5LGSmDLXAbpV/MK/VUFXIq8ABVtOaqaqI/P1tn6laqoRczLGBbYqn2aaCHFW6NG4n89eZUIJ+ZbarzVVgrHVVQ0RBTNUClSNLh5cZTMsRQA0INmpRqAPi7CXtUmMQbpUBrnCGlexMJkC0YLgK0r/HEl84mByq+aZlBuVSyU+VYMrVSUKqxlSdzJhWKrwpXtTIpbjiqJY9LH5RdTJgvRSzfpJwDmIMiTOttj

GYSpZwwieziGWezPSeqLCkCkwjISiEipQCdtZt6AOwEQrcwN0ktQvQrRNvoB3iOnEoAMdFbwAeBXiBmwD6pkA4AGf5y4ubtDUJf5kFeYBw9kTMz3lOrTEBCRgdpf4tQvFQl1Suqm/DIZN1VIrfQaQp91XHE8tsercMu9485iCqgmSgjdxbXFm5e8LoVUeLYCXCrtiZUAFwCCRp1f1tPiDeqt6mSF71cWpH1dnsN1WCR4/J3491foNP1cOhv1awBf

1Y2tsVZ1zhpQZSygTqLNZXkzmAEhBHFLsA6GRMA5wElgccKYowUhQBmgMwAvfBrTgJZFDfauKl26LcB+IhuA3CLbK34GKkostjZLqkcyFpshKXgLlJnJCzhwiCoQWSvMIf4h4437MPVlSe4KRYuVFxlZ6zq1SRKA5bAKA/jfLtGUdTQ2RRTRRVoSz9IJz/1p1DxhCAkVwKmcPuucAauHaSdVdYSh1WcqfWApVp8A3I9OTpJNIXhsBYcaLGIM4A8M

L2omMYpr6stZz2jKpqFpV+xMAuNg1JVpKlYVZCXRXYshDj6L9obZCDJX6LLoQGL2GYvERIKQDbFPj4m2ZSq9qsXzqAciBvgHBhMlm3RflIDNFUYyKbfrPINrIkwsoOMgQFrE5D5W4L1qUMraaNAk8vkfIDNVdLkWRWLAuVWK0WQ2rLNU9LVaSTCGyRKLX5fG54KNBjFPFIF5RExiLiB5qnGWqLvNZh01wC6YEijlyT7pWgjolrM/UGbsaYJwBFQH

H43yjarjUOdr4Yl9t7ordqMQDaN8GNYqiuTuL7FU3LIVS3L33OBqbQZBqBBTX9TYLzA8tuDrIIR9qHtf3LN9oPKgwZIK8XraU2Hq8waRMiDIigDgZlvkw6tY2oxNWrohGYdYWtdLz1NoKD2tXZROtY/AetRkx8xexh8IiNqixRfKa1RAzr5YsLs6dSjjqXNqm1Qtq6fiLlW1RGByPLbRBVsVTsGQ/iliN4otNoDKfNWLdE2cr1jVfKtrtekIY4g6

h/MCe891a9qz1a652tsvsx4l1U7iOpAodcag/1Y8LQVWzLG5XuLOZdEDuZfyzs1nzKO5Z8rddSrqwgCCRDda9qW5iRrMmeIL1ZcjrMsZgAIwIIAccKrwKAI45fIZ7UQIJcAjSDwBKsnzcQJb7V2Ud3B61I0ZuNBf9qNqAJFKihD5Gu/tZNST0YpGW9jTn/ASNqUizqBMdqNmoRbOhgInqaWqkwlSlCxRMrvWeKqCiYKKEBcsL9efNqcWWniKVdHL

s8aHJOofbxxiNqqp3oqLkIXixjla/j9tZlzzlV4hG+t+TBJb+ThJbuCloYaKVobpC8NqrkHTD5TpkACw9SvJLS9foLT/pXrjgClqMtWPZ0tRpKbIfZC0tcQBctb6KvwQVrwWEVqB5iRZOgLNYQltxqDZTPKhJtD9XCPFJveG0KsaB0LXTEiF/QmEpN5aMJ/KPZRWmfBh9TgSkQBSqSa9cNq9NUxyxtTMK/WcPzbpfCT7pXAzQhRHK6fjuT0BTH9U

lmTB8YA6SliAn8+XD2EWWLiJM5S3Ts5TxTisE3wmnArrkGo4FKQO8Qs8LPUOZolNFRn1LEZWwBtAAjMOgtg81qBwAAAAZR+BdBhAdahRwC1DmAXICxBJ3ZgwRGLhVfdXE8ERXoeEfy4AGyparcwChVVE7l7QIBmAYQDMAXPx7vfqodxbTATwSw3GZF3aVzd+6oK5XVMAPuWQI8+qoANg1fETg131bg1B+Xg2WVBypyKrPwiG8Q0BBCrbSG27VEAJ

YBqrDSKYAJQ1QKlqr6DNQ1x+aICF7HBXlrbAB6G9sC9+FPaGG9gD5FUw2jscw0OoSw3E8sCaH3Ow1c4J1wxxZw31Sn7WsyrZEeqiB5eq+tHBze3UwvVw3uGjg0YNBKYEhHw1lSvVCCAfw3P1QI3hAMQ0SG0I1AeWQ2RGjmZYAWI0BoRVYJG1vzJGzQ2pG0RDarDI3kzbI0f1XI0mG94iM1Qo22VEuAlGmw0gkco2rkSo1OG5ymUQFWWhql5E1sjW

V6KcADAwSiDf1NUBPSWbIj5HmBY5Q7CPABgDv+CgA9ADUmMgMQDEAJU4a0r2CPRXsyd+NUAq8/CLgmuGIL2TvwAm7zmiqhvU/Gg6JPYdSqZATTneo8tBwmjE1QmpvUgxCE2XmAk1zKuZl4myE2ZAX8Bsgik0kmzIDPlelq0mhE1Ym+uVwTJk2Ymign4nHzDsmzvwFwTKbPYHk2ZAV406SrCxQ+QU2QBZxaimsQ5n8NE3Em5k2kfD4xuQIfAXgdYD

imyKjaYak0ugYYh/4GhDKgcdK7WUJKXQSxA90KPR38HU1kgZUClqXaxX7X5iqCY0TZ6iABGAafKZCAHIMAAgCNwUYodcZDAtYcU3Um6NmAYFU0/GvkAkAJILDQElQhmg8D35K6Dhm4gAbwWGCsAiGbViGM3Q8gMA9AHwYLAZQBcgM+7+43vxQSXM0UeLDL33eUA1wS+q9Jd5DWhLM3XcfM1AgYASDgQs2yEYxBMm6E0OgVVplFV00VFTCALZbJql

5cDI6tOEo+Ew1pL5fkRlNb0BHZX4RD5bAh1NcfLWGRpojFGVjYZP7QTFS5CdNBNqFnT1q9NH6F/ZQuA2cf1pXlZ8BBtAfKr5S4pJtJSBrGA4o1NIZrVtfc2rNEDJHmxNqbNQnk+m7Vg1wIsCdoLuwhQd8r1iMKD8FGwLDNVHzE8sh4jm3Sl1sKiCUgEQoJ85D4gWoNBMABM1fm6jI+muwB2lSI0qgNBVxmhACwW4IDfm0NRcVdWCMANyDT5ZexnZ

TrrM1K0h1St3kFFJU0AYXUWnKWmqskYIBqhQmShAXsT7+PC0EW4pVZY7cCJmmkA+wd8AwXXMAXKIKAuFDgqmYZSDNgIAA===
```
%%