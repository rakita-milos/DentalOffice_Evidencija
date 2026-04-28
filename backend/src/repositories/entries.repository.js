import { prisma } from '../lib/prisma.js';
export const entriesRepository = {
  findAll: () => prisma.serviceEntry.findMany({ include: { doctor: true, category: true, service: true }, orderBy: { entryDate: 'desc' } }),
  create: (data) => prisma.serviceEntry.create({ data, include: { doctor: true, category: true, service: true } }),
};
