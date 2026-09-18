import { AppDataSource } from '../data_source';
import { Participation } from '../entities/Participations';

const participationService = {
  // "j'ai envie d'y aller" — crée une nouvelle participation
  join: async (userId: string, eventId: string) => {
    const participationRepository = AppDataSource.getRepository(Participation);

    // .create() ne touche pas encore la base — il construit juste l'objet en mémoire
    // { id: userId } / { id: eventId } : pas besoin de charger tout le User/Event,
    // juste leur id suffit pour dire "relie cette participation à CET utilisateur, CET événement"
    const participation = participationRepository.create({
      user: { id: userId },
      event: { id: eventId },
    });

    // .save() : ici, et seulement ici, une vraie requête INSERT part vers PostgreSQL
    return await participationRepository.save(participation);
  },

  // se désister — supprime la ligne correspondante
  leave: async (userId: string, eventId: string) => {
    const participationRepository = AppDataSource.getRepository(Participation);

    // .delete({...}) : supprime la/les ligne(s) qui correspondent à CE user ET CET event
    await participationRepository.delete({
      user: { id: userId },
      event: { id: eventId },
    });
  },
};

export default participationService;
