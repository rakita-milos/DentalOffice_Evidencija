import { apiClient } from './apiClient';
export const doctorsApi = { list:()=>apiClient.get('/doctors'), create:(name)=>apiClient.post('/doctors',{name}) };
