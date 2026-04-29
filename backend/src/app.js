import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { doctorsRouter } from './routes/doctors.routes.js';
import { categoriesRouter } from './routes/categories.routes.js';
import { servicesRouter } from './routes/services.routes.js';
import { entriesRouter } from './routes/entries.routes.js';
import { expensesRouter } from './routes/expenses.routes.js';
import { reportsRouter } from './routes/reports.routes.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const app = express();

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || env.corsOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ ok: true, name: 'DentalOffice API' }));
app.use('/api/doctors', doctorsRouter);
app.use('/api/service-categories', categoriesRouter);
app.use('/api/services', servicesRouter);
app.use('/api/service-entries', entriesRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/reports', reportsRouter);
app.use(notFound);
app.use(errorHandler);
