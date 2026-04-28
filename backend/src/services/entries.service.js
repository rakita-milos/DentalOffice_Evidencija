import { entriesRepository } from '../repositories/entries.repository.js';
import { servicesRepository } from '../repositories/services.repository.js';
export const entriesService = {
  list: () => entriesRepository.findAll(),
  async create(payload) {
    const service = await servicesRepository.findById(payload.serviceId);
    if (!service || !service.isActive) { const err = new Error('Service not found'); err.statusCode = 404; throw err; }
    return entriesRepository.create({
      entryDate: new Date(payload.entryDate),
      doctorId: payload.doctorId,
      categoryId: payload.categoryId,
      serviceId: payload.serviceId,
      quantity: payload.quantity,
      priceSnapshot: service.currentPrice,
    });
  },
};
