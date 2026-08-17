# PROJECT_STATE — App tâches (Cockpit)
_État actuel et prochaine étape, rien d'autre. Réécrit à chaque session._
_App version : 0.7 — **7 versions livrées et vérifiées le 17 août 2026.**_

## Où on en est
**L'app est utilisable et Manu l'utilise** : https://app-taches-rose.vercel.app
F0 → v0.7 en une journée : écran complet, recherche, manuel embarqué, sélecteur de
rail, ordre des cartes (⇈/↑), réorganisation de la journée, et le correctif D46
(dictées invisibles — cache). 46 décisions (D01–D46), 8 tests verts, GitHub à jour.
Premiers gestes réels : Caixa débloqué (test D40 ✓), journée composée, 10 arbitrages
journalisés, 2 refus de proposition — **le taux de contestation vit**.
⚠️ Verdict de Manu en fin de session : « pas encore satisfaisant pour que je commence
à l'utiliser » — la liste des manques n'a pas encore été dictée. C'est LA question
d'ouverture de la prochaine session.
Détail des livraisons : `CHANGELOG.md`.

**Les trois règles qui gouvernent tout :**
- **D22** — Claude écrit, Manu corrige. Aucun formulaire.
- **D30 + D39** — trois rails, slots fermes (1 Créer protégé · 2 Performer · 2 Mécanique).
- **D32** — une seule mesure : miroir hebdo + taux de contestation.

## Prochaine étape — LA PREUVE D'USAGE, pas une fonctionnalité
On ne construit **rien de plus** tant que l'usage n'est pas prouvé :
**Manu ouvre l'app spontanément une semaine durant, et conteste au moins une
proposition sur cinq.** Sinon on s'arrête et on regarde pourquoi (c'est le pari D11,
déjà perdu une fois avec Obsidian — D17).
- Premier geste attendu dans l'app : **débloquer Caixa** (test D40, 43 j au compteur).
- Capture des nouvelles tâches : via Dispatch — Manu dicte, Claude écrit en base (D22).
  À chaque session Cockpit, Claude regarde `arbitrage` pour lire l'usage réel.

Ensuite seulement : F2 (miroir hebdo — il faut des données d'arbitrage d'abord),
B-09 (brancher Performer sur LineApp), B-11 (pousser la journée le matin).

## Arbitrages restant à Manu (bloquent la qualité des données, pas l'app)
- **Les 3 chantiers actifs** — « onboarding » clarifié (D45 : Performer avec Nathan,
  pas un chantier). Restent 4 candidats pour 3 slots : remodelage offre (un ou deux ?) ·
  rapport QC (⚠️ D18) · Price Machine · offre Franchise-Affiliate-Leaders.
- **7 internes manquants** (9 personnes seedées : Manu · Wijnand · Nathan · Edith ·
  Manuel Wing · Gonzalo · Ronald + externes Gonzague, Hervé).
- Périmètre exact du « Caixa résolu » (D40) — avant de réécrire le bloc Caixa de COCKPIT.md.
- Rapport QC : chez Manu ou chez un responsable ? (D18) · les deux « remodelages » :
  un ou deux chantiers ? · Hodgson/Ruben/Borja · Lift & Firewire · impayés Flex Up ·
  les 4 dashboards · catégorie Perso.

## Vigilances
- **D22 est le cœur.** Toute fonctionnalité qui demande une saisie à Manu doit être refusée.
- **Ne pas « corriger » Caixa en SQL** — il se débloque dans l'app (D40).
- Le slot Créer affiche « aucun chantier actif » tant que les 3 actifs ne sont pas
  tranchés — c'est un état réel, pas un bug.
- Si le taux de contestation reste à zéro, c'est une alerte (D32) : Manu a cessé de choisir.
- `raw_capture` = titre d'IMPORT-INITIAL.md ; texte brut BOTTLE NECK non récupéré
  (vault Obsidian non monté). Backfill possible, à arbitrer.
- Monter `~/FLEX UP Dropbox/CLAUDE` au début de chaque session — le doc canonique de
  méthode y vit, hors du dossier COCKPIT, et l'étape 0 échoue sans lui.
