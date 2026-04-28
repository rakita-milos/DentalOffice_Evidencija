const csvCell=(v)=>`"${String(v??'').replaceAll('"','""')}"`;
export function exportRowsToCsv(filename, rows){const csv=rows.map(r=>r.map(csvCell).join(',')).join('\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url);}
