import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { doctorsController } from '../controllers/doctors.controller.js';
export const doctorsRouter = Router();
doctorsRouter.get('/', asyncHandler(doctorsController.list));
doctorsRouter.post('/', asyncHandler(doctorsController.create));
