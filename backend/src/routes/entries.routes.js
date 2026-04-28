import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { createEntrySchema } from '../validators/entry.schema.js';
import { entriesController } from '../controllers/entries.controller.js';
export const entriesRouter = Router();
entriesRouter.get('/', asyncHandler(entriesController.list));
entriesRouter.post('/', validateRequest(createEntrySchema), asyncHandler(entriesController.create));
