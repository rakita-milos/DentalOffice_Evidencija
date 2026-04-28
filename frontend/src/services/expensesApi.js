import { apiClient } from './apiClient';
export const expensesApi = { categories:()=>apiClient.get('/expenses/categories'), list:()=>apiClient.get('/expenses'), create:(payload)=>apiClient.post('/expenses',payload) };
