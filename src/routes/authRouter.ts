import express from 'express';

const authRouter = express.Router();

authRouter.post ('/register', (req,res) => {
    res.send ('Inscription à venir');

});

export default authRouter;
