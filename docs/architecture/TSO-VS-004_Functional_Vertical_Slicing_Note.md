---
Project: TraceabilitySystem
State: Complete
Description: Feature development connecting layers of the architecture to deliver one fully functional feature end-to-end. Specifying connections to ADRs & REQs
---

## Connections

| Type                | Route                                                                                                                                                                                                                                                                               |
| :------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **📓 Requirements** | [TSO-REQ-017\_Vertical\_Slicing\_Note\_Structure\_Template](../requirements/TSO-REQ-017_Vertical_Slicing_Note_Structure_Template.md)<br />[TSO-REQ-021\_Vertical\_Slicing\_MOC\_Template\_&\_Properties](../requirements/TSO-REQ-021_Vertical_Slicing_MOC_Template_&_Properties.md) |

## Diagram

```mermaid
graph TD
MOC[Maps of Content for the project -MOC-]
MOC --- ADRs(ADRs DataView)
ADRs --> VSnote[ Vertical Slicing Note ]
VSnote --- connections(Connections)
VSnote ---  diagram[Diagram]

```
