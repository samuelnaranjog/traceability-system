---
Project: TraceabilitySystem
State: In Process
Priority: P0-Critical
Description: The system requires some rules and categories + single dev environment configurations. I need to find a way to integrate all this together to ensure the system is personalizable and resistant to cross-device sync
---

> [!info] 🏛️ TSO-ADR-010
>
> **Date of Decision:**  2026-08-04
>
> ***
>
> # *Connections*
>
> | Type                | Route                                                                                                                                                                     |
> | :------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
> | **📓 Requirements** | [TSO-SREQ-020D\_Self\_Healing Global\_Orchestrator\_&\_Operational\_Contract](<../requirements/TSO-SREQ-020D_Self_Healing Global_Orchestrator_&_Operational_Contract.md>) |
> | **🛠️ Utility**     | [build-synapse-working-data.util](../../src/core/utils/build-synapse-working-data.util.js)                                                                                |
>
> ***
>
> # **1. The Context (Systemic Problem)**
>
> ## ***Issue***
>
> ### The already integrated system-config
>
> Yes, the system was though to use this file to orchestrate the engines and add some rules to customize the system to each project needs, but also to the developer environment.
>
> #### The cross device sync problem
>
> Within this json the is a specific property that causes problems if set for all branches and devices
>
> ```
> {"gitWorkTreeScriptConfig":{"markdownEditorFolderPath":"/Users/s_n_gr/My Drive .../OBSIDIAN/Projects/Traceability_System"
> }
> ```
>
> If this property is set and sync across devices then the system will break completely when using the system in other device. But not synchronizing the `system-config.json` will also introduce friction and a critical vulnerability.
>
> ##### Sync dilemma
>
> If the file is `.gitignore` then each worktree or branch and each device must implement the system rules, this makes it incredible fragile and full of friction it will definitely end up breaking the `synapse-engine` or causing a massive refactor across the **artifacts** leading to a **polluted git leader**.
>
> However if it is sync then the  `"markdownEditorFolderPath"` property will be set and the `spawn` engine will not work in other devices.
>
> #### The traceability synapse engine integration
>
> Methods are currently optimized to access the spawn engine required data but not for the  `synapse-engine`. The question is how to allow the user to customize the **connections** categories the custom extensions or artifact prefixes and other key properties that transform the system in a highly unique and adaptable system addressing the specific needs of project.
>
> ### How the spawn engine creates it & updates it
>
> The other problem is that currently the `spawn engine` creates with a hard coded structure the `system-config.json` , but if i want this to work for the entire system I must set a schema globally managed so that it works in each of the individual engines.
>
> ## ***Propose Design***
>
> ### ==Local variable md editor path storage==
>
> All worktrees share a same `.git/config` that is local and own to each project, the system could stop depending in `"markdownEditorFolderPath"` within the `system-config.json` and instead relying only in the **git config** which is local and enable `system-config.json` to be store within the git history and shared across devices ensuring **Traceability System** consistency across all project branches trees and devices.
>
> ### ==System config properties==
>
> The synapse orchestrator should access the specific properties from the `system-config.json` that give each system its own custom behavior. While maintaining the hard coded regex constrains for the artifacts structure, extension extraction and other important instructions that should not be modified by the developer.
>
> # **2. The Decision**
>
> ## Local variable md editor path storage
>
> The **spawn engine** must intercept the symlink absolute path when the `-s` flag is used from the `.git/config` config instead of the `system-config.json` and if not present ensure the user provides an absolute path to the md editor and add it to the `.git/config`
>
> ## Hard coded system constraints
>
> The ensure the system remains reliable across different projects the system has some hard coded behavior provided by an internal **CONFIG**
>
> ### Artifact prefix and number regex extractor
>
> Selects artifact prefix and number from title (e.g., from `TSO-ADR-000` the regex will select `ADR-000`)
>
> ```js
> fileTitleIdentifierFilteringRegex: /\b[A-Z]+-\d+/, 
> ```
>
> ### Artifact human readable title
>
> Select the name based on the underscore "\_" convention given to the file
>
> ```js
> fileNameFilterRegex: /(?<=_)[a-zA-Z_]+/, 
> ```
>
> > [!info] Note
> > The artifact titles should start after the id using underscore `_` (e.g., `TSO-REQ-000_Some_Title.md`)
>
> ### Traceability keywords
>
> A connection is identify when the next keywords:
>
> * `@trace` to start declaring the connection
> * `@` to tell the engine the end of the connection declaration
> * I**n between the keyword**: the artifact declaration should look like the text the regex extracts here  [Artifact prefix and number regex extractor](#Artifact%20prefix%20and%20number%20regex%20extractor)  (e.g., to declare a connection  `right_dt.py` contains `@trace` `REQ-002` `@` the system will identify is connected to the `TSO-REQ-002_Title.md` artifact)
>
> ```js
> treaceabilityKeyWords: {start: "@trace", end: "@"},
> ```
>
> ## Editable system config properties
>
> The `system-config.json` must contain a property that allows the user to add specific system constrains and categories as sub properties for the `synapse engine` ensuring each project has its own custom categories, accepted artifacts, and files that should be filtered or shouldn't be connect.
>
> Specifically the **sub-properties** that enable this kind of system adaptability to each project are:
>
> ### Exclude List
>
> The folders or files that shouldn't be scanned because they don't have any meaningful connections and might be long such as `node_modules` or `package_lock.json`
>
> ```json
> "excludeList": [
>   ".gitignore",
>   ".git",
>   ".DS_Store",
>   "node_modules",
>   "README.md",
>   "package-lock.json",
>   "package.json",
> ]
> ```
>
> ### Accepted system artifacts
>
> This list of accepted artifacts will enable the `synapse-engine` algorithm to filter from the classification and construction of a connection lattice  injected. Only for the accepted ones a connection lattice will be build and inject.
>
> ```json
> {
> "acceptedSystemArtifacts": ["REQ", "ADR", "VS"],
> }
> ```
>
> > [!info] Note
> > The list determines which are the artifacts to which connections should be injected
>
> ### Classification guidelines - Dual-Vector Classification
>
> Define how the connections should be classified and what are the possible categories
>
> ```json
> {
> "artifactCategoryMap": artifactCategoryMap,
> "extensionCategoryMap": extensionCategoryMap,
> }
> ```
>
> #### Artifacts prefix based classification
>
> The user can enable classification based on artifact title prefixes e.g:
>
> *If artifactCategoryMap was the next json object*
>
> ```json
> {
> '📕 Architecture': ["VS", "ADR"],
> '📓 Requirements': ["REQ"],
> }
> ```
>
> ##### System behavior example
>
> This will make the system classify a connection from a md note that has VS or ADR into the architecture type `📕 Architecture`.
>
> For instance if `TSO-ADR-001_Title.md` contains `@trace` `REQ-002` `@` the system will create a table in the connections section within the `TSO-REQ-002_Title.md` file.
>
> The injected Markdown will dynamically group connections as follows
>
> | **Type**        | **Route**                                               |
> | --------------- | ------------------------------------------------------- |
> | 📕 Architecture | [TSO-ADR-001\_Title](../ReativePath/`TSO-ADR-001_Title) |
>
> > [!info] Note
> > The property is the classification category and value is an array with the artifact prefix without any number that is used in the title of the artifact.
>
> #### Extension prefix based classification
>
> The user can enable classification based on artifact title prefixes e.g:
>
> *If extensionCategoryMap was the next json object*
>
> ```json
> { 
> '⚙️ Core Logic (Backend/Systems)': ["js", "ts"], 
> '🎨 Client Layer (Frontend/UI)': ["py", "jsx", "tsx"], 
> '🛡️ Verification (Tests & Config)': ["test.js", "spec.ts"]
> }
> ```
>
> ##### System behavior example
>
> When the traceability engine detects a connection (e.g., `@keyword REQ-002 @` inside `pipeline.test.js`), it will process the matrix and inject a segmented table directly into `TSO-REQ-002_Title.md`.
>
> The injected Markdown will dynamically group connections as follows:
>
> | **Type**                              | **Route**                                                                                    |
> | ------------------------------------- | -------------------------------------------------------------------------------------------- |
> | **🛡️ Verification (Tests & Config)** | [pipeline.test.js](https://www.google.com/search?q=../../tests/pipeline.test.js\&authuser=2) |
>
> > [!info] Note
> > The property is the classification category and value is an array with the extension (i.e., `js`, `spec.ts`, ...).
>
> ### The header that defines the connection section
>
> Within the artifact notes to enable the `synapse-engine` to injected the Markdown with the categorized connections you must use a key header which defines the section where the Markdown should be injected. This give the choice to activate the header connection injection in a given artifact, however the template includes it by default.
>
> ```json
> connectionInsertionTitleRegex: /^connections?$/i
> ```
>
> > [!info] Note
> > The regex can be modify to inject in another custom header of preference but defaults to connections.
>
> ```md
> # Connections
> <!-- Toggles the connection injection & indicates (hey engine inject here!)-->
> ```
>
> # **3. The Consequences (Architectural Impact)**
>
> ***Impact***
>
> * Requires update of REQ-023 spawn engine to extract the symlink absolute path from the git config
>
> * Requires update of REQ-020 `synapse-engine` orchestrator to cleanly extract the `system-config.json` data that define the properties that customize the behavior of the `synapse-engine`. Leveraging utilities to craft the custom one that achieve the purpose of surgical data extraction.
>
> ***Positive Effects***
>
> > **Editable system config properties**
> >
> > * *Adaptability:*  the system can be customized to the project needs enabling adding extra artifacts, different categories, different file extension to be classified within different categories.
>
> > **Dual-Vector Classification**
> >
> > * *Zero Cognitive Friction:* A reviewer opening a REQ file instantly sees the exact state of the frontend, backend, and testing layers and other useful categories define by the user of the traceability system cleanly separated.
> >
> > * *Domain-Agnostic Extensibility:* If the project migrates to Rust or add a Go microservice, not rewriting of the parsing logic is necessary. Simply add `["rs", "go"]` to the `⚙️ Core Logic` array in the configuration contract. The core engine is **completely domain-blind**, allowing it to instantly scale across web development, hardware engineering, or data science repositories without a single code rewrite
