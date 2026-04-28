const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
async function request(path, options={}){
  const res = await fetch(`${API_URL}${path}`, { headers:{'Content-Type':'application/json', ...(options.headers||{})}, ...options });
  if(!res.ok){ const error = await res.json().catch(()=>({})); throw new Error(error.message || `API error ${res.status}`); }
  return res.json();
}
export const apiClient = { get:(p)=>request(p), post:(p,b)=>request(p,{method:'POST',body:JSON.stringify(b)}), patch:(p,b)=>request(p,{method:'PATCH',body:JSON.stringify(b)}), delete:(p)=>request(p,{method:'DELETE'}) };
