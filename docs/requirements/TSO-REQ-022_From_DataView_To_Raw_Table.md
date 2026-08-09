---
Project: TraceabilitySystem
Status: 1-Backlog
Priority: P1-High
Description: Turn DataView into functional raw markdown table for GitHub and IDE high quality open source navigability through the docs
---

# Connections

| Type         | Route                                                                                                                                                                                                                                                                                                 |
| :----------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **📂 Other** | [Architecture MOC (JS templater)](<../assets/templates/Architecture MOC (JS templater).md>)<br />[Requirements MOC (JS templater)](<../assets/templates/Requirements MOC (JS templater).md>)<br />[Vertical Slicing MOC (JS templater)](<../assets/templates/Vertical Slicing MOC (JS templater).md>) |

## Story

> [!abstract] User Story
> `User type - Action - Output`
> **As a** Builder or reviewer,
> **I want to** trigger different markdown MOC(Maps of content) tables,
> **So that**  I can navigate through Github and IDE, while getting a big picture of the project

# Acceptance Criteria

> [!success] **Scenario:** Templater Table Print
> `Precondition - Action - Outcome`
>
> **Given** `Dataview` & `Templater Plugins` are install the js templates have been crafted and are in an accessible folder , **When** I trigger `cmd + p` and select `Open insert template modal` and select one of the 3 JS template , **Then** a big picture table is printed within the MOC note

***

## References

* **Implements:** @trace @
* **Depends On:** @trace REQ-021 REQ-001 @
* **Parent:** @trace @

***

## PKB References
