# PROJECT_STATE — App tâches (Cockpit)
_État actuel et prochaine étape, rien d'autre. Réécrit à chaque session._
_App version : 0.1 — **F0 en ligne et vérifié le 17 août 2026.**_

## Où on en est
**F0 (squelette) est livré** : https://app-taches-rose.vercel.app
`/api/health` → `schema_cockpit: OK` · 101 tâches · 9 personnes · 3 blocages.
Base seedée, tests verts, 43 décisions consignées (D01–D43). Détail : `CHANGELOG.md`.

**Les trois règles qui gouvernent tout :**
- **D22** — Claude écrit, Manu corrige. Aucun formulaire.
- **D30 + D39** — trois rails, slots fermes avec réapprovisionnement (1 Créer protégé ·
  2 Performer · 2 Mécanique). L'app refuse d'ajouter, elle ne signale pas un dépassement.
- **D32** — une seule mesure : le miroir hebdo + le taux de contestation.

## Prochaine étape — F1 v2 : l'écran « Ma journée »
Trois rails à slots fermes (D39) · réservoir filtré `porteur = moi` · « chez quelqu'un
d'autre » (D31) · « je suis bloqué » dépliable (D34) · bouton « sortir de mes mains » (D20).
Chaque geste écrit dans `arbitrage` (D21/D32).
**Hors périmètre F1 :** dictée (passe par Dispatch) · miroir hebdo (F2) · glisser-déposer.
**Fini quand :** déployé et vérifié en direct · tests verts · APP_VERSION incrémentée ·
CHANGELOG + DECISIONS à jour · commité **et poussé**.
**Preuve d'usage attendue :** Manu ouvre l'app spontanément une semaine, et conteste
au moins une proposition sur cinq. Sinon on s'arrête et on regarde pourquoi.

## Reste à faire (hors F1)
- Rien. GitHub : `Flexupworld/app-taches` créé et poussé le 17 août (token dans le
  trousseau de l'iMac). Le script de déploiement pousse à chaque passage.

## Arbitrages restant à Manu
- **7 internes manquants** (9 seedés : Manu · Wijnand · Nathan · Edith · Manuel Wing ·
  Gonzalo · Ronald + externes Gonzague, Hervé).
- **Les 3 chantiers actifs** parmi les 8 (tous `actif_chantier = false`) — l'ordre de 5
  donné par Manu cite « onboarding », absent des 8 dictés.
- **Périmètre exact du « Caixa résolu »** (D40) — avant de réécrire le bloc Caixa de COCKPIT.md.
- Le rapport QC client reste chez Manu ou part chez un responsable ? (D18)
- Les deux « remodelages » — un seul chantier ou deux ?
- Hodgson / Ruben / Borja · Lift & Firewire (Logistique ou Commercial ?) · impayés Flex Up
  (Finance ou Commercial ?) · les 4 dashboards (un chantier ?) · catégorie Perso (la garder ?)

## Vigilances
- **D22 est le cœur.** Toute fonctionnalité qui demande une saisie à Manu doit être refusée.
- **Caixa est volontairement OUVERT en base** (résolu dans la vraie vie) : c'est le cas de
  test du cycle blocker → résolu (D40). Il se déblo­que dans l'app, pas en SQL.
- Le rail Créer n'a aucun chantier actif tant que Manu n'a pas tranché — l'écran F1 doit
  le montrer comme un état réel (slot vide), pas le masquer.
- `raw_capture` = titre d'IMPORT-INITIAL.md ; le texte brut BOTTLE NECK d'Obsidian n'a pas
  été récupéré (vault non monté). Backfill possible, à arbitrer.
- Monter `~/FLEX UP Dropbox/CLAUDE` au début de chaque session — le doc canonique de
  méthode y vit, hors du dossier COCKPIT, et l'étape 0 échoue sans lui.
