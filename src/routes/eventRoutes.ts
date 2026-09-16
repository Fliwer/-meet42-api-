import express from 'express';
import eventController from '../controllers/eventControllers'; // la vraie logique (appel au service, réponse HTTP)

const eventRouter = express.Router(); // un routeur dédié aux événements, comme authRouter et userRouter

// GET /api/events — récupère TOUS les événements
eventRouter.get('/', eventController.getAll);

// GET /api/events/UN-ID — récupère UN SEUL événement
// ":id" dans le chemin veut dire "accepte n'importe quelle valeur ici, et range-la dans req.params.id"
eventRouter.get('/:id', eventController.getOne);

export default eventRouter;
