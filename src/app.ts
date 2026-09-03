import express from 'express';
import { AppDataSource } from './data_source';

const app = express();
const PORT = process.env.PORT!;

AppDataSource.initialize()
  .then(() => {
    console.log('📦 Connexion à la base de données réussie');

    app.listen(PORT, () => {
      console.log('🚀 Express API launched on port ' + PORT);
      console.log('http://localhost:' + PORT + '/');
    });
  })
  .catch((error) => {
    console.error('❌ Erreur de connexion à la base de données', error);
  });
