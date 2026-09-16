import { AppDataSource } from '../data_source';
import { User } from '../entities/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const authService = {
  // reçoit des valeurs simples, PAS req — c'est le controller qui les a déjà extraites
  register: async (email: string, password: string, display_name: string, birth_date: string) => {
    const password_hash = await bcrypt.hash(password, 10);
    const userRepository = AppDataSource.getRepository(User);
    const user = userRepository.create({ email, password_hash, display_name, birth_date });
    await userRepository.save(user); // si ça échoue, l'erreur remonte au controller (pas de try/catch ici)
    return user;
  },

  login: async (email: string, password: string) => {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      return null; // le service ne connaît pas les codes HTTP — il renvoie juste "rien trouvé"
    }

    const motDePasseValide = await bcrypt.compare(password, user.password_hash);
    if (!motDePasseValide) {
      return null;
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '7days' });
    return token;
  },
};

export default authService;
