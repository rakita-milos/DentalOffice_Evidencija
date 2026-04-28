import { z } from 'zod';
export const createServiceSchema = z.object({ body: z.object({ categoryId: z.coerce.number().int().positive(), name: z.string().min(1), price: z.coerce.number().min(0).default(0) }) });
export const updatePriceSchema = z.object({ params: z.object({ id: z.coerce.number().int().positive() }), body: z.object({ price: z.coerce.number().min(0) }) });
