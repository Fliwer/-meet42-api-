import express from 'express';
import eventController from '../controllers/eventControllers'; // la vraie logique (appel au service, réponse HTTP)
import participationController from '../controllers/participationController';
import authMiddleware from '../middlewares/authMiddleware'; // protège ces routes, il faut être connecté
import groupController from '../controllers/groupController';


const eventRouter = express.Router(); // un routeur dédié aux événements, comme authRouter et userRouter

// GET /api/events — récupère TOUS les événements
eventRouter.get('/', eventController.getAll);

// GET /api/events/UN-ID — récupère UN SEUL événement
// ":id" dans le chemin veut dire "accepte n'importe quelle valeur ici, et range-la dans req.params.id"
eventRouter.get('/:id', eventController.getOne);

// POST /api/events/UN-ID/participate — protégée : il faut être connecté (authMiddleware d'abord)
eventRouter.post('/:id/participate', authMiddleware, participationController.join);

// DELETE /api/events/UN-ID/participate — se désister
eventRouter.delete('/:id/participate', authMiddleware, participationController.leave);

// POST /api/events/UN-ID/groups — créer un groupe pour cet événement (protégé, il faut être connecté)
eventRouter.post('/:id/groups', authMiddleware, groupController.create);

// GET /api/events/UN-ID/groups — liste les groupes existants pour cet événement (public, pas de authMiddleware)
eventRouter.get('/:id/groups', groupController.getByEvent);



export default eventRouter;
