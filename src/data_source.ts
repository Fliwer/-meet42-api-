import 'reflect-metadata'; // requis par les décorateurs TypeORM (@Entity, @Column) pour lire les types à l'exécution
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './entities/User';

dotenv.config(); // doit tourner avant qu'on lise process.env plus bas, sinon les valeurs sont undefined

export const AppDataSource = new DataSource({

    type: 'postgres',
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT)!,
    username: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    synchronize: false,
    entities: [User],
    migrations: ['src/migrations/*.ts'],



});



