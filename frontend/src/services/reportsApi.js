import { apiClient } from './apiClient';
export const reportsApi = {
  summary:()=>apiClient.get('/reports/summary'),
  byDoctor:(doctorId)=>apiClient.get(`/reports/by-doctor${doctorId ? `?doctorId=${doctorId}` : ''}`),
  byMonth:()=>apiClient.get('/reports/by-month'),
  byCategory:()=>apiClient.get('/reports/by-category'),
  payroll:({doctorId,percent})=>apiClient.get(`/reports/payroll?percent=${percent||30}${doctorId ? `&doctorId=${doctorId}` : ''}`),
};
