---
Status: 4-Done
Priority: P1-High
Project: TraceabilitySystem
Description: Where can be my problem solving algorithm placed at and how it should behave
---

# Connections

| Type         | Route                                                                                                                                                                                                                                                                                            |
| :----------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **📂 Other** | [Analytical Breakdown Template (visual template)](<../assets/templates/note-templates/Analytical Breakdown Template (visual template).md>)<br />[Analytical Breakdown files traceability (template)](<../assets/templates/note-templates/Analytical Breakdown files traceability (template).md>) |

# Story

> [!abstract] User Story
> `User type - Action - Output`
> **As a** Builder,
> **I want to** use a thinking framework to ease problem solving (A problem solving algorithm or operational procedure) whose structure is defined for consistency and aesthetic.
> **So that**  I can determine the most optimal solution and the file that contain the *analytical breakdown* serves as documentation of the REQ nuances, solution, approach to edge cases and my own thinking process.

## Acceptance Criteria

> [!success] **Scenario A:** Artifact visual template
> `Precondition - Action - Outcome`
>
> **Given** a new **note** for problem solving is created with the correct title and this note is empty, **When** the builder clicks `cmd + m` and `Analytical Breakdown template (TSO visual template)`\*\* is selected, also `cmd + p` and ![[Screen Shot 2026-06-02 at 9.15.50 AM.png]] .... , **Then** the visual problem solving structure should be shown and ready to guide you problem solving approach ![[Screen Shot 2026-06-02 at 9.16.53 AM.png]]

> [!success] **Scenario B:** Artifact traceability
> `Precondition - Action - Outcome`
>
> **Given** Builder had created the Analytical Breakdown artifact , **When** `cmd + m` clicked and **`Analytical Breakdown files traceability (TSO template)`** is selected, **Then** the table for traceability of problem solving files is inserted and ready to add files to it

## Analytical Breakdown

| **Problem Solving documentation** | **File**                                 |
| --------------------------------- | ---------------------------------------- |
| 2026-06-02                        | [[TSO-REQ-013\_Analytical\_Breakdown]] |

***

## References

* **Implements:** @trace  @
* **Depends On:** @trace  REQ-003  @
* **Parent:** @trace  @

***

## PKB References

* [[(Literature) Creating the Ultimate Traceability system for my own solo dev methodology]]
