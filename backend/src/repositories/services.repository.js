import { prisma } from '../lib/prisma.js';
export const servicesRepository = {
  findById: (id) => prisma.service.findUnique({ where: { id }, include: { category: true } }),
  create: ({ categoryId, name, price }) => prisma.service.create({ data: { categoryId, name, currentPrice: price } }),
  updatePriceWithHistory: ({ id, price }) => prisma.$transaction(async (tx) => {
    const oldService = await tx.service.findUnique({ where: { id } });
    if (!oldService) { const err = new Error('Service not found'); err.statusCode = 404; throw err; }
    const updated = await tx.service.update({ where: { id }, data: { currentPrice: price } });
    await tx.servicePriceHistory.create({ data: { serviceId: id, oldPrice: oldService.currentPrice, newPrice: price } });
    return updated;
  }),
  hasEntries: (id) => prisma.serviceEntry.count({ where: { serviceId: id } }),
  softDelete: (id) => prisma.service.update({ where: { id }, data: { isActive: false } }),
};
