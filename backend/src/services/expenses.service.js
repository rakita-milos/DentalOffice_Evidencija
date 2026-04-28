import { expensesRepository } from '../repositories/expenses.repository.js';
export const expensesService = {
  listCategories: () => expensesRepository.findAllCategories(),
  list: () => expensesRepository.findAll(),
  create: (payload) => expensesRepository.create({ expenseDate: new Date(payload.expenseDate), categoryId: payload.categoryId, vendor: payload.vendor || null, amount: payload.amount }),
};
