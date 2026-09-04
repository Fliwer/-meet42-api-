import express from 'express' 

const router = express.Router();

router.get ('/', (req, res) => {

    res.send ('Bienvenue sur l\'API Meet42');
});

export default router

