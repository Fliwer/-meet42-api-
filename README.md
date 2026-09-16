# Meet42 — API

Backend de Meet42, une carte des événements de Bruxelles où chaque événement
peut devenir un point de rencontre. Travail de fin de formation (TFE).

## Stack

- Express + TypeScript
- PostgreSQL + TypeORM
- JWT + bcryptjs pour l'authentification

## Prérequis

- Node.js
- Docker Desktop (pour PostgreSQL en local)

## Installation

```
npm install
```

Copier `.env.example` en `.env` et remplir les valeurs (connexion à la base,
port).

Démarrer PostgreSQL (voir `docker-compose.yml`, à la racine du dossier parent
qui contient aussi `meet42-web`) :

```
docker compose up -d
```

Lancer le serveur en développement :

```
npm run dev
```

## État actuel du projet

En construction. Connexion à PostgreSQL fonctionnelle, première entité
(`User`) écrite. Aucune route ni aucun endpoint n'existe encore.

## Documentation

- [`docs/DECISIONS.md`](docs/DECISIONS.md) — journal des décisions techniques, avec leur raisonnement
- [`docs/PERIMETRE.md`](docs/PERIMETRE.md) — ce qui est dans le TFE (P1/P2) et ce qui n'y est pas (Vision)
- [`docs/SCHEMA-EA.md`](docs/SCHEMA-EA.md) — schéma entité/association
- [`docs/CAS-UTILISATION.md`](docs/CAS-UTILISATION.md) — cas d'utilisation UML

requête HTTP
   ↓
ROUTES (authRouter.ts, userRoutes.ts, eventRouter.ts)
   → décide quelle URL déclenche quelle fonction
   ↓
CONTROLLERS (authController.ts, userControler.ts, eventControlers.ts)
   → lit la requête (req.body, req.params...), appelle le service, renvoie la réponse
   ↓
SERVICES (authService.ts, userService.ts, eventService.ts)
   → SEUL endroit qui parle à la base, via un Repository
   ↓
ENTITÉS (User.ts, Event.ts)
   → décrivent la forme d'une table
   ↓
data_source.ts
   → la config de connexion à PostgreSQL, utilisée par tous les services
