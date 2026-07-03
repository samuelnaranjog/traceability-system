---
Project: TraceabilitySystem
Priority: P0-Critical
State: Approved
Description: How is the git workflow going to work what kind of flags will I use and what is its purpose. What will be the commit workflow
---
> [!info] 🏛️ TSO-ADR-008_Git_Staging_Workflow_Pristine_Version_Control_Engineering
>
> **Date of Decision:**  2026-07-02 
> 
> ---
> *Connections*
> <span hidden data-connections-begin></span>
> <span hidden data-connections-end></span>
> ---
> ## **1. The Context (Systemic Problem)**
>  ***Issue***
> Is fundamental to have a pristine commit history to understand the project, its progression, what has been implemented and how the project as evolved over time.
> 
> Also easily look backwards quickly identification of the implementation details we are looking for. Nor in a messy uncontextualized way but rather having clear context on what are those changes related to, which requisite is being implemented, refactor or updated 
> 
> Managing docs and code within the same repository carries the risk of "micro commit bloat" only small work and temporary struggle that doesn't carry a significant weight when backward looking in the future fill the commit history. When reviewing you don't what to see hundreds of micro commits that doesn't actually inform of a complete feature.
> 
> *Edge Cases:*
> 
> - Also probable cross device synchronization commits that should not be part of the final commit history.
> - Another key edge case is the synchronization of the cloud repository and the conflict it might cause with the overall sync and the atomic commit history.
> - Handling two REQs that modify the same file in different lines
> - Complete vision of the doc files from the markdown renderer
> 
>  ***Propose Design***
> 
> ==Clean Commit Guidelines==
> A specified guide of which flags use when committing what structure should the commit follow, the usage of structural bracket identifier and how to handle long commit messages for clean backward review.
> 
> Usage of flags and the artifact identifier to identify the scope of the commit and implemented work.
> 
> Ensure only relevant to the artifact files are added to the staging area  
> 
> ==*Workspace squashing and isolated staging pipeline*== (Used in each worktree)
> 
> Uses one branch that contains all the wip and complete feature commits
> 
> Using `--soft` reset of `wip: [ID]` commits to surgically add the complete implementation of the feature. Avoid let in the commit ledger sub atomic progress or struggle. If you consider that progress relevant add it in the final feature commit as an addition, leveraging the context provided by those subatomic commits.
> 
> ==Clean Room Extraction== (Deprecated)
> 
> **Workspace**
> The project manages 2 branches one for the `workspace`, containing all the **wip** messy commits. Since all files existe in this branch the md renderer can easily access all those docs in progress.
> 
> **Clean extraction**
> When `REQ-000`is finish the developer switches to the production branch and extracts only the finish files related to the artifact into the main staging area `git checkout workspace/active -- docs/REQs/OPT-REQ-025.md src/auth/login.ts`
> 
> **Atomic commit**
> Finally those pull files are commit and the dev switch back to its workspace branch and rebase main to update the working tree 
>
>>[!danger] **Artifact history collapse**
>>  A critical issue of **version history pollution** is identified when multiple requirements (REQ-025 and REQ-026) depend on a shared logical unit ("helper").
>> 
>> *The Technical Conflict*
>> 
>> - *Interdependence:* Both REQ-025 and REQ-026 modify the same helper file.
>>     
>> - *Granularity Conflict:*
>>     
>>     - REQ-025 appends lines "12345".
>>         
>>     - REQ-026 appends lines "6789".
>>         
>> - *Impact on History:* When creating a complete commit of the file, Git's history fails to distinguish the logical authorship of each change, incorrectly binding the lines belonging to REQ-026 within the context of REQ-025.
>
> 
> ==Git Work-tree==
> 
> **work-tree option**
> Work-tree keeps the main git data base but project the file to a new folder. Each artifact becomes separated in the hard drive (a new independent working directory).
> 
> Since now artifacts are in a different folder in order for the markdown renderer to read those files it needs only one vault. You connect each artifact folder through a symlink that extract its content. Now files seem to live by themself in a single folder but instead they are separated folders with its own versioning.
> 
> > [!success] *Eliminates dashboard blindness by using the symlink connection*
> 
> **Artifact history collapse**
> By having separate branches that manage the history of different artifacts and specially of requirements the **Artifact history collapse**
> is avoided by:
> 
>>[!success] Artifact history collapse solved
>>  No detail is lost in a commit since since the file modifications are tied to a single branch which creates the full feature commit.
> 
> Exact line changes of a mutual file are specifically related to the artifact keeping the traceability clean and no leak data in other commits.
> 
> 
> ```mermaid
> graph TD
> 
> %% Styling
> classDef ui fill:#4a154b,stroke:#fff,stroke-width:2px,color:#fff;
> classDef os fill:#0b3d91,stroke:#fff,stroke-width:2px,color:#fff;
> classDef git fill:#f14e32,stroke:#fff,stroke-width:2px,color:#fff;
> 
> subgraph Markdown Editor UI
>     V_MAIN[Main Vault]
> end
> 
> subgraph Artifact And Related Files Implementation
>     V_REQ25[REQ-025]
>     V_REQ26[REQ-026]
> end
> 
> subgraph Git Trees Dirs
>     WT_MAIN[Main Worktree]
>     WT_REQ25[REQ-025 Worktree]
>     WT_REQ26[REQ-026 Worktree]
> end
> 
> subgraph Git Data Base
>     GIT_DB[(Shared .git DB)]:::git
> end
> 
> %% Connections
> V_MAIN -.- WT_MAIN
> V_MAIN -.- WT_REQ25
> V_MAIN -.- WT_REQ26
> V_REQ25 -.-> WT_REQ25
> V_REQ26 -.-> WT_REQ26
> 
> WT_MAIN ===> GIT_DB
> WT_REQ25 ===> GIT_DB
> WT_REQ26 ===> GIT_DB
> 
> %% Individual class assignments to prevent parser bugs
> class V_MAIN ui;
> class V_REQ25 ui;
> class V_REQ26 ui;
> 
> class WT_MAIN os;
> class WT_REQ25 os;
> class WT_REQ26 os;
> ```
> 
> 
> ##  **2. The Decision**
> 
> ### ==Clean Commit Guidelines==
> 
> #### Commit structure
> 
> ##### Type of commit
> The traceability system version control has 2 types of commits:
> 
>*Feature ready to deploy (completed implementation):* This consists in the clean finished functionality tested and successful fulfillment of the acceptance criteria.
> 
> > [!info] Feature ready to deploy instructions
> > This kind of completed implementation commits must be pretty clean to do so the builder should:
> > - Separate header from body by triggering commit only using `git commit` to enter the default text editor
> > - Keep the commit subject (header) short to ensure reliability for easy scanning of your commit history using `git log --oneline`
> > - If you consider worth it expand the body by using the wip commit data to ensure the commit resembles what was implemented
> > - Follow the surgical staging specified below
> 
>*Work in progress:* The temporary synchronization, subatomic milestones and artifact problem solving, this kind of commit serves as the snapshot small work complete and temporary struggle. 
> 
> > [!info] wip Instructions
> > - This kind of wip commits must never pollute the main branch
> > - Keep the wip workflow simple by easily adding log data `git commit -m ""`
> > - For cross device sync use default message `git commit -m "wip: [id] general sync"`
> > - Make sure to add the bracket identifier to relate the wip changes to the specific artifact
> 
> ##### Structural Bracket Identifier
> Every single commit that is not related with a general sync should contain the structural bracket identifier that ensures the data being added to the repository is directly linked to the *artifact* that gives context of the implementation 
> **`type(scope): [ID]`** 
> 
> Examples:
> - `type(scope):[REQ-001]`
> - `type(scope): [REQ-020]`
> - `type(scope): [ADR-002]`
> 
> #### Feature ready to deploy 
> When a new commit is created for a completed feature the convention to use is as follows
> 
> ```
> <type>(<scope>): [ID] <subject>
> <BLANK LINE>
> <body>
> <BLANK LINE>
> <footer>
> ```
> 
> For the subject always use imperative forms: 
>
> | **Imperative Verb** | **Primary Use Case**                                         | **Target Example (Line 1 of Git Editor)**                           |
> | ------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------- |
> | **`add`**           | Introduce a completely new feature or tool                   | `feat(trace): [REQ-020] add automatic link engine`                  |
> | **`deploy`**        | Release a finalized, production-ready system layer           | `feat(core): [REQ-011] deploy background pre-commit hook`           |
> | **`allow`**         | Open up permissions, configurations, or syntax options       | `feat(links): [REQ-020] allow manual links in script engine`        |
> | **`support`**       | Extend core engine capability to capture new patterns        | `feat(parser): [REQ-007] support dual-bridge relative path logic`   |
> | **`implement`**     | Construct functional multi-file programmatic modules         | `feat(auth): [REQ-002] implement token validation validation cycle` |
> | **`fix`**           | General patch for logic broken against the REQ note          | `fix(links): [REQ-020] fix relative extraction path offset`         |
> | **`resolve`**       | Eradicate a technical blocker, crash, or race condition      | `fix(core): [REQ-015] resolve race condition in symlink barrier`    |
> | **`prevent`**       | Block a structural hazard or execution edge case             | `fix(sync): [REQ-025] prevent infinite cloud synchronization loops` |
> | **`handle`**        | Gracefully parse edge cases without crashing runtime         | `fix(parser): [REQ-007] handle raw markdown backtick strings`       |
> | **`correct`**       | Adjust mismatched syntax, wrong strings, or broken DQL       | `fix(dql): [REQ-001] correct dataview regex query patterns`         |
> | **`formalize`**     | Establish an unyielding rule or template configuration       | `docs(arch): [ADR-006] formalize token delimiter rules`             |
> | **`log`**           | Record an organizational or policy mandate inside an ADR     | `docs(arch): [ADR-012] log separation mandate for git commits`      |
> | **`update`**        | Modify existing metrics, business values, or documentation   | `docs(req): [REQ-020] update acceptance criteria market data`       |
> | **`upgrade`**       | Advance an active template or system automation level        | `docs(moc): [MOC-001] upgrade inventory template to dynamic radar`  |
> | **`document`**      | Write descriptive developer guides or operational wikis      | `docs(core): document deployment protocol for script assets`        |
> | **`refactor`**      | Rewrite working logic without modifying operational output   | `refactor(links): strip system prefixes from local parsers`         |
> | **`execute`**       | Fire global maintenance scripts across the workspace         | `chore(core): execute global auto-link script across vault`         |
> | **`clean`**         | Prune loose variable declarations or loop noise              | `refactor(engine): clean up array loop concatenations`              |
> | **`optimize`**      | Scale performance, file indexing time, or memory footprint   | `perf(trace): optimize regex file sweep execution speed`            |
> | **`remove`**        | Delete dead code, deprecated mock folders, or obsolete paths | `chore(core): remove duplicate mock schema directory`               |
> 
> 
> ##### Semantic conventional commits
> 
> ###### Semantic Types
> 
> | **Semantic Type** | **Definition**    | **Usage Context**                                                                                                                     |
> | ----------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
> | **`feat`**        | Feature           | A new capability or functionality added to the codebase. This is the only type that signifies a move from _3-Active_ to _4-Done_.     |
> | **`fix`**         | Bug Fix           | A patch for a functional error. Use this when the system is not behaving according to the defined REQ.                                |
> | **`docs`**        | Documentation     | Changes to documentation only. Use this when updating ADRs, READMEs, or project notes without altering runtime logic.                 |
> | **`chore`**       | Maintenance       | Routine tasks, build process adjustments, or dependency updates. Essential for executing global refactors via scripts.                |
> | **`refactor`**    | Structural Change | Code changes that neither fix a bug nor add a feature (e.g., restructuring internal helper logic without changing external behavior). |
> | **`perf`**        | Performance       | Changes specifically intended to improve system speed or resource utilization.                                                        |
> | **`test`**        | Testing           | Adding missing tests or correcting existing ones. Often bundled with `feat` or `fix` in an atomic commit.                             |
> 
> > [!info] Semantic type usage instructions
> > ## Atomic commits
> > For the semantic commit in an atomic context, understanding atomic as a commit that groups all the files related to a complete requirement including the artifact of the requirement `REQ` itself.
> > 
> > More than often you'll find yourself introducing or updating new functionality for a `REQ` in this case the most common type of semantic will be `feat`.
> > 
> > **Introducing a new feature, new complete requirement**
> > When the feature is fully functional and has been properly tested and integrated into the system is time to transition from a `wip` to a feature ready to deploy commit structure.
> > 
> > In the traceability system this will be translated as transitioning the status of the _requirement_ from 3-Active to 4-Done.
> > 
> > This will remain as an engraved point in time of progress in the project. Use `feat(<scope>): [ID] <subject>` 
> > 
> > *Example:*
> > - `feat(trace): [REQ-020] add automatic refactoring connection engine`
> > 
> > **Updating a requirements**
> > A requirement requires an update or improvement in functionality to do so use `feat(<scope>): [ID] <subject>` but update the scope and subject of the update commit. _Is foundational that this follows the ready to deploy feature instructions_.
> > 
> > *Example:*
> > - `feat(links): [REQ-020] allow manual links in autolink engine`
> > ## Architectural Decision Records and Vertical Slicing
> > The artifact `ADR`and`VS` must be added in to the main branch as standalone pieces since their main purpose is to document the architecture and explain vertical functionality visually. In this case use the `docs` type using `adr` and `vs` as scope `docs(arch): [ID] <subject>` & `docs(vs): [ID] <subject>`
> > 
> > Examples:
> > - `docs(arch): [ADR-001] Performance trade offs of monte carlo simulation`
> > - `docs(vs): [VS-002] User authentication`
> > 
> > For complex commits with a lot of data use the structural guidelines of *Feature ready to deploy instructions* [Type of commit](#Type%20of%20commit)
> > 
> > ## Other commits
> > For related changes that don't involve introducing or updating a new feature and REQs or VS artifact the remaining flags can be used: **`fix`**   **`refactor`** **`perf`**   **`test`**   **`chore`**.        
> 
> ###### Semantic scope
> The scope defines where in the **system** the change took place, maps directly to a boundary within the repository.
> 
> The scope should never introduce spaces 
> 
> This are the scopes for the **project baseline**, but later for feats and other semantic type you can add more if they give proper context of the boundary of the implementation
> 
> 
> 
> | **Traceability System Scope** | **Boundary Mapping**                                                              | **Invariant Baseline**                                                         |
> | ----------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
> | **`arch`**                    | Architectural Decision Records (ADRs)                                             | `docs(arch): [ADR-012] formalize commit split mandate`                         |
> | **`core`**                    | System environment & repository setups                                            | `chore(core): execute global prefix refactoring swipe`                         |
> | **`vs`**                      | Vertical Slicing                                                                  | `docs(vs): [VS-002] User authentication`                                       |
> | **`moc`**                     | Maps of content (central dashboard)                                               | `docs(moc): update central dashboard`                                          |
> | **`kanban`**                  | Kanban boards update (ensure you mention which board it is)                       | `docs(kanaba): update kanban configurations for ADRs`                          |
> | **`spec`**                    | For files that define the requirements, boundaries, and MoSCoW rules of a project | `docs(spec): define moscow priorities and system boundaries for alpha release` |
> 
> *Some example of other scope for your projects:*
> 
> - `auth` – Token lifecycles, permissions, session or gate configurations.
> - `api` – Network contracts, routing interfaces, payload controllers.
> - `core` – Central engine state modifications, common shared behaviors.
> - `db` – Migrations, connection setups, driver patches, query schemes.
> - `ui` – Style adjustments, rendering matrices, frontend components.
> - `data` – Raw ingestion logic, pipeline transforms, processing layers.
> - `model` – Validation schemas, feature rules, theoretical structures.
> - `parser` – Text filtering, character tokenization, layout extractions.
> - `perf` – Speed configurations, memory sweeps, asset optimization.
> - `board` – Structural footprints, pin allocations, peripheral setups.
> - `firmware` – Driver setups, compiler settings, close-to-metal scripts.
> - `sensor` – Polling loops, error loops, scaling configurations.
> - `bom` – Material tracking, parameter logs, inventory checklists.
> - `cad` – Enclosure clearance data, path routing boundaries.
> - `arch` – Foundation designs, policy protocols, architectural logs (ADRs). 
> - `docs` – Artifact structures, note descriptions, manual entries.
> - `test` – Validation runs, coverage setups, standalone integration tests.
> 
> 
> ##### Surgical file injection
> Now that the guidelines for commit message structure have been given, lets make sure you know what the staging should look like. The main purpose of having a clean ledger is the capacity of traveling to the past and see a self documenting commit ledger that groups the artifact that contains the context of the implementation and the files that form a complete functional feature.
> 
> Every time that you make a commit that will be part of the **main branch** make sure the files added to the staging area are the implemented functionality and its requirement artifact.
>  
> ### ==Git Work-Tree==
> 
> ### Instructions
> To enable a clean traceable ledger the correct grouping of files  implementation is fundamental the req with a wip of one is not optional
> 
> #### Artifact development
> When creating a complete feature of performing specific modifications related to a requirements follow the next guidelines:
> 
> > [!info] Guidelines
> > - Each artifact in progress must have its own work-tree, this helps to avoid traceability collapse
> > - To have your markdown renderer pointing to the current modify artifact you must **update the symlink** to point to the specific work-tree branch directory
> > - Once the implementation is consider complete follow the next steps:
> >      - make a final **wip** commit with the final progress
> >      - run `git log --oneline` to check the **number** or **hash**
> >      - use `git rebase -i HEAD~<number of wips>` to rebase from the head to the number or target the hash of the last good commit right before your WIPs  `git rebase -i z9y8x7w`
> >      - Pick the final wip with  `pick`  at the start of the commit, set the others to `s` for squashing. Save and wait the next window
> >      - Delete or comment `#` the wips and and on top write the commit following the [Feature ready to deploy](#Feature%20ready%20to%20deploy) instructions.
> > - Sync to the main branch
> > 
> 
> #### Specifications design and updates
> When creating new empty artifacts or creating a creating a general mood board to contain  boundaries of the project and brain storming ideas follow the next guidelines:
> > [!info] Guidelines
> > - Create a **new** work tree `/specifications`
> > -  **Update the symlink** to point to the specific work-tree branch directory
> > - Once the implementation is consider complete rebase and add the final commit as [Semantic scope](#Semantic%20scope) with `docs(specs):`
> > - You can add here multiple REQs or ADRs at once of course if their content is empty, when actually adding content use  [Artifact development](#Artifact%20development) instructions
> 
> 
> ### Workflow
> ```mermaid
> graph TD
>     A[New tree and link to markdown renderer folder by symlink]
>     B[wip]
>     C[Squash protocol]
>     D[Final commit]
>     E[Sync to main]
>     F[Delete symlink and point back to main]
>     G[Delete tree]
>     H[Repeat]
> 
>     A --> B --> C --> D --> E --> F --> G --> H --> A
> 
>     Note[Helpful script]
>     Note -.- A
>     Note -.- F
>     Note -.- G
> 
>     style Note fill:#fff2f2,stroke:#ff8888,stroke-width:2px,stroke-dasharray: 5 5
> ```
> 
> 
> Lets analyze how these new system constrains look like in an actual real scenario to get a better sense on how to follow these guidelines and how to handle some edge cases you can face.
> 
> Initial working directory:
> ```
> 📁 projects/                              
> │
> ├── 📁 trading-bot-core/                    <-- Worktree #1 (Production Anchor: 'main')
> │   ├── 📁 .git/                            <-- The ACTUAL repository database lives ONLY here
> │   │
> │   ├── 📁 docs/
> │   │   ├── 📁 architecture/
> │   │   │   └── 📄 PRO-ADR-003_runtime.md
> │   │   └── 📁 requirements/
> │   │       └── 📄 General_Analytical_Breakdown.md
> 			|__	📄 PRO-REQ-002_Multi_Exchange.md
> │   │
> │   └── 📁 src/
> │       |__ 📄 portfolio_optimizer.py
> 		|__ 📄 Arbitrage_Strategy_Engine.js
> │
> 
> ```
> #### Working on specifications design and updates
> 
> To update your project scope, you spawn a second tree named `specifications`. The automated script temporarily points your markdown renderer vault here. You iterate on your MoSCoW matrices and analytical breakdowns in isolation. Once you run the squash protocol and sync to `main`, this second tree is destroyed.
> 
> ```
> 📁 projects/
> │
> ├── 📁 trading-bot-core/                    <-- Worktree #1 (Production Anchor: 'main')
> │   └── 📁 docs/requirements/
> │       └── 📄 General_Analytical_Breakdown.md
> │
> └── 📁 trading-bot-specifications/          <-- Second tree: /specifications
>     ├── 📄 .git
>     └── 📁 docs/requirements/
>         └── 📄 General_Analytical_Breakdown.md  <-- Edits happen here
> ```
> 
> #### Working on a requirement 
> 
> When defining the execution constraints for the arbitrage engine, you spawn a second tree named `REQ-002`. This allows you to map out the exact boundaries for the JavaScript without polluting the main repository with unfinished thoughts. After the final semantic commit is synced, the tree is wiped out. But the specific implemented files remain linked with the `REQ-002` as a time capsule that explain what was actually modify and implemented with great context.
> 
> ```
> 📁 projects/
> │
> ├── 📁 trading-bot-core/                        <-- Worktree #1 (Production Anchor: 'main')
> │   ├── 📁 docs/requirements/
> │   │   └── 📄 PRO-REQ-002_Multi_Exchange.md
> │   │
> │   └── 📁 src/
> │       └── 📄 Arbitrage_Strategy_Engine.js
> │
> └── 📁 trading-bot-REQ-002/                     <-- Second tree: REQ-002
>     ├── 📄 .git
>     │
>     ├── 📁 docs/requirements/
>     │   └── 📄 PRO-REQ-002_Multi_Exchange.md    <-- Edits happen here
>     │
>     └── 📁 src/
>         └── 📄 Arbitrage_Strategy_Engine.js     <-- Code implementation edits happen here
> ```
> 
> 
> #### Working on an architecture artifact
> use in `["ADR", "VS" ]`, the creation of empty REQ is accepted as side effect as long as they are not implemented in the working tree, you just create the connection. But they should be related otherwise that grouping does not makes sense.
> 
> When locking down a high-level strategic decision, you spawn a second tree named `ADR-003`. Because this defines the system's core architecture or wide rule.  This isolated tree acts as the perfect sandbox to force a clean-slate re-evaluation before merging anything to `main`. Considering edge cases, the context of the problem and how it impact the system to take the best possible decision.
> 
> ```
> 📁 projects/
> │
> ├── 📁 trading-bot-core/                    <-- Worktree #1 (Production Anchor: 'main')
> │   └── 📁 docs/architecture/
> │       └── 📄 PRO-ADR-003_runtime.md
> │
> └── 📁 trading-bot-ADR-003/                 <-- Second tree: ADR-003
>     ├── 📄 .git
>     └── 📁 docs/architecture/
>         └── 📄 PRO-ADR-003_runtime.md           <-- Obsidian edits happen here
> ```
> 
> #### Edge cases
> 
> ##### Dependent implementations 
> Two approaches to this challenge can be used. One is enforce by the system architecture the other must be carefully perform.
> ###### Ordered approach
> Both requirements need to modify a different section of the same file. Fortunately the current workflow handles a one by one approach gracefully by following the [Working on a requirement](#Working%20on%20a%20requirement) approach you create modify sync and then repeat by creating a new branch to keep working on the specific requirement implementation need. This ensure even file line changes are link to the requirement they belong and avoiding missing traceability when facing a concurrent modification.
> ###### Multi-Tree concurrent implementation
> This approach will need a maybe a variant of the script or a manual creation of the tree. This can increase the risk of a merge conflict but is the most viable option when you need to implement the logic of both requirements at the same time.
> 
> You have spawned two isolated secondary trees to work on distinct requirements simultaneously. Both requirements demand modifications to the exact same core files (`portfolio_optimizer.py` and `helpers.js`). You can switch between these features instantly just by changing directories, while `trading-bot-core` remains untouched.
> 
> > [!info] Guidelines: avoid a collapse of the pristine ledger
> > - Create two new trees
> > - Open two instances of the code editor, don't use the markdown renderer app instead modify the Artifact in the editor.
> > - Build as if the implementation of other `REQ` exists in the current folder
> > - Once the feature is done for one of the req probably the one on which the other depends the most
> > - Make ready to deploy commit on that complete implemented `REQ` 
> > - Sync with the main branch
> > - Use `git rebase origin/main` on the other `REQ`, this will lift up the current wip commits of the not finish `REQ`
> > - Complete the integration
> > - Make ready to deploy commit on that complete implemented `REQ` 
> > - Sync with the main branch
> 
> To work in the branches at the same time open to instance of the code editor in the two different folder
> 
> ```
> 📁 projects/
> │
> ├── 📁 trading-bot-core/                            <-- Worktree #1 (Production Anchor: 'main')
> │   ├── 📁 docs/requirements/
> │   │   ├── 📄 PRO-REQ-001_Real_Time_Feed.md
> │   │   └── 📄 PRO-REQ-002_Multi_Exchange.md
> │   │
> │   └── 📁 src/
> │       ├── 📄 portfolio_optimizer.py
> │       └── 📄 helpers.js
> │
> ├── 📁 trading-bot-REQ-001/                         <-- Second tree: REQ-001
> │   ├── 📄 .git
> │   │
> │   ├── 📁 docs/requirements/
> │   │   └── 📄 PRO-REQ-001_Real_Time_Feed.md        <-- IDE edit happens here
> │   │
> │   └── 📁 src/
> │       ├── 📄 portfolio_optimizer.py               <-- Code implementation edits happen here
> │       └── 📄 helpers.js                           <-- Code implementation edits happen here
> │
> └── 📁 trading-bot-REQ-002/                         <-- Third tree: REQ-002
>     ├── 📄 .git
>     │
>     ├── 📁 docs/requirements/
>     │   └── 📄 PRO-REQ-002_Multi_Exchange.md        <-- IDE edit happens here
>     │
>     └── 📁 src/
>         ├── 📄 portfolio_optimizer.py               <-- Concurrent code edits happen here
>         └── 📄 helpers.js                           <-- Concurrent code edits happen here
> ```
> 
> ## **3. The Consequences (Architectural Impact)**
> ***Impact***
> 
> >**Custom Script**
> > Creating the symlink connection and creating new trees and successfully unlinked them and relink the the main in the markdown editor wormhole can be automated, reducing friction of writing paths or a possible workflow step jump.
> > - Requires the creation of a script for the [Workflow](#Workflow) to automate its repetitive and error prone tasks <span hidden >@trace</ span>`REQ-023`<span hidden >@</ span>
> 
> >**Mandates a Git-Tree** usage for each developing and problem solving journey
> 
> 
> ***Positive Effects***
> 
> > **Semantic commits**
> >  The repository becomes self-documenting. Generating "release notes", "architectural change log" or revising the project evolution becomes a mathematical query:
> >  - `git log --grep="^type"`
> >  
> 
> > **Structural Bracket Identifier**
> > This makes it possible to audit the overall evolution of a specific requirement implementation or architectural decision over the project life by using  `git log --grep="[ID]"`. Ease the debugging process and version control navigation.
> 
> 
> > **Git-Tree**
> > - *Concurrent file work history collapse solution:* by using the git-tree the edge case of losing track of multi line edits that belong to different REQs in the same file is handled gracefully by the work tree capabilities
> > - *Dashboard blindness solution:*  Eliminates dashboard blindness by using the symlink connection
> 

## Analytical Breakdown

| **Problem Solving documentation** | **File**                                                                |
| --------------------------------- | ----------------------------------------------------------------------- |
| 2026-07-01                        | [TSO-ADR-008_Analytical_Breakdown](TSO-ADR-008_Analytical_Breakdown.md) |

@trace REQ-023 @
