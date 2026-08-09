---
Project: TraceabilitySystem
Status: 4-Done
Priority: P1-High
Description: Implement git configuration interaction and the system config integration into the engine
---

# Connections

| Type                                  | Route                                                                                                                                                                    |
| :------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **⚙️ Core Logic (Backend/Systems)**   | [save-system-config.script](../../src/scripts/save-system-config.script.js)<br />[SpawnEngine](../../src/core/dev-workflow/SpawnEngine.js)                               |
| **🛡️ Verification (Tests & Config)** | [SpawnEngine.e2e.test](../../test/e2e/SpawnEngine.e2e.test.js)                                                                                                           |
| **🛠️ Utility**                       | [config-file-operations.util](../../src/core/utils/config-file-operations.util.js)<br />[git-config-operations.util](../../src/core/utils/git-config-operations.util.js) |

# Acceptance Criteria

> [!success] **Scenario A:** Access project prefix
> [!success] **Scenario A:** Access project
> `Precondition - Action - Outcome`
> \*\***Given** the git repository is `init`  & the `spawn` hasn't been run for the first time ; **When** the `spawn-engine` is run and tries to access the project prefix to set up the folders storage ; **Then** the system should:
>
> 1. Build a default config if not created
> 2. Ask the builder for the project prefix
> 3. Add the project prefix to the config
> 4. Commit the config changes
> 5. Perform successfully the branch and tree creation from the main state.

> [!success] **Scenario B:** Git config interaction
> `Precondition - Action - Outcome`
>
> **Given** the git repository is `init`  & the `spawn` has run > 1 time or already go through the initial set up  , **When** the flag `-s` is added in the command call (e.g, `spawn req023 -s`) , **Then** the engine should:
>
> 1. Access the git config and look for the md editor path
> 2. Ask the user the intended location if not present
> 3. Add it to the git config (this enables the cross device sync since the path is local for each device)
> 4. Create a symlink connection based on the git config stored path

> [!todo] **Scenario C:** Storing the modify data in the config
> `Precondition - Action - Outcome`
>
> **Given** the config has been modified through  the JSON , **When** the user will finish the tree implementation and triggers `sys-save` , **Then** the system-config current state is staged and commit.

## Analytical Breakdown

| **Problem Solving documentation** | **File**                                                                        |
| --------------------------------- | ------------------------------------------------------------------------------- |
| 2026-08-07                        | [TSO-SREQ-023C\_Analytical\_Breakdown](./TSO-SREQ-023C_Analytical_Breakdown.md) |

***

## References

* **Implements:** @trace ADR-010 ADR-012 @
* **Depends On:** @trace SREQ-023A @
* **Parent:** @trace REQ-023 @

***

## PKB References
