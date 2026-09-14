import express from 'express' 
import authRouter from './authRouter';
import userRouter from './userRoutes';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', userRouter); // toute URL commençant par /users passe par ce routeur

router.get ('/', (req, res) => {

    res.send ('Bienvenue sur l\'API Meet42');
});

export default router;

