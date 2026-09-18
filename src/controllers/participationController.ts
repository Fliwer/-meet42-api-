import { Request, Response } from 'express';
import participationService from '../services/participationService';

const participationController = {
  join: async (req: Request, res: Response) => {
    // même lecture que dans userControler : le middleware a déjà posé userId sur req
    const idUtilisateur = (req as { userId?: string }).userId;

    // req.params.id : l'id de l'événement, dans l'URL (ex: /events/UN-ID/participate)
    const idEvenement = req.params.id as string;

    await participationService.join(idUtilisateur!, idEvenement);
    res.status(201).json({ message: 'Participation enregistrée' });
  },

  leave: async (req: Request, res: Response) => {
    const idUtilisateur = (req as { userId?: string }).userId;
    const idEvenement = req.params.id as string;

    await participationService.leave(idUtilisateur!, idEvenement);
    res.status(200).json({ message: 'Participation retirée' });
  },
};

export default participationController;
