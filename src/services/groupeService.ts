import { AppDataSource } from '../data_source';
import { Group } from '../entities/Group';
import { GroupMember } from '../entities/GroupMember';

const groupService = {
  // crée un groupe ET son premier membre (l'hôte) en une seule opération
  // reçoit des valeurs simples (pas req) — le controller les a déjà extraites de la requête
  create: async (eventId: string, hostUserId: string, name: string, meetingPoint: string, intro: string) => {
    // deux repositories : un pour "groups", un pour "group_members"
    const groupRepository = AppDataSource.getRepository(Group);
    const memberRepository = AppDataSource.getRepository(GroupMember);

    // .create() construit l'objet en mémoire, ne touche pas encore la base
    // event: { id: eventId } : relie ce groupe à l'événement, juste avec son id
    const group = groupRepository.create({
      event: { id: eventId },
      name,
      meeting_point: meetingPoint,
    });
    // .save() : ICI, un vrai INSERT part vers PostgreSQL, dans "groups"
    await groupRepository.save(group);

    // celui qui crée le groupe devient automatiquement l'hôte
    // group.id : l'id du groupe qu'on VIENT de créer juste au-dessus
    const host = memberRepository.create({
      group: { id: group.id },
      user: { id: hostUserId },
      role: 'host', // explicitement l'hôte
      intro, // même l'hôte doit écrire sa phrase
    });
    // deuxième INSERT, cette fois dans "group_members"
    await memberRepository.save(host);

    // renvoie le groupe créé, pour que le controller puisse répondre avec ses infos
    return group;
  },

  // un utilisateur rejoint un groupe déjà existant, en tant que simple membre
  join: async (groupId: string, userId: string, intro: string) => {
    const groupRepository = AppDataSource.getRepository(Group);
    const memberRepository = AppDataSource.getRepository(GroupMember);

    // on va chercher le groupe pour connaître sa limite (max_participants)
    const group = await groupRepository.findOneBy({ id: groupId });
    if (!group) {
      // throw : arrête la fonction ici et "lance" une erreur ; le controller lira ce texte précis
      throw new Error('GROUP_NOT_FOUND');
    }

    // .count() : compte juste le NOMBRE de lignes, sans les charger — plus rapide que .find().length
    const nombreDeMembres = await memberRepository.count({ where: { group: { id: groupId } } });

    // si le groupe est déjà plein, on refuse et on arrête ici
    if (nombreDeMembres >= group.max_participants) {
      throw new Error('GROUP_FULL');
    }

    // sinon, on crée la nouvelle ligne de membership
    const member = memberRepository.create({
      group: { id: groupId },
      user: { id: userId },
      role: 'member', // jamais 'host' pour un simple join
      intro,
    });
    return await memberRepository.save(member);
  },

  // supprime la ligne de membership correspondante — quitte le groupe
  leave: async (groupId: string, userId: string) => {
    const memberRepository = AppDataSource.getRepository(GroupMember);
    // .delete({...}) : supprime la ligne où group ET user correspondent tous les deux
    await memberRepository.delete({ group: { id: groupId }, user: { id: userId } });
  },

  // renvoie la liste des membres d'un groupe, SANS jamais exposer password_hash (sécurité)
  getMembers: async (groupId: string) => {
    const memberRepository = AppDataSource.getRepository(GroupMember);
    // relations: { user: true } : charge aussi les vraies données de User (display_name...), pas juste son id
    const membres = await memberRepository.find({ where: { group: { id: groupId } }, relations: { user: true } });

    // .map() : transforme chaque membre, un par un (comme dans le script d'ingestion)
    return membres.map((membre) => {
      // destructuring : sépare password_hash du reste de l'objet user
      const { password_hash, ...userSansMotDePasse } = membre.user;
      // { ...membre, user: ... } : copie tout "membre" tel quel, puis remplace juste "user" par la version sans mot de passe
      return { ...membre, user: userSansMotDePasse };
    });
  },
  // renvoie tous les groupes liés à un événement précis
  getByEvent: async (eventId: string) => {
    const groupRepository = AppDataSource.getRepository(Group);
    // where: { event: { id: eventId } } : ne garde que les groupes dont l'événement correspond
    return await groupRepository.find({ where: { event: { id: eventId } } });
  },

};

export default groupService;
