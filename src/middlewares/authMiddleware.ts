import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

    // ÉTAPE 1 : qu'est-ce que le client a mis dans l'en-tête "Authorization" ?
    // soit un texte du genre "Bearer abc123", soit undefined si rien envoyé
    const authHeader = req.headers.authorization;

    // rien envoyé → on refuse tout de suite, pas la peine d'aller plus loin
    if (!authHeader) {
        return res.status(401).json({ error: 'Token manquant' });
    }

    // ÉTAPE 2 : on a un en-tête, mais quel est le vrai token dedans ?
    // "Bearer abc123".split(' ') → ["Bearer", "abc123"] → [1] = "abc123"
    const token = authHeader.split(' ')[1];

    // pas de deuxième mot trouvé (ex: en-tête mal formé, sans espace) → on refuse
    if (!token) {
        return res.status(401).json({ error: 'Token manquant' });
    }

    // ÉTAPE 3 : on a un token, mais est-il authentique et pas expiré ?
    try {
        // jwt.verify lève une erreur si signature invalide OU token expiré
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        // jwt.verify a renvoyé "decoded", mais TypeScript ne sait pas ce qu'il contient
        // on lui dit : "fais-moi confiance, il y a un champ id dedans, en texte"
        // puis on va chercher ce champ, et on le range dans une variable
        const idDecoded= (decoded as { id: string }).id;

        // req n'a normalement pas de propriété "userId" (TypeScript ne la connaît pas)
        // on lui dit : "fais comme si req pouvait avoir un userId (facultatif)"
        // puis on écrit dedans : on colle l'identité de l'utilisateur sur la requête,
        // pour que la route suivante (après ce middleware) puisse la lire
        (req as { userId?: string }).userId = idDecoded;

        // tout est bon, on laisse la requête continuer vers la vraie route
        next();

    } catch (erreur) {
        // signature fausse ou token expiré → on refuse
        return res.status(401).json({ error: 'Token invalide ou expiré' });
    }

};

export default authMiddleware;
