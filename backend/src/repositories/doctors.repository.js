import { prisma } from '../lib/prisma.js';
export const doctorsRepository = {
  findAll: () => prisma.doctor.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
  create: (name) => prisma.doctor.create({ data: { name } }),
};
