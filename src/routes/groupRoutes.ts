import express from 'express';
import groupController from '../controllers/groupController'; // la vraie logique (join, leave, membres)
import authMiddleware from '../middlewares/authMiddleware'; // protège certaines routes, il faut être connecté

const groupRouter = express.Router();

// POST /api/groups/UN-ID/join — rejoindre ce groupe (protégé)
groupRouter.post('/:id/join', authMiddleware, groupController.join);

// DELETE /api/groups/UN-ID/leave — quitter ce groupe (protégé)
groupRouter.delete('/:id/leave', authMiddleware, groupController.leave);

// GET /api/groups/UN-ID/members — voir les membres (public, pas besoin d'être connecté)
groupRouter.get('/:id/members', groupController.getMembers);

export default groupRouter;
