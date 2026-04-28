import { apiClient } from './apiClient';
export const servicesApi = {
  categories:()=>apiClient.get('/service-categories'),
  createCategory:(payload)=>apiClient.post('/service-categories',payload),
  deleteCategory:(id)=>apiClient.delete(`/service-categories/${id}`),
  createService:(payload)=>apiClient.post('/services',payload),
  updatePrice:(id,price)=>apiClient.patch(`/services/${id}/price`,{price}),
  deleteService:(id)=>apiClient.delete(`/services/${id}`),
};
