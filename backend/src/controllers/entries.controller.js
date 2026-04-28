import { entriesService } from '../services/entries.service.js';
export const entriesController = {
  list: async (req, res) => res.json(await entriesService.list()),
  create: async (req, res) => res.status(201).json(await entriesService.create(req.body)),
};
