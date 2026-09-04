import express from 'express' 
import authRouter from './authRouter';

const router = express.Router();

router.use('/auth', authRouter);

router.get ('/', (req, res) => {

    res.send ('Bienvenue sur l\'API Meet42');
});

export default router;

