import { prisma } from '../lib/prisma.js';

export const categoriesRepository = {
  findAll: () => prisma.serviceCategory.findMany({
    where: { isActive: true },
    include: {
      _count: { select: { entries: true } },
      services: {
        where: { isActive: true },
        include: { _count: { select: { entries: true } } },
        orderBy: { name: 'asc' },
      },
    },
    orderBy: { name: 'asc' },
  }),

  createWithService: (payload) => prisma.$transaction(async (tx) => {
    const category = await tx.serviceCategory.create({ data: { name: payload.name } });
    const service = await tx.service.create({
      data: { name: payload.serviceName, currentPrice: payload.price, categoryId: category.id },
    });
    return { ...category, services: [service] };
  }),

  hasEntries: (id) => prisma.serviceEntry.count({ where: { categoryId: id } }),
  softDelete: (id) => prisma.serviceCategory.update({ where: { id }, data: { isActive: false } }),
};
