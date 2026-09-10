import { User } from '../entities/User';
import { AppDataSource } from '../data_source';

import { Request, Response } from 'express';


// bcryptjs = un outil qui transforme un mot de passe en code brouillé (un "hash")
// pour qu'on ne stocke JAMAIS le vrai mot de passe nulle part

import bcrypt from 'bcryptjs';


const authController = {
  register: async (req: Request, res: Response) => {
    const { email, password, display_name, birth_date } = req.body;

    // si une seule info manque, on arrête tout de suite
    // 400 = code HTTP qui veut dire "ta demande est incomplète / mal formée"
    if (!email || !password || !display_name || !birth_date) {
      return res.status(400).json({ error: 'email, password, display_name et birth_date sont obligatoires' });
    }
    // on brouille le mot de passe AVANT de le stocker.
    // "await" = on attend que le calcul soit fini avant de passer à la ligne suivante
    // le 10 = le niveau de difficulté du brouillage qui va de 4 à 31
    const password_hash = await bcrypt.hash(password, 10);

    // outil pour lire/écrire uniquement dans la table "users"

    const userRepository = AppDataSource.getRepository(User)

    const user = userRepository.create({ email, password_hash, display_name, birth_date });

        try {
      await userRepository.save(user);
    } catch (erreur) {

      if ((erreur as { code?: string }).code === '23505') {
        return res.status(409).json({ error: 'Email déjà utilisé' });
      }
      else if ((erreur as { code?: string }).code === '23514') {
        console.error(erreur);
        return res.status(400).json({ error: 'Date de naissance invalide' });
      }
      else {
        console.error(erreur);
        return res.status(500).json({ error: 'Erreur serveur, réessaie plus tard' });
      }
    }


    res.status(201).json({ id: user.id, email: user.email, display_name: user.display_name });
  },
};






export default authController;