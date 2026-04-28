import { reportsService } from '../services/reports.service.js';
export const reportsController = {
  summary: async (req, res) => res.json(await reportsService.summary()),
  byDoctor: async (req, res) => res.json(await reportsService.byDoctor(req.query.doctorId)),
  byMonth: async (req, res) => res.json(await reportsService.byMonth()),
  byCategory: async (req, res) => res.json(await reportsService.byCategory()),
  payroll: async (req, res) => res.json(await reportsService.payroll(req.query.percent || 30, req.query.doctorId)),
};
