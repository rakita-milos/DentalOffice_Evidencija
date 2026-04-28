import { apiClient } from './apiClient';
export const entriesApi = { list:()=>apiClient.get('/service-entries'), create:(payload)=>apiClient.post('/service-entries',payload) };
