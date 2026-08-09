## 📓 **Requirements (REQs)**

```dataview
TABLE WITHOUT ID 
  regexreplace(file.name, "^.?-(\d+)_.", "$1") AS "ID", 
  link(file.path, regexreplace(file.name, "^.*?\d+[_ \-]*", "")) AS "Requisite", 
  Description 
FROM "Projects/Traceability_System/docs/requirements" 
WHERE contains(file.name, "TSO-REQ") 
  AND !regexmatch(".*Analytical_Breakdown(?:_\d+)?(?:\.md)?", file.name) 
  AND status != "5-Deprecated" 
SORT regexreplace(file.name, "^.?-(\d+)_.$", "$1")
```

--- 
@trace REQ-