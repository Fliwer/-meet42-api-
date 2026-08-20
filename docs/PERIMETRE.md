# Périmètre Meet42 — TFE contre vision

Ce fichier existe pour une seule raison : **le prototype explore la vision, le TFE
en livre un sous-ensemble.** Sans trace écrite, on arrive en semaine 3 avec une app
riche et aucune idée du minimum à rendre.

Mis à jour au fil de la construction. Trois niveaux :

| Marque | Sens |
|---|---|
| **P1** | Dans la proposition validée. Non négociable, à livrer. |
| **P2** | Dans la proposition, mais déclaré « si le temps le permet ». |
| **Vision** | Exploré dans le prototype, **hors TFE**. Nourrit le mémoire et la suite. |

---

## Ce qui est P1 — le contrat

| Fonctionnalité | État prototype | Note pour la reconstruction |
|---|---|---|
| Authentification — inscription, connexion, **déconnexion**, gestion basique du profil | ❌ absent | **La plus grosse absence.** Première tranche verticale à écrire. Les quatre éléments sont listés nommément dans ma proposition : la déconnexion en fait partie, ne pas l'oublier. |
| Ingestion des événements depuis une API | ❌ simulé par des mocks | Dépend de la validation de l'API. Plan B : script de seed. |
| Carte interactive Leaflet | ✅ | Réutilisable presque tel quel |
| Page détail d'un événement | ✅ | |
| Participation « j'ai envie d'y aller » | ✅ | |
| Groupes : créer, rejoindre, quitter, voir les membres | ✅ | |
| Base de données ≥ 4 tables | ✅ schéma prêt | 6 tables, voir le schéma E/A |
| Deux dépôts Git séparés | ❌ | À créer |
| Analyse : E/A, cas d'utilisation, Trello | ✅ livrés | |

---

## Ce qui est P2 — coupable sans douleur

| Fonctionnalité | État | Commentaire |
|---|---|---|
| Recherche et filtres | ✅ construit | **Attention : c'est P2 dans ta propre proposition.** Le plus facile à couper. |
| Chat de groupe | ⚠️ simulé côté client | Le vrai temps réel (Socket.io) est le premier gros morceau à sacrifier |
| Notifications | ❌ | Coupé d'office pour tenir le mois |

---

## Ce qui est Vision — hors TFE

Tout ce qui suit est du prototype d'exploration. **Rien de tout ça n'est attendu
pour la remise.** C'est de la matière pour le mémoire, les slides « évolutions
futures », et la suite du projet.

### Le différenciateur social
| Élément | Pourquoi c'est là |
|---|---|
| Phrase obligatoire pour rejoindre (`intro`) | Remplace le rôle d'animateur. Le groupe n'est jamais silencieux. |
| Composition du groupe visible avant de rejoindre | Informer plutôt que filtrer — évite le sujet juridique du non-mixte |
| Préférences d'activité (sans alcool, PMR…) | Portent sur la sortie, jamais sur les personnes |
| Feuille « l'instant d'après » le clic | Convertit l'intention en groupe |
| Création de groupe en 1 tap + défauts | Supprime la friction au pic d'intention |
| Présence sur place (`present_at`, sans coordonnées) | Signal de vie sans révéler de position |
| Charte de sécurité visible dans le parcours | Répond à l'objection nº 1 |

### Sorties créées par les membres
| Élément | Statut |
|---|---|
| Assistant de création en 3 étapes | Vision — **sauf si l'API échoue**, auquel cas ça devient le plan B et passe P1 |
| Source `agenda` / `membre` | Le champ existe déjà dans le schéma, coût nul |

### Confort et interface
| Élément | Statut |
|---|---|
| Thème clair / nocturne | Vision — joli, zéro point au TFE |
| Identité visuelle (Sora, dégradé violet, cartes image) | Vision |
| Pins pastel par catégorie, mode compact au dézoom | Vision |
| Synchronisation carte ↔ liste | Vision |
| Onglet « Toutes les sorties » | Vision (la carte suffit au P1) |
| Persistance localStorage | Sans objet — remplacée par la vraie base |

### Vérification d'identité — les trois niveaux

Le badge « vérifié » n'a de valeur que si on sait ce qu'il garantit. Trois paliers,
du moins cher au plus lourd.

**Niveau 1 — le téléphone (SMS).** Coût réel : quelques centimes par envoi chez
Twilio ou MessageBird. Ça prouve que la personne contrôle un numéro. En Belgique,
les cartes prépayées sont enregistrées depuis 2017, donc un numéro belge est plus
traçable qu'ailleurs. Ça arrête les faux comptes en série, pas un individu
déterminé. **Meilleur rapport coût/efficacité pour un lancement.**

**Niveau 2 — selfie avec détection du vivant.** La personne filme son visage, le
système vérifie qu'il y a un humain réel et que ça correspond à la photo de
profil. De l'ordre de 0,5 à 2 € par vérification chez les fournisseurs
spécialisés. Ça ne prouve pas l'identité civile, mais ça prouve « la photo, c'est
bien toi » — et pour Meet42, c'est exactement la garantie qui compte : la personne
qui arrive ressemble à son profil.

**Niveau 3 — la pièce d'identité.** En Belgique, itsme® est le standard, adossé
aux banques et à l'eID. Contrat professionnel, pas gratuit. Ça prouve l'identité
civile, mais c'est surdimensionné pour aller boire un verre — et le coût réel,
c'est l'abandon à l'inscription.

**Découpage :**

| Niveau | Statut | Note |
|---|---|---|
| 1 — SMS | **P1 réaliste** | Environ une journée avec un compte d'essai. Fait basculer le badge du décoratif au réel. |
| 2 — selfie + vivant | Vision | À simuler et documenter dans le mémoire |
| 3 — pièce d'identité | Vision lointaine | Réservé à d'éventuels organisateurs récurrents |

**Deux points à ne pas oublier.**

Un selfie ou une pièce d'identité sont des **données biométriques** — catégorie
particulière au sens de l'article 9 du RGPD, obligations nettement plus lourdes.
Un numéro de téléphone, c'est banal. Argument de plus pour rester au niveau 1, et
si tu montes au 2, ne jamais stocker les images.

Et surtout : **la vérification ne dit rien du comportement.** Un compte vérifié
peut être désagréable. Ce qui protège, c'est le trio vérification + signalement
réellement traité + historique. Un badge sans signalement effectif crée un faux
sentiment de sécurité — c'est pire que pas de badge du tout.

### Le « plus » du TFF
Les consignes récompensent une fonctionnalité non vue en cours. Deux candidats,
par ordre de rentabilité :

1. **Accessibilité documentée** — la réflexion est déjà faite dans le prototype
   (zoom mobile, tailles de texte, `aria-pressed`, `prefers-reduced-motion`,
   contrastes calculés). En faire un axe assumé coûte quelques heures.
2. **Intégration continue GitHub Actions** — 4 à 6 h sur les deux dépôts.

Le chat temps réel coche aussi la case mais coûte dix fois plus cher.

Les consignes listent quatre exemples : **intégration IA**, websocket, gros travail
sur l'accessibilité, intégration continue. Deux de mes candidats y figurent
nommément — l'accessibilité est citée mot pour mot, donc le choix ne se discutera
pas. L'IA est citée en premier et figure déjà en Priorité 3 de ma proposition
(recommandations, catégorisation automatique, détection de doublons). Une seule de
ces pistes serait rentable dans le temps imparti : **la catégorisation automatique
des événements à l'ingestion** — un appel par événement importé, branché sur un
script qui existera de toute façon. À n'envisager que si le P1 est livré avant la
semaine 3.

---

## L'ordre de coupe, si tu prends du retard

Coupe dans cet ordre, sans hésiter :

1. Les notifications
2. Le chat temps réel → messages en REST simple, ou rien
3. La recherche et les filtres (P2 dans ta proposition)
4. Les sorties créées par les membres — **sauf si c'est devenu ton plan B**
5. Le thème nocturne

**Ne coupe jamais** : l'authentification, les groupes, la carte. Ce sont les trois
piliers du contrat, et un TFE sans authentification ne passe pas.

---

## Les échéances qui ne se rattrapent pas

- **Jour 1** : valider l'API et compter les événements bruxellois sur 30 jours
- **Jour 1** : faire valider techno + schémas par le formateur
- **Semaine 4, 3 jours pleins** : slides, vidéo de démonstration, préparation orale

Ces trois jours de fin ne sont pas du temps de code. Enlève-les de ton budget dès
maintenant.

---

## La présentation — le format est imposé, autant l'exploiter

Les consignes sont précises : **5 à 10 slides**, une quinzaine de minutes, suivie
de « potentielles questions ». Plus une **démonstration**, qui peut être une vidéo
enregistrée « si vous avez peur que rien ne fonctionne le jour J ».

Six éléments sont exigés nommément :

| Slide imposé | D'où il sort, déjà écrit |
|---|---|
| Présentation de moi et du projet | La proposition, résumé §1 |
| Brève description du projet et des technologies | La proposition, §3 à §7 |
| Objectifs fixés et où j'en suis arrivé | **Ce fichier** — le tableau P1/P2/Vision est exactement ça |
| Évolutions futures | La proposition §8 + tout ce qui est marqué Vision ici |
| **Difficultés rencontrées** | `DECISIONS.md` — chaque décision révisée en est une |
| **Ce que j'ai appris** | `DECISIONS.md` — les décorateurs, les `CHECK` non immuables, les fuseaux |

**Conséquence pratique :** les deux derniers slides, ceux qu'on bâcle toujours
faute de matière, sont les seuls qui ne s'improvisent pas. Ils se remplissent tout
seuls **si** `DECISIONS.md` est tenu au fil de l'eau. C'est la vraie raison de
tenir ce journal — pas la rigueur pour la rigueur.

**La vidéo de démonstration est explicitement autorisée.** Enregistre-la dès que
le P1 marche, même une semaine avant. Une démo live qui plante coûte cher ; une
vidéo ne plante jamais.

---

## Deux tensions repérées entre la proposition et le périmètre

**Le SEO.** Ma proposition justifie le choix de Next.js par le SEO — « une
personne recherchant *événements Bruxelles samedi* pourrait découvrir une page
Meet42 ». Or je classe `SeoLandingView` en Vision. Si je ne livre aucun SEO, un
des arguments technologiques de ma proposition tombe à plat en présentation.

*Le compromis, presque gratuit :* pas de page d'atterrissage dédiée, mais des
pages d'événement rendues côté serveur avec `generateMetadata()` — titre,
description, image. C'est natif dans l'App Router, ça coûte une demi-journée, et
ça suffit à défendre le choix de Next.js.

**Socket.io.** Il figure dans la pile backend de ma proposition, mais le chat est
en Priorité 2 chez moi comme dans les consignes. Le couper reste cohérent avec ma
propre hiérarchie — il faut juste le **dire** en présentation plutôt que de le
laisser disparaître sans explication. Un objectif annoncé puis assumé comme non
atteint est une bonne réponse ; un objectif oublié est une mauvaise surprise.

---

## Comment tenir ce fichier

Une ligne à chaque fois qu'une fonctionnalité apparaît dans le prototype :
son nom, son niveau, et pourquoi. Deux minutes par ajout, et la coupe se fait
en dix minutes le jour où il faut trancher.
