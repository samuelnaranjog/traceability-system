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

const headers = ["ID", "State", "Vertical Slicing Documentation", "Description"];

const rows = dv.pages('"Projects/Traceability_System/docs/architecture"')
  .where(p => p.file.name.includes("VS") && p.status !== "5-Deprecated")
  .sort(p => Number(p.file.name.replace(/^.*?-(\d+)_.*$/, "$1")) || 0)
  .map(p => {
    const relPath = getRelativePath(currentPath, p.file.path);
    const id = p.file.name.replace(/^.*?-(\d+)_.*$/, "$1");
    const displayName = p.file.name.replace(/^.*?\d+[_ \-]*|\.md$/g, "");
    
    return [
      id,
      p.state || p.State || "",
      `[${displayName}](<${relPath}>)`,
      p.description || p.Description || ""
    ];
  });

// tR is Templater's output string
tR += dv.markdownTable(headers, rows);
%>