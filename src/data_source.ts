import 'reflect-metadata'; // requis par les décorateurs TypeORM (@Entity, @Column) pour lire les types à l'exécution
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './entities/User';

dotenv.config(); // doit tourner avant qu'on lise process.env plus bas, sinon les valeurs sont undefined

export const AppDataSource = new DataSource({

 type: 'postgres',
    // ces 5 lignes viennent toutes de .env — jamais écrites en dur, pour ne pas exposer le mot de passe
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT)!,
    username: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    synchronize: false, // jamais laisser TypeORM modifier le schéma tout seul
    entities: [User], // les tables que TypeORM connaît
    migrations: ['src/migrations/*.ts'], // où trouver les fichiers de migration


});



