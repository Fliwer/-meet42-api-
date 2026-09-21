import { Request, Response } from 'express';
import groupService from '../services/groupeService'; // toute la vraie logique (création, jointure...) vit ici

const groupController = {
  // POST /api/events/:id/groups — créer un groupe, lié à UN événement précis
  create: async (req: Request, res: Response) => {
    // qui fait la demande — posé par authMiddleware après vérification du token
    const idUtilisateur = (req as { userId?: string }).userId;

    // req.params.id : ICI, dans cette route précise, c'est l'id de L'ÉVÉNEMENT (pas d'un groupe)
    const idEvenement = req.params.id as string;

    // destructuring : extrait ces 3 champs du corps de la requête envoyée par le frontend
    const { name, meeting_point, intro } = req.body;

    // si un des 3 champs manque, on arrête tout de suite — 400 = requête mal formée
    if (!name || !meeting_point || !intro) {
      return res.status(400).json({ error: 'name, meeting_point et intro sont obligatoires' });
    }

    // le service crée le groupe ET fait de idUtilisateur l'hôte automatiquement
    const group = await groupService.create(idEvenement, idUtilisateur!, name, meeting_point, intro);

    // 201 = "créé avec succès" ; on renvoie le groupe créé au frontend
    res.status(201).json(group);
  },

  // POST /api/groups/:id/join — rejoindre un groupe déjà existant
  join: async (req: Request, res: Response) => {
    const idUtilisateur = (req as { userId?: string }).userId;

    // req.params.id : ICI, cette fois, c'est l'id du GROUPE (route différente de "create")
    const idGroupe = req.params.id as string;

    const { intro } = req.body;

    if (!intro) {
      return res.status(400).json({ error: 'intro est obligatoire pour rejoindre un groupe' });
    }

    // try/catch : on tente de rejoindre, mais le service peut refuser (groupe introuvable ou complet)
    try {
      const member = await groupService.join(idGroupe, idUtilisateur!, intro);
      res.status(201).json(member);
    } catch (erreur) {
      // (erreur as Error).message : on lit le texte exact qu'on a nous-mêmes écrit dans le service
      // (throw new Error('GROUP_NOT_FOUND') / throw new Error('GROUP_FULL'))
      // et on choisit le bon code HTTP selon CE texte précis
      if ((erreur as Error).message === 'GROUP_NOT_FOUND') {
        return res.status(404).json({ error: 'Groupe introuvable' }); // 404 = "n'existe pas"
      }
      if ((erreur as Error).message === 'GROUP_FULL') {
        return res.status(409).json({ error: 'Ce groupe est complet' }); // 409 = conflit, refus légitime
      }
      // toute autre erreur imprévue : on la log pour nous-mêmes, et on renvoie une erreur générique
      console.error(erreur);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // DELETE /api/groups/:id/leave — quitter un groupe qu'on a déjà rejoint
  leave: async (req: Request, res: Response) => {
    const idUtilisateur = (req as { userId?: string }).userId;
    const idGroupe = req.params.id as string; // ici encore, l'id du GROUPE

    await groupService.leave(idGroupe, idUtilisateur!);
    res.status(200).json({ message: 'Groupe quitté' });
  },

  // GET /api/groups/:id/members — voir qui est dans le groupe
  getMembers: async (req: Request, res: Response) => {
    // pas de idUtilisateur ici — voir les membres ne nécessite pas d'être connecté
    // Le as signifie que le req.params.id sera toujours du string
    const idGroupe = req.params.id as string;

    const membres = await groupService.getMembers(idGroupe);
    res.status(200).json(membres);
  },

  // GET /api/events/:id/groups — liste les groupes déjà créés pour un événement
  getByEvent: async (req: Request, res: Response) => {
    const idEvenement = req.params.id as string; // l'id de l'événement, dans l'URL

    // demande au service la liste des groupes liés à CET événement précis
    const groupes = await groupService.getByEvent(idEvenement);

    res.status(200).json(groupes); // renvoie la liste au frontend
  },
};

export default groupController;
