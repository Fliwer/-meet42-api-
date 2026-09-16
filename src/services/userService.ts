import { AppDataSource } from '../data_source';
import { User } from '../entities/User';

const userService = {
  // reçoit juste l'id, PAS req — le controller l'a déjà extrait du token
  deleteAccount: async (userId: string) => {
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.delete(userId); // vraie requête vers PostgreSQL : supprime la ligne
  },

  getMe: async (userId: string) => {
    const userRepository = AppDataSource.getRepository(User);
    // renvoie soit l'utilisateur trouvé, soit null — le controller décidera quoi faire avec
    return await userRepository.findOneBy({ id: userId });
  },
};

export default userService;
