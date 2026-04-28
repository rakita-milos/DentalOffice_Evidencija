import { categoriesRepository } from '../repositories/categories.repository.js';
export const categoriesService = {
  list: () => categoriesRepository.findAll(),
  create: (payload) => categoriesRepository.createWithService(payload),
  async remove(id) {
    const used = await categoriesRepository.hasEntries(id);
    if (used > 0) { const err = new Error('Category is used and cannot be deleted'); err.statusCode = 409; throw err; }
    return categoriesRepository.softDelete(id);
  },
};
