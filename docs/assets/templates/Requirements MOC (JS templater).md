@trace REQ-022 @
<%*
const dv = app.plugins.plugins.dataview.api;
const currentPath = tp.file.path(true);

function getRelativePath(fromPath, toPath) {
  const fromParts = fromPath.split('/').slice(0, -1);
  const toParts = toPath.split('/');
  
  let i = 0;
  while (i < fromParts.length && i < toParts.length - 1 && fromParts[i] === toParts[i]) {
    i++;
  }
  
  const up = Array(fromParts.length - i).fill('..');
  const down = toParts.slice(i);
  const rel = [...up, ...down].join('/');
  
  return rel.startsWith('.') ? rel : './' + rel;
}

const headers = ["ID", "Requisite", "Description"];

const rows = dv.pages('"Projects/Traceability_System/docs/requirements"')
  .where(p => 
    p.file.name.includes("TSO-REQ") && 
    !/.*Analytical_Breakdown(?:_\d+)?/.test(p.file.name) && 
    p.status !== "5-Deprecated"
  )
  .sort(p => {
    // Extract ID numerically for accurate sorting
    const match = p.file.name.match(/-(\d+)_/);
    return match ? Number(match[1]) : 0;
  })
  .map(p => {
    const relPath = getRelativePath(currentPath, p.file.path);
    
    // Extract string ID for the table
    const idMatch = p.file.name.match(/-(\d+)_/);
    const id = idMatch ? idMatch[1] : ""; 
    
    // Strip everything up to the first sequence of digits and separators
    const displayName = p.file.name.replace(/^.*?\d+[_ \-]*/, "");
    
    return [
      id,
      `[${displayName}](<${relPath}>)`,
      p.description || p.Description || ""
    ];
  });

tR += dv.markdownTable(headers, rows);
%>
