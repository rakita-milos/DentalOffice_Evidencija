import { expensesService } from '../services/expenses.service.js';
export const expensesController = {
  listCategories: async (req, res) => res.json(await expensesService.listCategories()),
  list: async (req, res) => res.json(await expensesService.list()),
  create: async (req, res) => res.status(201).json(await expensesService.create(req.body)),
};
