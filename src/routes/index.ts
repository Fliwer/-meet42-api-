import express from 'express'
import authRouter from './authRouter';   // routes /auth/... (register, login)
import userRouter from './userRoutes';   // routes /users/... (me, suppression)
import eventRouter from './eventRoutes'; // routes /events/... (liste, détail)
import groupRouter from './groupRoutes'; // routes /groups/... (rejoindre, quitter, voir les membres)


const router = express.Router(); // le routeur principal, celui que app.ts branche sur /api

router.use('/auth', authRouter);     // toute URL commençant par /auth passe par ce routeur
router.use('/users', userRouter);    // toute URL commençant par /users passe par ce routeur
router.use('/events', eventRouter);  // toute URL commençant par /events passe par ce routeur
router.use('/groups', groupRouter); // toute URL commençant par /groups passe par ce routeur



// route de test toute simple, à la racine de /api (donc http://localhost:8080/api/)
router.get('/', (req, res) => {
    res.send('Bienvenue sur l\'API Meet42');
});

export default router;
