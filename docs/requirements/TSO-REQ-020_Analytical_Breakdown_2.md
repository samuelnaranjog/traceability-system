---
excalidraw-plugin: parsed
tags:
  - excalidraw
---
==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠== You can decompress Drawing data with the command palette: 'Decompress current Excalidraw file'. For more info check in plugin settings under 'Saving'



# synapse output style
```
[synapse] Firing neural pathways...
[synapse] Scanned 42 files across target trees.
[synapse] Updated 3 moved references -> [OK]
```

# NPM PACKAGES

- **`unified`**: The core state machine.
    
- **`remark-parse`**: Converts the Markdown string into an MDAST (Markdown Abstract Syntax Tree).
    
- **`remark-gfm`**: **Critical.** Adds support for tables, strikethrough, and autolinks.
    
- **`remark-stringify`**: Converts the mutated MDAST back into a clean Markdown string.
    
- **`unist-util-visit`**: A utility package that lets you safely walk the tree and find specific nodes (like `tableCell` or `link`) without writing messy recursive loops.

# connection Object Example
```
Data being store with neat references: {
      'ADR-001': [
        {
          name: 'MainCode.js',
          path: '/var/folders/_j/q23cy76175xfclczykz6j9g00000gn/T/traceability-test-p2IOAQ/src/MainCode.js'
        }
      ],
      'REQ-001': [
        {
          name: 'MainCode.js',
          path: '/var/folders/_j/q23cy76175xfclczykz6j9g00000gn/T/traceability-test-p2IOAQ/src/MainCode.js'
        }
      ]
    }
```

# state object example

```
Data being store with neat references: {
      'ADR-001': [
        {
          name: 'MainCode.js',
          path: '/var/folders/_j/q23cy76175xfclczykz6j9g00000gn/T/traceability-test-p2IOAQ/src/MainCode.js'
        }
      ]
     
    }
```

# Pseudo code - task
> [!todo] **Scenario:**
> `Precondition - Action - Execution Plan`
> 
> **Given** the `sypnaptic-state.json`, **When** .... , **Then**
- [x] Find the sypnaptic-state data 
- [x] Parse the sypnaptic-state
- [x] Within thhe lareddy built loop of the currentstate keys compare stategically: 

==sypnaptic-state includes current state key (artifat)==
- [x] **Classify Abstraction for already created connections artifacts**
- [x]  Extract file links
- [x] Extract sypnaptic-past-state file links
- [x] Extract current links & type (some sort of data streucture like map of urlkey and type and url as object, in key values)
	- [x] **Classify and conquer hard**
		- [x] Use a condition to define if in current, define if in past, You can use set.has *(it uses a hash table to look up so it takes O(1) a find the item)*
		- [x] Filter false ,false condition andd return the object type and data
		- [x] build an map of these of classification and url by adding  after each interaction ciondition check fulffilled 
	- [x] **Classify and conquer Default** 
	- [x] classify hard link and mutate the currentclasification **MAP**
	 - [x] Inject classification data into the calasifier method, handle the normal classification 


==For both scenarios==

- [x]  Take the mutated classification and build md table
- [x]  Overwirte the table with the new data.
- [ ] Write to the synaptic-state-json the finalized collected data. Making current be synapse and letting be garbage collect by the next run.


***Note:** After this you iterate over all files present in the current state. For place where only hard written links are wirtten is not neccesary to do anything but manually create the table tipy and link, later if some reference are added it will be handled gracefully* 


**Note:**. PLEASE CREATE AN ADR THAT EXPLAIN THE CONSTRAIN OF THE HEADER TO WRITE THE CONNECTIONS
```
# Workflow Closure & Collapse orchestrator
This feature ensures the git commit history remains clean from wips, and the closure when the development of a requirement is finished remains frictionless by automating git operations such as path finding, worktree and branch deletion. Leaving the workspace clean and ready to restart the workflow again for a new update or extra feature.

## How this engine works
Once the builder has complete the implementation, perform a final commit with all changes implemented and staged **When** the builder runs the command `collapse` within the worktree to finish the workflow, **Then** the ***engine*** should:

> 1. Merge the final commit to the main branch
> 2. The implementation of the requirement `wips` are preserved in the final commit squash.
> 3. The history has only one commit with the wip changes
> 4. The merge is complete successfully 
> 5. Delete the worktree & branch once the commit is present in the main branch to ensure no data is lost and the req name is availability for future implementations
> 6. Unlink the symlink connection of the markdown editor for the specific docs folder and link to the `main` docs tree

## The engine in action
```

```
git add . git commit -m "wip: [REQ001] Adding some changes"
```

```
feat(trace): [REQ-002] Collapse functionality is. on fire!!!
```

# REQ connected list

### Target 2: `PRO-REQ-001_Create_Data.md`

These files will contain a reference/link pointing to the Create Data Requirement:

- `docs/architecture/PRO-ADR-001_Microkernel.md`
    
- `tests/pipeline.test.js`
    
- `docs/comparisons/PRO-VS-002_GraphQL_VS_REST.md`

# REQ Inner file data
```
`---

Project: null

Status: null

Priority: null

Description: null

---
# Connections
  

# Acceptance Criteria

  
  

---

###### Links:
@trace ADR-001 @

  

###### Reference :`
```
# ADR connected list
### Target 1: `PRO-ADR-001_Microkernel.md`

These files will contain a reference/link pointing to the Microkernel ADR:

- `docs/requirements/PRO-REQ-001_Create_Data.md`
    
- `src/core/pipeline.js`
    
- `prototypes/01_proof_of_concept.py`

# ADR Inner file data
```
---

Project: TraceabilitySystem

State: Approved

Priority: P0-Critical

Description:

---

> [!info] 🏛️ TSO-ADR-002 : Symlinks

> **Date of Decision:** 2026-06-04

>

> ---

> ## *Connections*

>

>

> ---

> ## **1. The Context (Systemic Problem)**`;
> @trace <REQ-001> @
```

# Pseudo Code TEST
 > [!todo] **Scenario:**
> `Precondition - Action - Execution Plan`
> 
> **Given** .... , **When** .... , **Then**
- [ ] Build the folder structure as follows 
```
* * root/

* ├── docs/

* │ ├── architecture/

* │ │ └── PRO-ADR-001_Microkernel.md
		PRO-ADR-002_Micro_Connection.md 

* │ ├── comparisons/

* │ │ └── PRO-VS-002_GraphQL_VS_REST.md 

* │ └── requirements/

* │ └── PRO-REQ-101_Data_Ingestion.md

* PRO-REQ-001_Create_Data.md

* PRO-REQ-002_Print_Money.md -->> Should have hard written link

* ├── prototypes/

* │ └── 01_proof_of_concept.py

* ├── src/

* │ ├── core/

* │ │ └── pipeline.js

* │ └── ui/

* │ └── dashboard.jsx

* ├── tests/

* │ └── pipeline.test.js

* └── README.md
> @trace <REQ-001> @
```

# Pseudo Code TEST

> [!todo] **Scenario:**`Precondition - Action - Execution Plan`
> ****Given** .... , **When** .... , **Then**

- [ ] Build the folder structure as follows

```
* * root/

* ├── docs/

* │ ├── architecture/

* │ │ └── PRO-ADR-001_Microkernel.md
		PRO-ADR-002_Micro_Connection.md 

* │ ├── comparisons/

* │ │ └── PRO-VS-002_GraphQL_VS_REST.md 

* │ └── requirements/

* │ └── PRO-REQ-101_Data_Ingestion.md

* PRO-REQ-001_Create_Data.md

* PRO-REQ-002_Print_Money.md -->> Should have hard written link

* ├── prototypes/

* │ └── 01_proof_of_concept.py

* ├── src/

* │ ├── core/

* │ │ └── pipeline.js

* │ └── ui/

* │ └── dashboard.jsx

* ├── tests/

* │ └── pipeline.test.js

* └── README.md
```

- [ ] Inside the files that are connected two one of the artifact create the connection using `@trace` &lt;Artifact identifier + numbers in middel&gt;`@`. E.g: @trace <REQ-001> @ will connect the current file with the artifact.

- [ ] write the inner data for each of the artifacts. ==What then is going to be done with the data== *Note: Now its time to ensure that:*

- [ ] first it is bulding the md table

- [ ] then we should check if it handles gracefully the hardwritten links ==Clean the folder==

# Hard written table

```REQ-002
---
Project:
Status:
Priority:
Description:
---

## Connections
| Type                              | Route                                                                                                                              |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **🎨 Client Layer (Frontend/UI)** | [UI Data](https://www.figma.com/design/mAdsajylnUWeHLKTavrBCu/Animations-For-Traceability-System?node-id=1-2&t=v11GNWvUQ0tpON6J-4) |
## Acceptance Criteria


--- 
###### Links: 

###### Reference :
```

# connections to req 002

### Connection to REQ-002

- `PRO-ADR-001_Microkernel.md`

  - **Connection:** Establishes the core plugin architecture and extension interfaces needed so that the execution logic in `PRO-REQ-002` can safely run isolated modules.

  - **Relative Path:** `../requirements/PRO-REQ-002_Print_Money.md`

- `PRO-ADR-002_Micro_Connection.md` *(Hard-written link)*

  - **Connection:** Explicitly documents the socket communication protocol and real-time network throughput required to handle the transaction volume specified in `PRO-REQ-002`.

  - **Relative Path:** `../requirements/PRO-REQ-002_Print_Money.md`

- `01_proof_of_concept.py`

  - **Connection:** Acts as the standalone Python mathematical prototype validating the core algorithm before implementing the production rules outlined in `PRO-REQ-002`.

  - **Relative Path:** `../PRO-REQ-002_Print_Money.md`

- `pipeline.js`

  - **Connection:** Implements the production JavaScript data orchestration pipeline, reading input streams generated by `PRO-REQ-001` and executing the final logic defined in `PRO-REQ-002`.

  - **Relative Path:** `../../PRO-REQ-002_Print_Money.md`

# Classification guidelines for hard link tests

```js
const artifactCategoryMap = createCategoryLookupMap({
  "📕 Architecture": ["VS", "ADR"],

  "📓 Requirements": ["REQ"],

  "🧪 Prototypes": [],
})

// Build Extension Lookup Map

const extensionCategoryMap = createCategoryLookupMap({
  "⚙️ Core Logic (Backend/Systems)": ["js"],

  "🎨 Client Layer (Frontend/UI)": ["py"],

  "🛡️ Verification (Tests & Config)": ["test.js"],
})


```

# system-config Synapse engine integration

> [!todo] **Scenario:**`Precondition - Action - Execution Plan`
> ****Given**the engine is run , **When** .... , **Then**

- [x] Set up the centralized object with default values

- [x] Create a util that handle the config creation for both systems

- [x] Validate the config presence

- [x] Add default config data if not config present

- [x] Validate the schema using yup for data presence

- [ ] if OK and the config JSON data to the **CONFIG**

- [ ] Use the worktree method to extract the worktree path and run the synapse engine over it path to extract

# Excalidraw Data

## Text Elements

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

The 3-Way Link Merge ^MrJ1A2zD

IN: List of connection ^0j1WZgFF

OUT: Updated list of connection and hard link remianing ^MYO9ZNSQ

.refactor-state.json ^ry5Obfrz

A hidden json base of date for the old state of the system links ^F5EYZc32

The copy in memory of the current state of the connections ^PEk5gFkO

AST parser for insertion of link within the table without errors ^GenuIUPW

If a link is not in the past nor in the current then it is a hard link so it should be kept ^AF0BEidc

Update the markdowns ^xif9BFnY

artifactRelatedTofiles... ^xENrqykL

TODO update the search to exclide "analytical_Breakdown followed by numbers" ^xBPyZMjN

This data structure hold the data of the files related. This data should be written after each case ^8eUwNDU3

Hard Written Connection Support Pseudo Code ^KQFvCLDn

Visual connections ^gQBkDLIJ

Step by step implementation ^FjUm8AAl

Copy in memory ^5vJaIUfJ

This data structure holds the data of the artifacts related within the files that reference them. This data should be written in a hidden json after each case ^o2oYIijl

artifactRelatedTofiles... ^WTemzZlR

Json data storage ^Tdb2n3oG

Ensure data persitence ^0BcHfH8Q

A hidden json base of date for the old state of the system links ^eeAERbrd

.refactor-state.json ^DjiohtqY

AST parser insertion ^ATDNOI2j

To ensure surgical injection of the data in the table use the AST parser to inject the table data dinamically. ^Q1NwaCdC

Otherwise i would have to store the link in another structure and put it again there. However if i do AST I can trasverse check if there exists a connection if that connection is present in the current state temporarely stored then it should be kept, if not i current nor in past state it is hard and shoudl be kept. But if it existed in past but not in current then it should be deleted. Howver if it exists in present but not in past it should be added ^lxngpkqc

OUTPUT suggestion ^Y7PuVKYQ

There is and edge case where if the system is empty it will discart the file and table creation, so for this you might need to trigger a self reference to keep the harcoded link ^AtuqXjGx

artifactRelatedTofiles... ^9qIhro5P

Includes ^8kXTyafd

Loop that takes artifact related to file, Using its keys to iterate and organize and insert data ^UPPv25PC

Loop [keys] of key ^rfpUh3mx

Create a list of keys from the state.jsons ^xSBJNYRN

lastRFeKeysArr ^6RlcXMHU

Keys ^9X8WzHHL

Key ^UkrUmLBs

lastRFeKeysArr ^PwkoMMEb

if ^Pa0w8agZ

ParsedStateJSON... ^m39JAjHT

Otherwise i would have to store the link in another structure and put it again there. However if i do AST I can trasverse check if there exists a connection if that connection is present in the current state temporarely stored then it should be kept, if not i current nor in past state it is hard and shoudl be kept. But if it existed in past but not in current then it should be deleted. Howver if it exists in present but not in past it should be added ^IRDUhS9P

Is the connection present ^1xZl2yFF

Time to perform a comparison between current artifact related to files vs .refactor-state.json ^sTwunk0n

Handle the case where there is a new not existing previously reference to that artifact array of connected nodes. Meaning no comparison can be performed ^K92G5eYo

currentArtifactPath ^4a1KCAhU

findArtifactFile() ^RibbqxcE

- Read file
- Map the AST link in specific section
- Extract its links
- Compare current state with past state
- use two booleans to determine what case you must face ^VjS87vLM

Is not in current, not in past state ^kMrd1eU9

Is present in current, not in past state ^zexFAucb

Should be kept (HARD LINK) ^ueg26vDM

Should be deleted (Modify not present connection) ^mAIRdpg6

Is present in current, not in past state ^glFIPS35

- Should be added (NEW CONNECTION)
- Use AST surgical addition ^16fSd0XS

Is not in current, not in past state ^HlNHL8AR

Should be kept (NOT CHANGED CONNECTION) ^uWSU150b

NOTES ^KsKPoYRJ

currentArtifactClassifiedconnection() ^mmUPFKJt

Should be modify to handle AST, therefore it must handle the creation case and the addition case surgically ^v26qBxxf

! lastRFeKeysArr ^dPuUp2SU

Or simple else ^8RTHtAFb

Includes ^osCpQVJO

if ^cH7Sh73m

Key ^gjeFJdf8

newArtclassify-&gt; firstClassify&HandleHardLink(artifactRelatedTofiles.key) ^GK6hPU4x

- Read file
- Map the AST links in specific section
- Extract its links ^PLxwbt0u

Is link &gt; 0 ^dyQD1kQB

- Find the specific type where it is classified: contains(${classification})
- Add it in that specific classification ^63q6pM5g

tempClassifiedStructure ^kJbMPNmn

tempClassifiedStructure ^0aVT9NI6

Perform normal classification as usual ^KqdBJjP3

newTable-&gt; buildMarkdownConnectionTable(new classification) ^RMwZdEJf

if #. 1 ^G7qFMdQW

else ^5rKx6TiT

Is not in current, not in past state ^A32Nls63

urlComparison() ^kqhnEzHe

[current, past] ^NiVEVqtF

METHOD Classify&Conquer() ^SlLRYhMx

Loop [keys] of key ^n1kVs9lr

- Find the specific type where it is classified: contains(${classification})
- Add it in that specific classification ^mRUax72V

Is not in current, not in past state ^rjkDwTab

tempClassifiedStructure ^Jvq5LBxx

This tree are handle by the same rebuild algorithm ^Gc9T017P

Perform normal classification as usual ^gWUkgF8K

Is present in current, not in past state ^aCuZI4iE

Is present in current, not in past state ^WH9JvYEL

Hard Written Connection Support Pseudo Code With cleaner variation #2 ^GRHFT2jb

Visual connections ^s7JWKmYb

Step by step implementation ^lsenZXEx

It is handdle gracefully by the same mehtos start and already startedd table ^F88VrMUh

Includes ^lsMzjxVv

Includes ^0A5NAKQU

METHOD Classify&Conquer() ^oPDeFIlE

lastRFeKeysArr ^Wo9HJfS1

! lastRFeKeysArr ^flIbQLFm

Loop [keys] of key ^ag16yKAt

if ^Oh9BYIg4

Or simple else ^kv1S6d33

if ^dqMgQ3AV

Time to perform a comparison between current artifact related to files vs .refactor-state.json ^IrUV8ADd

Handle the case where there is a new not existing previously reference to that artifact array of connected nodes. Meaning no comparison can be performed ^D9sVu4wr

Is the connection present ^aLmDnby3

- Read file
- Map the AST link in specific section
- Extract its links -Build 3 sets
- Compare 3 states presence
- Based on the output build an array of hard links objects with type classification tag ^eUnEHQJI

Key ^soJvwOvd

Key ^qmo7ddBw

handle the addition ^sfUuxKbr

METHOD ClassifierMutator() ^Ei7AmOQE

Might take the object to mutate and hard links ^O8RHuzDa

Use object to classify the current state references ^3lckvBdp

is object hard links ^gHTO59dF

- surgically inject hard links within classification ^OgHk5Dzt

is in 3 ^ggbF3bi7

use AST & extract an object with links and the classification to which each link belongs ^VMzdyusg

use AST & extract an object with links and the classification to which but. klaverage a built mapped of those ^rXEydye1

TEST ^OYianh17

Build ADR with connections ^szZaLQt2

Build REQ with connection ^IjShmkwC

Structure data that enables the connection wirting ^XRBj34dV

REQ-001 ^bE6Rw4gn

ADR-001 ^3QlSejqG

Inner file data ^TnB5cZKq

Files connected list ^9XWUc8jm

Files connected list ^l8ByJOub

Inner file data ^ESJUe7Ut

Pseudo Code ^qUK7YZ1L

SET UP Instructions ^s8GmFneu

Rquirements:

- I need hardcoded Links in one of the REQs or ADRs ^onGCOu7Q

What the enviroment should have to handle the edge cases testing ^OG2drgVs

Edge cases ^uLT3YbGP

State:

- Artifact with hard link
- No .synapse-state.json yet First run ^jTmaFoTi

handles Edge case:

- First system run
- Hand written table, with hardcoded link ^Iqymy8s3

handles Edge case:

- System &gt;1 run
- Hand written table, with hardcoded link
- Extracting data from md table with multiple data ^1yGYT581

State:

- Artifact with hard link
- .synapse-state.json already created ^VkPxRsRg

Must implement state overwirtting ^2eXjBpfC

State:

- Artifact with hard link
- Files connections already there
- .synapse-state.json already created ^HghQPYnE

handles Edge case:

- System &gt;1 run
- Hard written link, over automatic generated table ^ZPEUrOBz

Hard written checks ^DWgqgYM0

System behavior ^cbkKDUUo

State:

- Artifact with hard link
- Files connections already there ^rK4gbGVf

handles Edge case:

- created the table in a mathematical order ^6VTIccZh

handles Edge case:

- writes to all artifacts with expected connections ^0UwGPi6s

State:

- Artifact with hard link
- Files connections already there ^NaIpCKP6

Configuration Contract ^zklf3KcX

State:

- No system-config.json ^eCjmGH7i

handles Edge case:

- The system must populate the config and create it
- The system must not collapse with the auto creator of the spawn and closure engines ^1HEAvwNj

The git exceptions ^8ycfoQ8l

State:

- No git repo ^dUQANAk8

handles Edge case:

- The system must ask the user to set up the git repo ^r3OsvBTk

Regex Matcher ^YhrpEX4j

Path resolver ^Sj0iuquN

State:

- writting the md table ^AujZSTrq

handles Edge case:

- Resolve with proper relative links ^R1K0hajM

State:

- scanning the repo completely ^RMWkw842

handles Edge case:

- The properly identify the connections ^IxSXROMo

Unitary type ^G5SK2NpZ

e2e. Shoudl be test in real environment ^g98vKxqx

Unitary type ^Zn9PL6PM

Unitary type ^0fKYyDqt

Double run without and with hardlink ^COUAXnPX

Double run. In second add dinamycally the manual data ^5MPzIaxE

Add default hard written table ^YxRwQHyN

Add this link in hard written table ^XdV10RXM

[UI Data](https://www.figma.com/design/mAdsajylnUWeHLKTavrBCu/Animations-For-Traceability-System?node-id=1-2&t=v11GNWvUQ0tpON6J-4) ^9qoKtpqF

Over REQ 002 ^1MvWfjni

Write some files to point here. From the same category ^OYNoUf7H

Data ^QqyuS4oz

Files connected list ^lkwdcnNC

Classification Guidelines within the system-config for hardlink tests ^D2XB9euH

✅ ^p48iWmei

Creating the config contract and user enable features ^JythOLXW

Laverage built in similar implementations ^79Xy8xA0

Laverage config presence checking ^bC2ZQDLL

validateConfigPresence() ^dKw3RI6d

Repo structure intialization thorugh npm ^5kFXttRE

Set up a JSON centralize schema when creating the config file ^ytN8PMKY

Use that json the add the data to the config file ^H90GfZag

Laverage and modify ^g3PNiY6F

createConfigFile() ^qlpbpCXU

setUpPropertiesOfConfig() ^LB64Z4cA

So that it support modification accross any property of the config ^doWDAoCP

Laverage and modify ^PpMEIpHx

This is a new REQ ^wESV10pn

What to implement ^3njRT49V

For the REQ-023 spawn engine that set the path make a modification ^EoqwtGd8

Visual Code ^W1adVOeL

Pseudo Code ^A2Yf0A85

validateConfigPresence() ^BrdKYgoH

System integrity status check ^FMjEPrJ9

Synapse Engine create config ^R1KvHH06

Spawn Engine create config ^0ATDxq6x

Centralized Default Schema ^BbTx40OM

traceabilityPipelineRun() ^fZQ7jLJD

yupValidationSchema("synapse", systempConfigdata) ^BQJmahXb

Exit Halt ^48slT8dM

Provide Config Contract invalid format (Only for synapse engine property) ^dWs6tC6K

JSONdataExtractor&parser() ^zUgwuvv0

systemStatus ^ewZOSXAI

Extract the system-config data ^ZGdY8vdQ

[isConfig, path] ^uV0IDGG5

if !isConfig ^mtAro2yw

createConfigFile() ^RZyKGFeI

Modify to pull from the centralized default schema ^rP2LeM1Q

systemConfigData ^Gge3nPc5

if !systemStatus ^srBdgFCr

Explain what is wrong format invalid and what to add ^bcJM7Nhy

CONFIG: ^mBhXx3GO

systemStatus.hghslds ^eFjkdGcE

systemStatus.hghslds ^FCFUaWde

systemStatus.hghslds ^eQ3Gzaf4

systemStatus.hghslds ^cJRo0y5x

Key ^rd3kWARo

Key ^LBDe7fPA

Key ^QwvxbKCP

Key ^GAwgopld

## Element Links

o9ipspm1: [[Projects/Traceability_System/docs/requirements/TSO-REQ-020_Analytical_Breakdown_2.md#synapse output style]]

hxzn0dSk: [[Projects/Traceability_System/docs/requirements/TSO-REQ-020_Analytical_Breakdown_2.md#NPM PACKAGES]]

v11mlu3K: [[Projects/Traceability_System/docs/requirements/TSO-REQ-020_Analytical_Breakdown_2.md#connection Object Example]]

EmqMs8A2: [[Projects/Traceability_System/docs/requirements/TSO-REQ-020_Analytical_Breakdown_2.md#state object example]]

8zKQJSLE: [[Projects/Traceability_System/docs/requirements/TSO-REQ-020_Analytical_Breakdown_2.md#Pseudo code - task]]

59tWqxj4: [[Projects/Traceability_System/docs/requirements/TSO-REQ-020_Analytical_Breakdown_2.md#REQ connected list]]

IRpptdYI: [[Projects/Traceability_System/docs/requirements/TSO-REQ-020_Analytical_Breakdown_2.md#ADR connected list]]

YTMoetZe: [[Projects/Traceability_System/docs/requirements/TSO-REQ-020_Analytical_Breakdown_2.md#ADR Inner file data]]

7xawiQwf: [[Projects/Traceability_System/docs/requirements/TSO-REQ-020_Analytical_Breakdown_2.md#REQ Inner file data]]

0UZMero2: [[Projects/Traceability_System/docs/requirements/TSO-REQ-020_Analytical_Breakdown_2.md#Pseudo Code TEST]]

RG3p6dQ2: [[Projects/Traceability_System/docs/requirements/TSO-REQ-020_Analytical_Breakdown_2.md#Hard written table]]

S9Iyrbrd: [[Projects/Traceability_System/docs/requirements/TSO-REQ-020_Analytical_Breakdown_2.md#connections to req 002]]

U4GsDi6H: [[Projects/Traceability_System/docs/requirements/TSO-REQ-020_Analytical_Breakdown_2.md#Classification guidelines for hard link tests]]

10hgAcEE: [[Projects/Traceability_System/docs/requirements/TSO-REQ-020_Analytical_Breakdown_2.md#system-config Synapse engine integration]]

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=
```
%%