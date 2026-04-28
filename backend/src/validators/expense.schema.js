import { z } from 'zod';
export const createExpenseSchema = z.object({ body: z.object({ expenseDate: z.string().min(8), categoryId: z.coerce.number().int().positive(), vendor: z.string().optional().nullable(), amount: z.coerce.number().min(0) }) });
