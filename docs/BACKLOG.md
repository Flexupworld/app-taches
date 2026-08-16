# BACKLOG — App tâches (Cockpit)
_Idées non encore arbitrées contre le périmètre. Numérotées `B-xx`._
_App version : 0_

---

## ✅ Arbitrés le 15 août 2026 — sortis du backlog
| # | Sujet | Verdict | Décision |
|---|---|---|---|
| B-00 | Périmètre de l'app | construite, **sous condition** d'amorçage par l'existant | D11 |
| B-01 | Plafond du plan du jour | alerte souple (3 + 2) — remplacée par D39 | D14 |
| B-01bis | Plafond : slots fermes ou alerte souple ? | **slots fermes avec réapprovisionnement**, confirmé par Manu le 16 août 2026. Départ : 1 Créer · 2 Performer · 2 Mécanique | D39 |
| B-02 | Anti-cimetière du réservoir | remontée auto à 6 semaines | D12 |
| B-06 | Import COCKPIT.md / TODO.md | **devient une condition de périmètre**, plus une option | D11 |
| — | Silence de l'app | elle se signale | D13 |

---

## En attente d'arbitrage

## B-03 · Horizons semaine / mois / trimestre / année
Demandés à l'origine. Non retenus tant que l'habitude quotidienne n'est pas prouvée.
_Filtre Q2 : passe (aucune saisie nouvelle, c'est un filtre d'affichage). Reste au
backlog par choix de séquencement, pas par refus._

## B-04 · Parsing Claude de la dictée
Transformer la phrase en ligne structurée (catégorie, entité, responsable, impact).
_Ne peut pas être arbitré avant que la capture brute existe et soit utilisée._

## B-05 · Glisser-déposer réservoir → plan du jour
Confort réel, mais un bouton « mettre aujourd'hui » suffit à valider l'usage.
_À construire seulement quand l'écran est utilisé quotidiennement._

## B-09 · Brancher le rail Performer sur LineApp
Lecture seule de `/dashboard`, `/subscriptions`, `/stripe`, `/circuly`. Tant que ce n'est
pas fait, Performer contient des tâches dictées, pas de la performance mesurée.
_Passe le filtre Q2 : lit une source existante, aucune saisie._

## B-10 · Objectifs
LineApp affiche « sin objetivo definido » sous chaque métrique. Aucune cible n'existe
nulle part. Performer sans objectif est du monitoring, pas de la performance.
_Sujet Manu (le QUOI), pas Claude._

## B-11 · Notifications / rappels — « viens vers moi »
Demandé par Manu. Les notifications PWA sur iPhone sont notoirement instables.
Piste réaliste : une **tâche planifiée côté Claude** qui pousse la journée chaque matin
à heure fixe. À cadrer.

## B-12 · Chaîne de dépendances entre chantiers (D36)
Afficher ce qu'un chantier débloque (les 5 outils → Decathlon, Ion Club). Sans ça, les
chantiers ressemblent à une liste alors que c'est une chaîne.

## B-07 · Seuil du signal de silence (D13)
Combien de jours sans capture avant que l'app se signale ? Et par quel canal —
dans l'app, ou remonté par Claude au brief du Cockpit ?

## B-08 · Que devient COCKPIT.md une fois l'app en service ?
Si les tâches vivent dans Supabase et que COCKPIT.md continue d'exister en parallèle,
on a deux sources de vérité — exactement ce que la méthode interdit.
_À trancher avant que l'app soit réellement adoptée, pas après._
