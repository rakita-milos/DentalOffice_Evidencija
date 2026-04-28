import { servicesService } from '../services/services.service.js';
export const servicesController = {
  create: async (req, res) => res.status(201).json(await servicesService.create(req.body)),
  updatePrice: async (req, res) => res.json(await servicesService.updatePrice(Number(req.params.id), req.body.price)),
  remove: async (req, res) => res.json(await servicesService.remove(Number(req.params.id))),
};
