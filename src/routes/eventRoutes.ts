import express from 'express';
import eventController from '../controllers/eventControllers'; // la vraie logique (appel au service, réponse HTTP)
import participationController from '../controllers/participationController';
import authMiddleware from '../middlewares/authMiddleware'; // protège ces routes, il faut être connecté

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


export default eventRouter;
