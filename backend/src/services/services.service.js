import { servicesRepository } from '../repositories/services.repository.js';
export const servicesService = {
  create: (payload) => servicesRepository.create(payload),
  updatePrice: (id, price) => servicesRepository.updatePriceWithHistory({ id, price }),
  async remove(id) {
    const used = await servicesRepository.hasEntries(id);
    if (used > 0) { const err = new Error('Service is used and cannot be deleted'); err.statusCode = 409; throw err; }
    return servicesRepository.softDelete(id);
  },
};
