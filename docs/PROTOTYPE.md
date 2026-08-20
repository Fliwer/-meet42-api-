# Le prototype de référence — inventaire

Ce fichier existe pour une raison précise : `CLAUDE.md` dit « prototype de
référence, à consulter, pas à copier », mais sans dire **ce qu'il y a dedans**.
Un pointeur vers un dossier de 5 346 lignes qu'on n'ouvre jamais ne sert à rien.

Ici : quoi regarder, pour quoi faire, et ce qu'il faut ignorer.

---

## Où il est

```
prototype-reference/     ← à la racine du projet, lisible directement
```

Vite · React 18 · TypeScript · Tailwind · Leaflet · framer-motion.
Données simulées (`src/data/mockEvents.ts`), persistance `localStorage`.
Aucun backend, aucune authentification.

Seules les sources ont été copiées (40 fichiers, 314 Ko) : ni `node_modules`, ni
`dist`, ni historique git. Le dossier est **hors des deux dépôts** — il ne sera
jamais livré au formateur, c'est une référence de travail.

L'original complet reste à `C:\Users\fliwe\Pictures\Meet42-TFF`.
**Ne le supprime pas** : c'est la seule copie qui tourne réellement (`npm run dev`),
et la seule façon de *voir* le prototype plutôt que de le lire.

## Comment s'en servir

**Je me suis engagé par écrit là-dessus.** Ma proposition de projet, §9 :

> « Pour le TFF, je souhaite repartir **entièrement de zéro** […] La version
> précédente ne constituera donc pas la base technique du TFF. Je souhaite
> uniquement conserver le nom Meet42 et le nom de domaine. »

Ce n'est donc pas une préférence de méthode : recopier des composants du
prototype contredirait un engagement pris devant la formatrice. La consultation
est légitime — on ne se relit pas les idées de zéro — le copier-coller ne l'est
pas.

**À consulter, jamais à recopier tel quel.** Trois raisons de plus :

1. **Stack différente.** Vite + React Router maison contre Next.js App Router.
   Un composant se réutilise, une navigation non.
2. **Données simulées.** Tout part de `mockEvents.ts` et de `localStorage`. Le
   TFE part de PostgreSQL via l'API. La forme des données change.
3. **La majorité est hors périmètre.** Voir `PERIMETRE.md` — beaucoup de ce qui
   est ici est marqué Vision et ne rapporte aucun point.

Ce qui se réutilise vraiment, c'est **le raisonnement produit** figé dans les
types et les petites fonctions utilitaires. Pas le JSX.

---

## Les fichiers à lire en premier

Par ordre de rentabilité, si tu n'ouvres que quatre fichiers :

| Fichier | Lignes | Pourquoi |
|---|---|---|
| `src/types/index.ts` | 103 | **Le plus important.** Toute la modélisation produit distillée : `EventItem`, `Group`, `GroupMember`, `User`. C'est l'ancêtre direct du schéma en base. |
| `src/utils/userState.ts` | 207 | `hydrateEvents()` montre comment les actions d'un membre se rejouent par-dessus les données de référence — la logique deviendra des jointures SQL. |
| `src/utils/time.ts` | 133 | `dayLabel()` et les filtres temporels (`today`, `tonight`, `weekend`). Bruxelles change d'heure : ce fichier a déjà réglé le problème. |
| `src/utils/categories.ts` | 138 | Les 7 catégories et leurs styles. Devient une table ou un ENUM. |

---

## Les écrans

Huit vues, pilotées par un état `activeTab` dans `App.tsx` (470 lignes).

| Vue | Lignes | Périmètre |
|---|---|---|
| `ExplorerView` — carte + liste synchronisées | 223 | **P1** (la carte), la synchro carte↔liste est Vision |
| `EventDetailView` — fiche d'un événement | 529 | **P1** — le plus gros fichier, et le cœur du produit |
| `GroupDetailView` — un groupe et ses membres | 238 | **P1** |
| `MyEventsView` — mes participations | 183 | **P1** |
| `MyGroupsView` — mes groupes | 103 | **P1** |
| `ProfileView` — profil du membre | 184 | **P1** — la référence directe pour ta tranche auth |
| `AllEventsView` — liste complète | 158 | Vision (la carte suffit au P1) |
| `SeoLandingView` — page d'atterrissage | 144 | Vision |

## Les composants

| Composant | Lignes | Périmètre | Ce qu'il porte |
|---|---|---|---|
| `BrusselsMap` | 227 | **P1** | Leaflet, pins par catégorie, mode compact au dézoom |
| `EventCard` | 144 | **P1** | La carte d'un événement dans les listes |
| `GroupComposition` | 88 | **P1** | « Informer plutôt que filtrer » rendu visible |
| `GroupStrip` | 67 | **P1** | Les groupes d'un événement, en bande |
| `IntroPrompt` | 125 | **P1** | La phrase obligatoire pour rejoindre — le cœur du produit |
| `Avatar` | 80 | **P1** | Avec le badge de vérification |
| `Navbar` / `MobileNav` | 136 / 86 | **P1** | Navigation, adaptative |
| `CreateOutingWizard` | 278 | Vision — **sauf plan B** | Assistant de création en 3 étapes. Passe P1 si l'ingestion échoue. |
| `PostGoingSheet` | 120 | Vision | « L'instant d'après le clic » — convertit l'intention en groupe |
| `SafetyCard` | 86 | Vision | La charte de sécurité dans le parcours |
| `InterestedPeopleModal` | 89 | Vision | Qui d'autre veut y aller |
| `FilterBar` | 111 | **P2** | Recherche et filtres — P2 dans la proposition |
| `ThemeToggle` | 91 | Vision | Thème clair / nocturne |

---

## L'identité visuelle — Vision, mais presque gratuite

Toute la charte tient dans **deux fichiers** :

- `tailwind.config.js` — jetons sémantiques (`canvas`, `surface`, `ink`, `line`)
  pilotés par des variables CSS, palette de marque violet → magenta, polices
  **Sora** pour les titres et **Inter** pour le texte, ombres et animations
- `src/index.css` — les variables CSS des deux thèmes (clair / nocturne)

`PERIMETRE.md` classe cette identité en **Vision : « joli, zéro point au TFE »**.
C'est juste — ne passe pas une journée dessus.

**Mais rien n'oblige à réinventer la palette.** Ma proposition §9 dit que je garde
« le nom Meet42 et le nom de domaine » parce que j'apprécie l'identité du projet —
les couleurs et les polices en font partie. Ce sont des **valeurs**, pas du code.

*La bonne façon de faire :* réécrire moi-même le `tailwind.config.js` du TFE en
reprenant les valeurs (violet `#8B5CF6` → magenta `#D946EF`, Sora pour les titres,
Inter pour le texte, jetons sémantiques pilotés par variables CSS). Une vingtaine
de minutes, et je peux expliquer chaque ligne — ce qu'un copier-coller ne permet
pas. Meilleur rapport effort/rendu visuel du projet, pour la vidéo et les slides.

**À faire en toute fin, jamais avant que le P1 soit livré et fonctionnel.**
Une app qui a l'air finie mais dont l'authentification ne marche pas est le pire
état dans lequel arriver à une présentation.

---

## Ce qu'il ne faut pas reconstruire

Tout ce qui est marqué Vision ci-dessus. En cas de tentation, relire
`PERIMETRE.md` — il a été écrit exactement pour ce moment-là.

Le rappel qui compte : **le prototype explore la vision, le TFE en livre un
sous-ensemble.** Reconstruire le prototype à l'identique, c'est échouer au TFE
avec beaucoup de travail.
