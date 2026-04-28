import { z } from 'zod';
export const createEntrySchema = z.object({ body: z.object({ entryDate: z.string().min(8), doctorId: z.coerce.number().int().positive(), categoryId: z.coerce.number().int().positive(), serviceId: z.coerce.number().int().positive(), quantity: z.coerce.number().int().positive() }) });
