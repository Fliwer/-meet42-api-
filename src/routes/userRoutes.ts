import express from 'express';
// on importe l'objet qui contient deleteAccount (la vraie logique)
import userController from '../controllers/userControler';
// on importe le "videur" qui vérifie le token avant de laisser passer
import authMiddleware from '../middlewares/authMiddleware';

// un nouveau routeur, comme authRouter — une mini-collection de routes
const userRouter = express.Router();

// .delete() : comme .post() qu'on connaît déjà, mais pour la méthode HTTP DELETE
// (convention REST : DELETE = "supprime quelque chose")
// '/me' : convention très courante qui veut dire "l'utilisateur actuellement connecté"
// — pas besoin de mettre un id dans l'URL, le token dans le header suffit à savoir qui c'est
// DEUX fonctions passées ici : Express les exécute dans l'ordre.
// authMiddleware s'exécute EN PREMIER ; userController.deleteAccount ne s'exécute
// QUE SI authMiddleware appelle next()
userRouter.delete('/me', authMiddleware, userController.deleteAccount);
userRouter.get('/me', authMiddleware, userController.getMe);

// on rend ce routeur utilisable ailleurs (dans routes/index.ts, à l'étape suivante)
export default userRouter;
