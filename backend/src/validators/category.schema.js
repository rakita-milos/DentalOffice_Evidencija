import { z } from 'zod';
export const createCategorySchema = z.object({ body: z.object({ name: z.string().min(1), serviceName: z.string().min(1), price: z.coerce.number().min(0).default(0) }) });
