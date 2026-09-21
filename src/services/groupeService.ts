import { AppDataSource } from '../data_source';
import { Group } from '../entities/Group';
import { GroupMember } from '../entities/GroupMember';

const groupService = {
    // "create" : crée un groupe ET son premier membre (l'hôte) en une seule opération
    // reçoit des valeurs simples (pas req) — c'est le controller qui les aura extraites de la requête
    create: async (eventId: string, hostUserId: string, name: string, meetingPoint: string, intro: string) => {
        // deux repositories : un pour la table "groups", un pour la table "group_members"
        const groupRepository = AppDataSource.getRepository(Group);
        const memberRepository = AppDataSource.getRepository(GroupMember);

        // .create() : construit l'objet Group en mémoire, ne touche pas encore la base
        // event: { id: eventId } : relie ce groupe à l'événement, juste avec son id (pas besoin de le charger entier)
        const group = groupRepository.create({
            event: { id: eventId },
            name,
            meeting_point: meetingPoint,
        });
        // .save() : ICI, une vraie requête INSERT part vers PostgreSQL, pour la table "groups"
        await groupRepository.save(group);

        // celui qui crée le groupe devient automatiquement l'hôte
        // group.id : l'id du groupe qu'on VIENT de créer juste au-dessus (disponible après le .save())
        const host = memberRepository.create({
            group: { id: group.id },
            user: { id: hostUserId },
            role: 'host', // explicitement l'hôte, pas la valeur par défaut 'member'
            intro, // même l'hôte doit écrire sa phrase — règle du projet, personne n'y échappe
        });
        // deuxième INSERT, cette fois dans "group_members"
        await memberRepository.save(host);

        // renvoie le groupe créé, pour que le controller puisse répondre avec ses infos
        return group;
    },

    // "join" : un utilisateur rejoint un groupe déjà existant, en tant que simple membre
    join: async (groupId: string, userId: string, intro: string) => {
        const groupRepository = AppDataSource.getRepository(Group);
        const memberRepository = AppDataSource.getRepository(GroupMember);

        // on va chercher le groupe pour connaître sa limite (max_participants)
        const group = await groupRepository.findOneBy({ id: groupId });
        if (!group) {
            // throw new Error(...) : on ARRÊTE la fonction ici et on "lance" une erreur
            // le texte 'GROUP_NOT_FOUND' est un code qu'on invente, que le controller lira pour choisir le bon statut HTTP
            throw new Error('GROUP_NOT_FOUND');
        }

        // .count() : ne récupère PAS les lignes elles-mêmes, juste leur NOMBRE — plus rapide que .find().length
        const nombreDeMembres = await memberRepository.count({ where: { group: { id: groupId } } });

        // si le groupe est déjà plein (au max de sa capacité), on refuse et on arrête ici
        if (nombreDeMembres >= group.max_participants) {
            throw new Error('GROUP_FULL');
        }

        // sinon, on crée la nouvelle ligne de membership
        const member = memberRepository.create({
            group: { id: groupId },
            user: { id: userId },
            role: 'member', // jamais 'host' pour un simple join — un seul hôte, celui qui a créé le groupe
            intro,
        });
        return await memberRepository.save(member);
    },

    // "leave" : supprime la ligne de membership correspondante — quitte le groupe
    leave: async (groupId: string, userId: string) => {
        const memberRepository = AppDataSource.getRepository(GroupMember);
        // .delete({...}) : supprime la ligne où group ET user correspondent tous les deux
        await memberRepository.delete({ group: { id: groupId }, user: { id: userId } });
    },

    // "getMembers" : renvoie la liste des membres d'un groupe, avec leurs vraies infos utilisateur
    getMembers: async (groupId: string) => {
        const memberRepository = AppDataSource.getRepository(GroupMember);
        // relations: { user: true } : demande à TypeORM de charger AUSSI les vraies données de User
        // (display_name, etc.) — sans ça, on n'aurait que l'id brut de l'utilisateur, illisible à afficher

        return await memberRepository.find({ where: { group: { id: groupId } }, relations: { user: true } });
    },
};

export default groupService;
