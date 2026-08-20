# Journal de décisions — Meet42

Une entrée par décision structurante. Toujours la même forme :
**ce que j'ai décidé · ce que j'ai écarté · pourquoi.**

C'est le « pourquoi » qui compte. Ce fichier alimente le mémoire, les slides
« difficultés rencontrées » et « ce que j'ai appris », et surtout les réponses à
l'oral. Une entrée prend deux minutes à écrire et vaut une demi-heure de
reconstitution trois semaines plus tard.

Le format : `## AAAA-MM-JJ — Titre court`, puis les trois blocs.

---

## 2026-08-16 — Deux sources d'événements plutôt qu'une

**Décidé.** L'agenda importé depuis une API externe **et** les sorties créées par
les membres coexistent. Un champ `source` (`agenda` / `membre`) les distingue.

**Écarté.** Le tout-importé (proposition initiale) et le tout-créé-par-les-membres.

**Pourquoi.** Le tout-importé ne permet pas aux membres de proposer leurs propres
sorties. Le tout-créé souffre du démarrage à froid : une carte vide tant que
personne n'a rien publié. Les deux ensemble règlent l'amorçage — l'agenda remplit
la carte dès le premier jour — et le coût est nul puisque la colonne `source`
existait déjà pour le dédoublonnage.

---

## 2026-08-16 — Clé anti-doublon `UNIQUE (source, external_id)`

**Décidé.** Contrainte d'unicité sur le couple source + identifiant externe.

**Écarté.** Se fier au titre + à la date pour détecter les doublons.

**Pourquoi.** Elle rend l'ingestion **idempotente** : on peut relancer le script
autant de fois qu'on veut, un `upsert` met à jour au lieu de dupliquer. Et le jour
où une seconde source arrive, deux événements différents portant le même
identifiant externe ne se marchent pas dessus. Une comparaison sur le titre aurait
été fragile (accents, casse, ponctuation).

---

## 2026-08-16 — Copier les événements en base plutôt que proxifier l'API

**Décidé.** Les données externes sont normalisées et stockées dans PostgreSQL.
Le frontend n'appelle jamais l'API externe.

**Écarté.** Appeler l'API à la volée depuis le frontend ou depuis Express.

**Pourquoi.** Trois raisons. Les participations et les groupes ont besoin d'un
**identifiant stable** auquel se rattacher. Les URL publiques indexées par Google
doivent survivre à un changement de source. Et on peut filtrer, indexer et trier
en SQL au lieu de dépendre des capacités de l'API externe.

---

## 2026-08-16 — Aucune colonne compteur

**Décidé.** Pas de `current_participants` sur `groups`. Le nombre se calcule avec
un `COUNT` sur `group_members`.

**Écarté.** Stocker le compteur et le maintenir à jour.

**Pourquoi.** Un compteur stocké **dérive** de la réalité dès qu'une écriture
échoue. J'avais exactement ce bug dans le prototype : un groupe affichait 5
participants pour 4 membres réels. Une valeur qui se déduit ne se stocke pas.
L'index sur la clé étrangère rend le `COUNT` gratuit à cette échelle.

---

## 2026-08-16 — L'hôte se lit dans `group_members.role`

**Décidé.** Une seule source de vérité pour l'organisateur d'un groupe, avec un
index unique partiel garantissant qu'il y en a exactement un.

**Écarté.** Une colonne `host_id` sur `groups` (ma première version).

**Pourquoi.** Deux endroits à tenir synchronisés, c'est deux endroits à oublier le
jour où l'hôte quitte le groupe. Avec une seule source, le relais d'hôte devient
un simple `UPDATE` sur une ligne. Même raisonnement que pour le compteur.

---

## 2026-08-16 — Groupes de 4 à 8 personnes

**Décidé.** `CHECK (max_participants BETWEEN 4 AND 8)`, avec 6 proposé par défaut
dans l'interface.

**Écarté.** 4 à 6 (première version), et la liberté totale.

**Pourquoi.** La borne basse interdit structurellement le tête-à-tête — c'est ce
qui fait tenir l'argument sécurité. La borne haute absorbe les **désistements** :
un groupe de 4 dont deux personnes se décommandent laisse deux inconnus face à
face, ce qui est l'expérience à éviter. Mais 8 reste un plafond, pas une cible :
au-delà de six ou sept, la conversation unique se scinde.

---

## 2026-08-16 — La règle vit dans la base, pas seulement dans le formulaire

**Décidé.** Les contraintes produit (taille de groupe, unicité, rôle) sont des
`CHECK` et des index en base, doublés côté application.

**Écarté.** Ne valider que dans l'interface React.

**Pourquoi.** Une règle qui ne vit que dans le formulaire se contourne avec un
appel direct à l'API. L'interface n'est pas une barrière.

---

## 2026-08-16 — `TIMESTAMPTZ` et `birth_date`

**Décidé.** Toutes les dates avec fuseau. Date de naissance stockée, âge calculé.

**Écarté.** `TIMESTAMP` nu, et une colonne `age`.

**Pourquoi.** Bruxelles change d'heure deux fois par an : une heure locale nue
décale les événements et rend « commence dans 2 h » faux. Et un âge stocké est
faux le lendemain de l'anniversaire — la date de naissance est un fait, l'âge est
un calcul.

---

## 2026-08-16 — Rejoindre un groupe coûte une phrase

**Décidé.** Le champ `intro` est obligatoire pour entrer dans un groupe.

**Écarté.** Un rôle d'animateur désigné, chargé de lancer la conversation.

**Pourquoi.** Un hôte désigné mais sans amorce reste aussi muet que les autres —
on déplace la gêne sur une personne. Avec une phrase par membre, un groupe de cinq
contient cinq phrases avant que quiconque ait eu à « lancer la conversation » :
l'effort est distribué. C'est le modèle Timeleft, qui fournit les amorces plutôt
que de désigner un meneur, là où Meetup épuise ses organisateurs.
Effet secondaire recherché : qui ne veut pas écrire une phrase ne viendra pas non
plus. On perd des inscriptions, on gagne des présences.

---

## 2026-08-16 — Présence sans position

**Décidé.** `present_at` est un horodatage sur `participations`, sans aucune
coordonnée. Le partage de position réel est limité aux membres d'un même groupe,
et reste une évolution future.

**Écarté.** Diffuser la position en temps réel à tous les intéressés d'un
événement.

**Pourquoi.** Diffuser une position à des dizaines d'inconnus contredit
frontalement la promesse de sécurité de l'app, et alourdit considérablement les
obligations RGPD. Un horodatage suffit à créer le sentiment que ça vit.
Détail technique : un horodatage **expire tout seul**, là où un booléen resterait
vrai le lendemain matin et demanderait une tâche de nettoyage.

---

## 2026-08-16 — Informer plutôt que filtrer

**Décidé.** La composition d'un groupe (âges, genres, taux de vérification) est
visible **avant** de le rejoindre. Les préférences déclarables portent sur
l'activité — sans alcool, non-fumeur, accessible — jamais sur les personnes.

**Écarté.** Des filtres de groupes non mixtes.

**Pourquoi.** La loi Genre du 10 mai 2007 encadre la discrimination fondée sur le
sexe dans l'accès aux biens et services offerts au public ; des exceptions
existent mais s'apprécient au cas par cas. Informer sans filtrer règle l'essentiel
du besoin — chacun décide pour soi — sans poser cette question.
*À faire valider par le formateur, et par un juriste avant toute mise en
production réelle.*

---

## 2026-08-16 — Vérification d'identité par SMS pour commencer

**Décidé.** Niveau 1 (téléphone) obligatoire. Le selfie avec détection du vivant
est documenté mais simulé.

**Écarté.** itsme® / pièce d'identité dès le départ.

**Pourquoi.** Le SMS coûte quelques centimes et arrête les faux comptes en série.
Le niveau 3 prouve l'identité civile mais est surdimensionné pour aller boire un
verre — son coût réel est l'abandon à l'inscription. Et un selfie relève des
**données biométriques**, catégorie particulière de l'article 9 du RGPD, avec des
obligations nettement plus lourdes qu'un numéro de téléphone.
À noter : la vérification ne dit rien du comportement. Elle ne protège qu'associée
à un signalement réellement traité.

---

## 2026-08-16 — Sequelize plutôt que Prisma

> ⚠️ **Révisée le 2026-08-20** — voir « TypeORM plutôt que Sequelize » plus bas.
> Le critère posé ici (choisir ce sur quoi on peut être débloqué) reste valable ;
> c'est sa conclusion qui a changé quand la formatrice s'est prononcée.

**Décidé.** PostgreSQL + Sequelize.

**Écarté.** Prisma, pourtant autorisé par les consignes.

**Pourquoi.** Prisma s'intègre mieux avec TypeScript, mais le formateur indique
lui-même ne pas le connaître. En un mois, mieux vaut une technologie sur laquelle
on peut être débloqué.

---

## 2026-08-16 — Une API Express séparée de Next.js

**Décidé.** Deux applications, deux dépôts.

**Écarté.** Tout faire dans Next.js avec ses route handlers.

**Pourquoi.** C'est une consigne du TFF. Et indépendamment, ça découple
l'ingestion des événements du rendu de l'interface : le script d'import tourne
sans rapport avec le frontend.

---

## 2026-08-16 — `host: '127.0.0.1'` et pas `'localhost'`

**Décidé.** Le serveur de développement écoute sur `127.0.0.1`, et on ouvre cette
URL exacte.

**Écarté.** `host: true` (exposé au réseau local) et `host: 'localhost'`.

**Pourquoi.** `host: true` expose le serveur à tout le réseau, ce qui n'est pas
souhaitable sur un Wi-Fi partagé. Et avec `'localhost'`, Chrome tente `::1`
d'abord : la page bascule en IPv4 toute seule mais **pas la WebSocket**, donc le
rechargement à chaud casse en silence. Petite décision, une heure perdue à la
comprendre.

---

## 2026-08-20 — TypeORM plutôt que Sequelize

**Décidé.** PostgreSQL + TypeORM. Cette décision **révise** celle du 16/08.

**Écarté.** Sequelize, déjà installé et fonctionnel au moment du changement.

**Pourquoi.** Les consignes elles-mêmes apparient les deux ORM à un langage :

> Relationnel : SQL + **Sequelize (JavaScript)** ou **TypeORM (TypeScript)**

Le projet est en TypeScript, donc TypeORM. La formatrice ne donnait pas un avis
personnel, elle citait le document. Ma proposition de projet annonçait Sequelize —
c'est cette proposition qui était en décalage avec les consignes, pas l'inverse.
Le critère que j'avais posé le 16/08 — choisir la technologie sur laquelle je peux
être débloqué — pointe dans le même sens.
Techniquement l'argument tient aussi : Sequelize v6 oblige à déclarer le type
TypeScript *et* le schéma séparément (`InferAttributes` d'un côté, `Model.init`
de l'autre), là où une entité TypeORM est une classe décorée qui sert de source
de vérité unique.

**Coût du changement.** Nul : aucune entité n'était écrite. C'est précisément
pourquoi il fallait basculer tout de suite plutôt qu'en semaine 3.

---

## 2026-08-20 — Prisma réexaminé, puis réécarté une seconde fois

**Décidé.** On reste sur TypeORM.

**Écarté.** Prisma, redemandé après avoir appris qu'il est techniquement en avance.

**Précision importante.** Prisma est **autorisé** par les consignes, qui le
mentionnent explicitement : *« Prisma (inconnu de ma part mais pourquoi pas le
tester) »*. Le refus ne porte donc pas sur la permission.

**Pourquoi.** Trois raisons cumulées. D'abord, la parenthèse des consignes dit
tout : la formatrice indique elle-même ne pas connaître Prisma, et elle m'a
recommandé TypeORM. Prendre l'option qu'elle ne pratique pas, après avoir reçu un
conseil contraire, me prive de tout recours en cas de blocage — et un troisième
changement d'ORM dans la même journée ne raconte pas une bonne histoire.
Ensuite, l'argument « full TypeScript » se retourne : le
schéma Prisma vit dans `schema.prisma`, un langage dédié qui n'est pas du
TypeScript, suivi d'une étape `prisma generate` ; l'entité TypeORM, elle, est du
TypeScript. Enfin, Prisma résout des problèmes d'échelle — jointures profondes,
grosses équipes — que 6 tables et un mois de développement n'ont pas.

**Ce qu'on en garde.** La comparaison Sequelize / TypeORM / Prisma devient une
slide de la présentation. Elle rapporte des points sans toucher au code.

---

## 2026-08-20 — `bcryptjs` plutôt que `bcrypt`

**Décidé.** Hachage des mots de passe avec `bcryptjs`.

**Écarté.** `bcrypt`, le module natif.

**Pourquoi.** `bcrypt` se compile en C++ à l'installation : sous Windows il exige
une chaîne de compilation complète et casse à chaque changement de version de
Node. `bcryptjs` est du JavaScript pur — mesurablement plus lent, mais le hachage
a lieu une fois par inscription et une fois par connexion, jamais en boucle. Le
compromis se paie là où ça ne coûte rien.

---

## 2026-08-20 — Les `CHECK` pour l'intemporel, le contrôleur pour le daté

**Décidé.** La contrainte de majorité est vérifiée dans le contrôleur, pas par un
`CHECK`. La base garde un `CHECK` de plausibilité (`birth_date > 1900-01-01`).

**Écarté.** `CHECK (birth_date <= CURRENT_DATE - INTERVAL '18 years')`.

**Pourquoi.** Ça semble contredire la décision du 16/08 « la règle vit dans la
base » — c'est en réalité sa bonne lecture. `4 ≤ taille de groupe ≤ 8` est vrai
aujourd'hui et dans dix ans : c'est un invariant, sa place est en base. « Avoir
18 ans » dépend de la date du jour. Or un `CHECK` n'est évalué qu'à l'écriture, et
`CURRENT_DATE` n'y est pas immuable : une restauration `pg_dump` peut rejeter des
lignes pourtant valides le jour de l'inscription. Un invariant va en base, une
règle datée va dans le code.

---

## 2026-08-20 — `verified_at` plutôt qu'un booléen `verified`

**Décidé.** La vérification d'identité est un horodatage nullable.

**Écarté.** Une colonne booléenne `verified`.

**Pourquoi.** Même raisonnement que `present_at` : on stocke le fait daté, on
déduit l'affichage. Le badge se lit `verifiedAt !== null`, et on sait en prime
*quand* la vérification a eu lieu — information dont on aura besoin le jour où
une vérification devra être renouvelée. Un booléen aurait jeté cette donnée.

---

## 2026-08-20 — Sources d'événements : endpoints identifiés, choix non tranché

**Constaté**, pas encore décidé. Les deux candidats répondent, les deux exigent
une clé.

| Source | Test effectué | Coût |
|---|---|---|
| `api.brussels` / agenda.brussels | HTTP 401 « Missing Credentials » | inscription libre-service, tarif à confirmer |
| `search.uitdatabank.be` (publiq) | HTTP 401 « No x-api-key » | **125 €/an**, identifiants de test gratuits |
| `opendata.brussels.be` | libre, sans clé | gratuit, mais des lieux et non un agenda |

**Impasses écartées** : Eventbrite a retiré la recherche publique de son API,
l'API Events de Facebook est fermée aux tiers, la recherche Meetup est réservée
aux comptes payants.

**Ce qui reste à faire avant de trancher.** Obtenir un jeton `api.brussels` et
compter les événements bruxellois sur 30 jours. Ce chiffre décide entre
l'ingestion et le plan B (assistant de création de sorties, qui passerait P1).

**Note de conception.** La décision du 16/08 « copier les événements en base
plutôt que proxifier l'API » prend ici tout son sens : si la source devient
payante, plafonne ou disparaît, les données restent. Et `UNIQUE (source,
external_id)` gère nativement le recouvrement entre agenda.brussels et
UiTdatabank sur Bruxelles.

---

## 2026-08-20 — agenda.brussels imposé par le formateur

**Décidé.** La source d'ingestion est `agenda.brussels` (via `api.brussels`).

**Écarté.** UiTdatabank, laissé en option de secours si l'accès à agenda.brussels
échoue ou si le comptage sur 30 jours est trop faible.

**Pourquoi.** Consigne explicite du formateur, reçue en séance. Elle tranche
l'entrée du 20/08 « Sources d'événements : endpoints identifiés, choix non
tranché ». L'inscription déjà entamée sur la plateforme publiq (UiTdatabank)
reste valable et gratuite en mode test — elle n'est pas perdue si un plan B est
nécessaire.

---

## 2026-08-20 — TypeScript 5 plutôt que la version 7 installée par défaut

**Décidé.** `typescript@^5` (5.9.3 au moment de l'écriture).

**Écarté.** `typescript@^7.0.2`, installée sans y penser par `npm install -D
typescript` (npm prend la dernière version disponible par défaut).

**Pourquoi.** `ts-node-dev` (donc `ts-node` en dessous) plante au tout premier
lancement avec la version 7 : `TypeError: Cannot read properties of undefined
(reading 'fileExists')`, dans `ts-node/dist/configuration.js` — avant même de
lire `src/app.ts`. La pile d'erreurs ne mentionne que des fichiers de
`node_modules`, jamais notre code : signe qu'il s'agit d'une incompatibilité
entre outils, pas d'un bug à nous. TypeScript 7 a changé la forme de son API
interne (probable lien avec la réécriture du compilateur), et `ts-node` n'a pas
encore suivi. Même raisonnement que pour Sequelize/TypeORM le 16/08 : choisir
la version sur laquelle l'écosystème (et nous) peut être débloqué, pas la plus
récente.

**Ce qu'on en garde.** Un exemple concret de « lire la pile d'erreurs pour voir
si le crash vient de notre code ou d'un `node_modules` » — bonne anecdote pour
la partie « difficultés rencontrées » de la présentation.

---

<!--
Modèle à copier pour la suite :

## AAAA-MM-JJ — Titre court

**Décidé.**

**Écarté.**

**Pourquoi.**
-->
