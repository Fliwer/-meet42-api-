import { Request, Response } from 'express';
import { AppDataSource } from '../data_source';
import { User } from '../entities/User';

const userController = {
  deleteAccount: async (req: Request, res: Response) => {

    // req n'a pas officiellement de propriété "userId" pour TypeScript,
    // donc on lui dit "fais comme si elle existait" (même truc que dans le middleware)
    // ici on LIT cette valeur — c'est le middleware qui l'avait ÉCRITE avant nous
    const idUtilisateur = (req as { userId?: string }).userId;

    // ne récupère aucune donnée : donne juste l'outil pour lire/écrire dans la table "users"
    const userRepository = AppDataSource.getRepository(User);

    // ici, et seulement ici, une vraie requête part vers PostgreSQL :
    // "supprime la ligne de la table users dont l'id vaut userId"
    // le "!" dit à TypeScript "je te garantis qu'il n'est pas undefined"
    // (on peut le garantir : le middleware n'appelle next() que s'il a bien posé userId)
    await userRepository.delete(idUtilisateur!);

    // on confirme au client que la suppression a eu lieu
    res.status(200).json({ message: 'Compte supprimé' });
  },
};

export default userController;
