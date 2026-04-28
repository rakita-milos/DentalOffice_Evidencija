import { prisma } from '../lib/prisma.js';
export const expensesRepository = {
  findAllCategories: () => prisma.expenseCategory.findMany({ orderBy: { name: 'asc' } }),
  findAll: () => prisma.expense.findMany({ include: { category: true }, orderBy: { expenseDate: 'desc' } }),
  create: (data) => prisma.expense.create({ data, include: { category: true } }),
};
