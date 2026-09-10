import express from 'express';
import authController from '../controllers/authController'; // on importe l'objet qui contient la vrai logique

const authRouter = express.Router();

// Quand on requete POST arrive sur /register, exécute authController.register
// (sans parenthèses : on donne la fonction à Express, on ne l'exécute pas nous-mêmes)
// exemple : authRouter.post ('/register', authController.register())

authRouter.post ('/register', authController.register); 
authRouter.post('/login', authController.login);

export default authRouter;
