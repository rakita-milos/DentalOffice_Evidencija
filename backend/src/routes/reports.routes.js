import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { reportsController } from '../controllers/reports.controller.js';
export const reportsRouter = Router();
reportsRouter.get('/summary', asyncHandler(reportsController.summary));
reportsRouter.get('/by-doctor', asyncHandler(reportsController.byDoctor));
reportsRouter.get('/by-month', asyncHandler(reportsController.byMonth));
reportsRouter.get('/by-category', asyncHandler(reportsController.byCategory));
reportsRouter.get('/payroll', asyncHandler(reportsController.payroll));
