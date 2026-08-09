---
Project:
State: In Process
Description:
---

# Connections

| Type                | Route                                                                                                      |
| :------------------ | :--------------------------------------------------------------------------------------------------------- |
| **📕 Architecture** | [TSO-ADR-003\_Global\_Functional\_File\_Connection](TSO-ADR-003_Global_Functional_File_Connection.md)      |
| **📓 Requirements** | [TSO-REQ-020\_Automatic\_Connections\_Engine](../requirements/TSO-REQ-020_Automatic_Connections_Engine.md) |

# Diagram

```mermaid
graph TD

%%Var definition
FileSelectionHelper(FileSelectionHelper)
PathExtractionHelper(Connections Mapping Function)

artifactPath(Find artifact path)
classifyConnection(Classify the connections of the artifact)

writeConnectionsToArtifact(write connections to artifact)

buildMDTable( Build MD Table)

%%Data structures
filesArray[(Files Array)]

artifactRelatedToFiles[(artifactRelatedToFiles Object)]

currentArtifact[(Current Artifact)]


%% Where is config data passed
config[(CONFIG data)] --- FileSelectionHelper
config --- PathExtractionHelper
config --- artifactPath
config --- buildMDTable
config --- writeConnectionsToArtifact

%%Data pass to be stored
FileSelectionHelper --> |Populates| filesArray 

PathExtractionHelper --> |Populates| artifactRelatedToFiles

%% How is that data used
currentArtifact --- artifactPath
artifactRelatedToFiles --- artifactPath

currentArtifact --> classifyConnection
artifactRelatedToFiles --> |Artifact connections| classifyConnection 

%%Clasified data is passed into create table

classifyConnection --> buildMDTable

%%Wirte connections
artifactPath --> writeConnectionsToArtifact
currentArtifact --> writeConnectionsToArtifact
buildMDTable --> writeConnectionsToArtifact

%%Connections mapping
filesArray --> PathExtractionHelper(Connections Mapping Function)
```
