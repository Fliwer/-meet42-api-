import { Request, Response } from 'express';
import  eventService  from '../services/eventService';

const eventController = {
  getAll: async (req: Request, res: Response) => {
    const events = await eventService.getAll();
    res.status(200).json(events);
  },

  getOne: async (req: Request, res: Response) => {
    // req.params : les morceaux VARIABLES de l'URL (ex: le ":id" dans "/events/:id")
    // req.body = les données envoyées ; req.params = les infos DANS l'URL elle-même
    // as string dit à TypeScript : "peu importe ce que tu penses que c'est, traite-le comme un string, point final" 
    const event = await eventService.getOne(req.params.id as string);

    if (!event) {
      return res.status(404).json({ error: 'Événement introuvable' });
    }

    res.status(200).json(event);
  },
};

export default eventController;
