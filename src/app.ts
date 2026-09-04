import express from 'express';
import { AppDataSource } from './data_source';
import router from './routes' // toutes les routes définies dans routes/index 

const app = express(); // express() fabrique l'objet "app", avec des méthodes déjà prêtes à l'emploi (.get, .post, .listen...)

app.use('/api', router); // toute URL commençant par /api passe par ce routeur


const PORT = process.env.PORT!; // "!" dit à TypeScript de ne pas s'inquiéter d'un undefined — ça ne garantit rien sur la vraie valeur

AppDataSource.initialize() // se connecter à Postgres prend du temps, donc ça renvoie une Promise
  .then(() => {
    // ce bloc ne s'exécute QUE si la connexion à la base a réussi
    console.log('📦 Connexion à la base de données réussie');

    app.listen(PORT, () => {
      // app.listen démarre vraiment le serveur ; cette fonction n'est qu'un message de confirmation, elle ne démarre rien elle-même
      console.log('🚀 Express API launched on port ' + PORT);
      console.log('http://localhost:' + PORT + '/');
    });
  })
  .catch((error) => {
    // ce bloc s'exécute SI la connexion échoue ; app.listen n'est jamais appelé ici, le serveur ne démarre pas du tout
    console.error('❌ Erreur de connexion à la base de données', error);
  }); 