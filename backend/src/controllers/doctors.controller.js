import { doctorsRepository } from '../repositories/doctors.repository.js';
export const doctorsController = {
  list: async (req, res) => res.json(await doctorsRepository.findAll()),
  create: async (req, res) => res.status(201).json(await doctorsRepository.create(req.body.name)),
};
