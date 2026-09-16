import { Request, Response } from 'express';
import authService from '../services/authService'; // toute la vraie logique (hash, DB, JWT) vit maintenant ici

const authController = {
  register: async (req: Request, res: Response) => {
    const { email, password, display_name, birth_date } = req.body;

    if (!email || !password || !display_name || !birth_date) {
      return res.status(400).json({ error: 'email, password, display_name et birth_date sont obligatoires' });
    }

    try {
      // le controller ne sait plus COMMENT on hache ni comment on sauvegarde — juste "demande au service de le faire"
      const user = await authService.register(email, password, display_name, birth_date);
      res.status(201).json({ id: user.id, email: user.email, display_name: user.display_name });
    } catch (erreur) {
      // les erreurs de sauvegarde lancées par authService remontent jusqu'ici (le service n'a pas de try/catch)
      if ((erreur as { code?: string }).code === '23505') {
        return res.status(409).json({ error: 'Email déjà utilisé' });
      } else if ((erreur as { code?: string }).code === '23514') {
        console.error(erreur);
        return res.status(400).json({ error: 'Date de naissance invalide' });
      } else {
        console.error(erreur);
        return res.status(500).json({ error: 'Erreur serveur, réessaie plus tard' });
      }
    }
  },

  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe obligatoire' });
    }

    const token = await authService.login(email, password);

    // le service renvoie null s'il ne trouve pas l'email OU si le mot de passe est faux
    // volontairement, le controller ne sait pas lequel des deux — dire "email inconnu" aiderait un attaquant
    if (!token) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    res.status(200).json({ token });
  },
};

export default authController;
