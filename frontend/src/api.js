const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error || `API error ${response.status}`);
  return data;
}

export const api = {
  health: () => request('/health'),
  summary: () => request('/dashboard/summary'),
  doctors: () => request('/doctors'),
  addDoctor: (body) => request('/doctors', { method: 'POST', body: JSON.stringify(body) }),
  categories: () => request('/service-categories'),
  addCategory: (body) => request('/service-categories', { method: 'POST', body: JSON.stringify(body) }),
  deleteCategory: (id) => request(`/service-categories/${id}`, { method: 'DELETE' }),
  addService: (body) => request('/services', { method: 'POST', body: JSON.stringify(body) }),
  updateServicePrice: (id, price) => request(`/services/${id}/price`, { method: 'PATCH', body: JSON.stringify({ price }) }),
  deleteService: (id) => request(`/services/${id}`, { method: 'DELETE' }),
  entries: () => request('/service-entries'),
  addEntry: (body) => request('/service-entries', { method: 'POST', body: JSON.stringify(body) }),
  expenses: () => request('/expenses'),
  addExpense: (body) => request('/expenses', { method: 'POST', body: JSON.stringify(body) }),
  reportByDoctor: (doctorId) => request(`/reports/by-doctor${doctorId ? `?doctorId=${doctorId}` : ''}`),
  reportByMonth: (doctorId) => request(`/reports/by-month${doctorId ? `?doctorId=${doctorId}` : ''}`),
  reportByCategory: (doctorId) => request(`/reports/by-category${doctorId ? `?doctorId=${doctorId}` : ''}`),
  reportByService: (doctorId) => request(`/reports/by-service${doctorId ? `?doctorId=${doctorId}` : ''}`),
  payroll: (doctorId, percent = 30) => request(`/reports/payroll?percent=${percent}${doctorId ? `&doctorId=${doctorId}` : ''}`),
};
