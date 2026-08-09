---
Project: TraceabilitySystem
State: Complete
Description: All requirements related with the REQ note, each component
---

## Connections

| Type                | Route                                                                                         |
| :------------------ | :-------------------------------------------------------------------------------------------- |
| **📓 Requirements** | [TSO-REQ-003\_Requirements\_Structure](../requirements/TSO-REQ-003_Requirements_Structure.md) |

## Diagram

```mermaid
graph TD

KanBR[Kanban Board REQs] --> |For state visualization| REQs[REQs]

%% REQ Artifacts
REQs[REQs] -.- traceability(Traceability properties for Kanban & MOC)
REQs[REQs] -.- AutoConnections[Connections]
REQs[REQs] -.- UserStory[User Story]
REQs[REQs] -.- AcceptanceCriteria[Acceptance Criteria]
REQs[REQs] -.- AnalyticalBreakdown[Analytical Breakdown]
REQs[REQs] -.- |Private Links| Links[Private links & reference to the Knowledge base]

```
