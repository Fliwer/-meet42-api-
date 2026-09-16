import { Request, Response } from 'express';
import userService from '../services/userService'; // toute la logique DB vit maintenant ici, plus dans ce fichier

const userController = {
  deleteAccount: async (req: Request, res: Response) => {

    // req n'a pas officiellement de propriété "userId" pour TypeScript,
    // donc on lui dit "fais comme si elle existait" (même truc que dans le middleware)
    // ici on LIT cette valeur — c'est le middleware qui l'avait ÉCRITE avant nous
    const idUtilisateur = (req as { userId?: string }).userId;

    // le "!" dit à TypeScript "je te garantis qu'il n'est pas undefined"
    // (on peut le garantir : le middleware n'appelle next() que s'il a bien posé userId)
    // le controller ne sait plus COMMENT on supprime en base — il demande juste au service de le faire
    await userService.deleteAccount(idUtilisateur!);

    // on confirme au client que la suppression a eu lieu
    res.status(200).json({ message: 'Compte supprimé' });
  },

  getMe: async (req: Request, res: Response) => {
    // même lecture que dans deleteAccount : le middleware a déjà posé userId sur req
    const idUtilisateur = (req as { userId?: string }).userId;

    // le service renvoie soit l'utilisateur trouvé, soit null
    // c'est ICI, dans le controller, qu'on décide quoi répondre selon le résultat
    const user = await userService.getMe(idUtilisateur!);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }

    // destructuring : sort "password_hash" tout seul, et regroupe TOUT LE RESTE dans userSansMotDePasse
    // (comme trier un panier de fruits : sors la banane, mets le reste dans un nouveau panier)
    // password_hash n'est jamais utilisé après, donc jamais renvoyé au frontend

    const { password_hash, ...userSansMotDePasse } = user;

    res.status(200).json(userSansMotDePasse);
  },
};

export default userController;
