import 'reflect-metadata'; // requis pour que les décorateurs de Event (@Entity, @Column) fonctionnent — ce script tourne séparément de app.ts, donc il a besoin lui aussi de cette préparation
import * as fs from 'fs';   // module natif de Node (pas de npm install) pour lire/écrire des fichiers sur le disque
import * as path from 'path'; // module natif de Node pour construire des chemins de fichiers sans se tromper entre / et \
import { AppDataSource } from './data_source'; // la config de connexion à PostgreSQL, déjà écrite
import { Event } from './entities/Event'; // l'entité qui décrit la forme de la table "events"

async function run ()
{
    await AppDataSource.initialize()
    // __dirname = le dossier où SE TROUVE ce fichier (src/), peu importe d'où on lance le script
    // '../../evenements-brut.json' = deux dossiers plus haut (src/ → meet42-api/ → Meet42_Version1-TFF/)
    const cheminFichier = path.join(__dirname, '../../evenements-brut.json');

    // lit le fichier entier comme du texte brut ('utf-8' = l'encodage du texte)
    const contenuBrut = fs.readFileSync(cheminFichier, 'utf-8');

    // transforme ce texte en vrai objet JavaScript (l'inverse de JSON.stringify vu dans fetch)
    const donnees = JSON.parse(contenuBrut.replace(/^\uFEFF/, ''));


        const evenementsBruts = donnees.response.results.event; // le tableau des 25 événements
    console.log(`${evenementsBruts.length} événements trouvés dans le fichier.`);

    await AppDataSource.destroy(); // ferme proprement la connexion à la base




}

run();

