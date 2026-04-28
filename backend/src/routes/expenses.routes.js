import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { createExpenseSchema } from '../validators/expense.schema.js';
import { expensesController } from '../controllers/expenses.controller.js';
export const expensesRouter = Router();
expensesRouter.get('/categories', asyncHandler(expensesController.listCategories));
expensesRouter.get('/', asyncHandler(expensesController.list));
expensesRouter.post('/', validateRequest(createExpenseSchema), asyncHandler(expensesController.create));
