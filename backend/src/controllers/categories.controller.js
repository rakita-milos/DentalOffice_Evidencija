import { categoriesService } from '../services/categories.service.js';
export const categoriesController = {
  list: async (req, res) => res.json(await categoriesService.list()),
  create: async (req, res) => res.status(201).json(await categoriesService.create(req.body)),
  remove: async (req, res) => res.json(await categoriesService.remove(Number(req.params.id))),
};
