import { entriesRepository } from '../repositories/entries.repository.js';
import { servicesRepository } from '../repositories/services.repository.js';

export const entriesService = {
  list: () => entriesRepository.findAll(),

  async create(payload) {
    const service = await servicesRepository.findById(payload.serviceId);
    if (!service || !service.isActive || !service.category?.isActive) {
      const err = new Error('Service not found');
      err.statusCode = 404;
      throw err;
    }

    // Security/business rule: categoryId is derived from the selected service.
    // The client cannot fake a service/category mismatch.
    return entriesRepository.create({
      entryDate: new Date(payload.entryDate),
      doctorId: payload.doctorId,
      categoryId: service.categoryId,
      serviceId: payload.serviceId,
      quantity: payload.quantity,
      priceSnapshot: service.currentPrice,
    });
  },
};
