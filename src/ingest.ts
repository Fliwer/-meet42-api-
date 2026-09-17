import 'reflect-metadata'; // requis pour que les décorateurs de Event (@Entity, @Column) fonctionnent — ce script tourne séparément de app.ts, donc il a besoin lui aussi de cette préparation
import * as fs from 'fs';   // module natif de Node (pas de npm install) pour lire/écrire des fichiers sur le disque
import * as path from 'path'; // module natif de Node pour construire des chemins de fichiers sans se tromper entre / et \
import { AppDataSource } from './data_source'; // la config de connexion à PostgreSQL, déjà écrite
import { Event } from './entities/Event'; // l'entité qui décrit la forme de la table "events"

async function run() {
    await AppDataSource.initialize()
    // __dirname = le dossier où SE TROUVE ce fichier (src/), peu importe d'où on lance le script
    // '../../evenements-brut.json' = deux dossiers plus haut (src/ → meet42-api/ → Meet42_Version1-TFF/)
    const cheminFichier = path.join(__dirname, '../../evenements-brut.json');

    // lit le fichier entier comme du texte brut ('utf-8' = l'encodage du texte)
    const contenuBrut = fs.readFileSync(cheminFichier, 'utf-8');

    // .replace(/^\uFEFF/, '') : enlève le BOM (caractère invisible) s'il est présent au tout début du texte
    // \uFEFF = le code du caractère BOM ; ^ = "seulement au tout début" ; '' = le remplace par rien (le supprime)
    // JSON.parse(...) : transforme le texte nettoyé en vrai objet JavaScript utilisable

    const donnees = JSON.parse(contenuBrut.replace(/^\uFEFF/, ''));


    const evenementsBruts = donnees.response.results.event; // le tableau des 25 événements

    console.log(`${evenementsBruts.length} événements trouvés dans le fichier.`);

    // .map() transforme chaque élément d'un tableau, un par un, et renvoie un NOUVEAU tableau
    // (event: any) => {...} : la fonction reçoit un seul événement brut à chaque passage
    // "any" = on ne décrit pas son type précisément, il est trop complexe pour l'instant
    const eventsTransformes = evenementsBruts.map((event: any) => {
        // pour chaque événement, on construit un tout nouvel objet, plus simple
        return {

            source: 'agenda-brussels', // valeur fixe, la même pour tous les événements de ce script
            external_id: String(event.id), // l'id chez agenda.brussels ; String(...) le convertit en texte
            title: event.translations?.fr?.name ?? 'Sans titre',
            description: event.translations?.fr?.shortdescr ?? null,
            category: event.categories?.main?.translations?.fr ?? null,
            venue_name: event.place?.translations?.fr?.name ?? 'Lieu inconnu',
            address: event.place?.translations?.fr?.address_line1 ?? null,
            district: event.place?.districts?.translations?.fr ?? null,
            is_free: event.is_free,
            latitude: event.place?.location?.lat ?? 0,
            longitude: event.place?.location?.lon ?? 0,
            image_url: event.media?.link ?? null,
            official_url: event.translations?.fr?.agenda_url ?? null,

            // colle la date et l'heure ensemble avec un "T" au milieu (format attendu par new Date)
            // ?. : si "dates" n'existe pas, ne plante pas, renvoie undefined
            // ?? '00:00:00' : si le résultat est undefined, utilise cette heure par défaut
            starts_at: new Date(`${event.date_start}T${event.dates?.[0]?.start ?? '00:00:00'}`),

            // même principe pour la date de fin, avec minuit comme heure par défaut
            ends_at: new Date(`${event.date_end}T00:00:00`),

            // fabrique un identifiant unique et lisible pour l'URL (ex: "5700026900-expo-partag-e")
            // toLowerCase() : tout en minuscules
            // replace(/[^a-z0-9]+/g, '-') : remplace tout ce qui n'est ni lettre ni chiffre (espaces, accents...) par un tiret
            // event.id devant : garantit que deux titres identiques n'aient jamais le même slug
            slug: `${event.id}-${(event.translations?.fr?.name ?? 'evenement').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,



        };
    });

    const eventRepository = AppDataSource.getRepository(Event);

    // upsert = insert-ou-update : si (source, external_id) existe déjà, met à jour ; sinon, crée
    await eventRepository.upsert(eventsTransformes, ['source', 'external_id']);

    console.log(`${eventsTransformes.length} événements enregistrés en base.`);


    await AppDataSource.destroy(); // ferme proprement la connexion à la base




}

run();

