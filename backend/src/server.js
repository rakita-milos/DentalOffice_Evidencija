require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { prisma } = require('./lib/prisma');
const { entryTotal, toNumber } = require('./lib/money');

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', async (req, res) => {
  res.json({ ok: true, service: 'DentalOffice API' });
});

app.get('/api/doctors', async (req, res, next) => {
  try {
    const doctors = await prisma.doctor.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
    res.json(doctors);
  } catch (error) { next(error); }
});

app.post('/api/doctors', async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim();
    if (!name) return res.status(400).json({ error: 'Doctor name is required' });
    const doctor = await prisma.doctor.create({ data: { name } });
    res.status(201).json(doctor);
  } catch (error) { next(error); }
});

app.get('/api/service-categories', async (req, res, next) => {
  try {
    const categories = await prisma.serviceCategory.findMany({
      where: { isActive: true },
      include: { services: { where: { isActive: true }, orderBy: { name: 'asc' } } },
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch (error) { next(error); }
});

app.post('/api/service-categories', async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim();
    const firstServiceName = String(req.body.firstServiceName || '').trim();
    const firstServicePrice = Number(req.body.firstServicePrice || 0);
    if (!name || !firstServiceName) return res.status(400).json({ error: 'Category name and first service are required' });

    const category = await prisma.serviceCategory.create({
      data: {
        name,
        services: { create: { name: firstServiceName, currentPrice: firstServicePrice } },
      },
      include: { services: true },
    });
    res.status(201).json(category);
  } catch (error) { next(error); }
});

app.delete('/api/service-categories/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const used = await prisma.serviceEntry.count({ where: { categoryId: id } });
    if (used > 0) return res.status(409).json({ error: 'Category is already used and cannot be deleted' });
    await prisma.serviceCategory.update({ where: { id }, data: { isActive: false } });
    res.json({ ok: true });
  } catch (error) { next(error); }
});

app.post('/api/services', async (req, res, next) => {
  try {
    const categoryId = Number(req.body.categoryId);
    const name = String(req.body.name || '').trim();
    const currentPrice = Number(req.body.currentPrice || 0);
    if (!categoryId || !name) return res.status(400).json({ error: 'categoryId and name are required' });
    const service = await prisma.service.create({ data: { categoryId, name, currentPrice } });
    res.status(201).json(service);
  } catch (error) { next(error); }
});

app.patch('/api/services/:id/price', async (req, res, next) => {
  try {
    const serviceId = Number(req.params.id);
    const nextPrice = Number(req.body.price || 0);
    const oldService = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!oldService) return res.status(404).json({ error: 'Service not found' });

    const updated = await prisma.$transaction(async (tx) => {
      const service = await tx.service.update({ where: { id: serviceId }, data: { currentPrice: nextPrice } });
      await tx.servicePriceHistory.create({ data: { serviceId, oldPrice: oldService.currentPrice, newPrice: nextPrice } });
      return service;
    });
    res.json(updated);
  } catch (error) { next(error); }
});

app.delete('/api/services/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const used = await prisma.serviceEntry.count({ where: { serviceId: id } });
    if (used > 0) return res.status(409).json({ error: 'Service is already used and cannot be deleted' });
    await prisma.service.update({ where: { id }, data: { isActive: false } });
    res.json({ ok: true });
  } catch (error) { next(error); }
});

app.get('/api/service-entries', async (req, res, next) => {
  try {
    const { doctorId, month, categoryId } = req.query;
    const where = {};
    if (doctorId) where.doctorId = Number(doctorId);
    if (categoryId) where.categoryId = Number(categoryId);
    if (month) {
      const [year, monthNumber] = String(month).split('-').map(Number);
      where.entryDate = { gte: new Date(year, monthNumber - 1, 1), lt: new Date(year, monthNumber, 1) };
    }
    const entries = await prisma.serviceEntry.findMany({
      where,
      include: { doctor: true, category: true, service: true },
      orderBy: { entryDate: 'desc' },
    });
    res.json(entries);
  } catch (error) { next(error); }
});

app.post('/api/service-entries', async (req, res, next) => {
  try {
    const { entryDate, doctorId, categoryId, serviceId, quantity } = req.body;
    const service = await prisma.service.findUnique({ where: { id: Number(serviceId) } });
    if (!service) return res.status(404).json({ error: 'Service not found' });
    const entry = await prisma.serviceEntry.create({
      data: {
        entryDate: new Date(entryDate),
        doctorId: Number(doctorId),
        categoryId: Number(categoryId),
        serviceId: Number(serviceId),
        quantity: Number(quantity || 1),
        priceSnapshot: service.currentPrice,
      },
      include: { doctor: true, category: true, service: true },
    });
    res.status(201).json(entry);
  } catch (error) { next(error); }
});

app.get('/api/expenses', async (req, res, next) => {
  try {
    const expenses = await prisma.expense.findMany({ include: { category: true }, orderBy: { expenseDate: 'desc' } });
    res.json(expenses);
  } catch (error) { next(error); }
});

app.post('/api/expenses', async (req, res, next) => {
  try {
    const { expenseDate, categoryId, vendor, amount } = req.body;
    const expense = await prisma.expense.create({
      data: { expenseDate: new Date(expenseDate), categoryId: Number(categoryId), vendor, amount: Number(amount || 0) },
      include: { category: true },
    });
    res.status(201).json(expense);
  } catch (error) { next(error); }
});

app.get('/api/dashboard/summary', async (req, res, next) => {
  try {
    const entries = await prisma.serviceEntry.findMany();
    const expenses = await prisma.expense.findMany();
    const revenue = entries.reduce((sum, entry) => sum + entryTotal(entry), 0);
    const expensesTotal = expenses.reduce((sum, expense) => sum + toNumber(expense.amount), 0);
    res.json({ revenue, expenses: expensesTotal, profit: revenue - expensesTotal, entriesCount: entries.length });
  } catch (error) { next(error); }
});

app.get('/api/reports/by-doctor', async (req, res, next) => {
  try {
    const doctorId = req.query.doctorId ? Number(req.query.doctorId) : undefined;
    const entries = await prisma.serviceEntry.findMany({ where: doctorId ? { doctorId } : {}, include: { doctor: true } });
    const result = new Map();
    for (const entry of entries) {
      const name = entry.doctor.name;
      const current = result.get(name) || { doctor: name, quantity: 0, revenue: 0 };
      current.quantity += entry.quantity;
      current.revenue += entryTotal(entry);
      result.set(name, current);
    }
    res.json([...result.values()]);
  } catch (error) { next(error); }
});

app.get('/api/reports/by-month', async (req, res, next) => {
  try {
    const doctorId = req.query.doctorId ? Number(req.query.doctorId) : undefined;
    const entries = await prisma.serviceEntry.findMany({ where: doctorId ? { doctorId } : {} });
    const result = new Map();
    for (const entry of entries) {
      const key = entry.entryDate.toISOString().slice(0, 7);
      const current = result.get(key) || { month: key, quantity: 0, revenue: 0 };
      current.quantity += entry.quantity;
      current.revenue += entryTotal(entry);
      result.set(key, current);
    }
    res.json([...result.values()].sort((a, b) => a.month.localeCompare(b.month)));
  } catch (error) { next(error); }
});

app.get('/api/reports/by-category', async (req, res, next) => {
  try {
    const doctorId = req.query.doctorId ? Number(req.query.doctorId) : undefined;
    const entries = await prisma.serviceEntry.findMany({ where: doctorId ? { doctorId } : {}, include: { category: true } });
    const result = new Map();
    for (const entry of entries) {
      const name = entry.category.name;
      const current = result.get(name) || { category: name, quantity: 0, revenue: 0 };
      current.quantity += entry.quantity;
      current.revenue += entryTotal(entry);
      result.set(name, current);
    }
    res.json([...result.values()]);
  } catch (error) { next(error); }
});

app.get('/api/reports/by-service', async (req, res, next) => {
  try {
    const doctorId = req.query.doctorId ? Number(req.query.doctorId) : undefined;
    const entries = await prisma.serviceEntry.findMany({ where: doctorId ? { doctorId } : {}, include: { service: true } });
    const result = new Map();
    for (const entry of entries) {
      const name = entry.service.name;
      const current = result.get(name) || { service: name, quantity: 0, revenue: 0 };
      current.quantity += entry.quantity;
      current.revenue += entryTotal(entry);
      result.set(name, current);
    }
    res.json([...result.values()]);
  } catch (error) { next(error); }
});

app.get('/api/reports/payroll', async (req, res, next) => {
  try {
    const percent = Number(req.query.percent || 30);
    const doctorId = req.query.doctorId ? Number(req.query.doctorId) : undefined;
    const entries = await prisma.serviceEntry.findMany({ where: doctorId ? { doctorId } : {}, include: { doctor: true } });
    const result = new Map();
    for (const entry of entries) {
      const name = entry.doctor.name;
      const current = result.get(name) || { doctor: name, revenue: 0, percent, salary: 0 };
      current.revenue += entryTotal(entry);
      current.salary = Math.round((current.revenue * percent) / 100);
      result.set(name, current);
    }
    res.json([...result.values()]);
  } catch (error) { next(error); }
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: error.message || 'Internal server error' });
});

app.listen(port, () => {
  console.log(`DentalOffice API running on http://localhost:${port}`);
});
