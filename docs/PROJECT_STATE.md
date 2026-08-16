# PROJECT_STATE — App tâches (Cockpit)
_État actuel et prochaine étape, rien d'autre. Réécrit à chaque session._
_App version : 0.1 — schéma écrit, rien de déployé._
_Session du 15 août 2026 — **close proprement**._

## Où on en est
**Étapes 1 (Périmètre) et 2 (Plan) franchies. La construction peut commencer.**

38 décisions consignées (D01–D38). Le projet a changé deux fois de nature dans la
journée, et c'est la version finale qui compte :

> Ce n'est pas une to-do list. C'est un outil qui maintient Manu sur **commercial,
> business development et création**, et qui fait sortir le reste de ses mains —
> alimenté par la conversation quotidienne avec Claude, pas par de la saisie.

**Les trois règles qui gouvernent tout :**
- **D22** — Claude écrit, Manu corrige. Aucun formulaire. Si Manu doit remplir un champ,
  le design est faux.
- **D30** — trois rails : Créer (1/jour, protégé) · Performer · Mécanique (à réduire).
- **D32** — une seule mesure : le miroir hebdomadaire, plus le **taux de contestation**.
  S'il tombe à zéro, c'est une alerte, pas un succès.

## Validé par Manu en fin de session (D38)
- GitHub + Vercel : OK, comme les autres apps du groupe.
- Supabase : OK — schéma `cockpit` dans le projet existant « Flex Up APPS ».
- **Plan F1 v2 : validé.**
- Alerte sécurité LineApp : **levée** (session navigateur ouverte, app privée).

## Prochaine étape — ÉTAPE 3 : CONSTRUCTION de F1 v2
Une fonctionnalité à la fois, déployée et vérifiée avant d'ouvrir la suivante.

**F1 v2 — « Ma journée ».** Trois rails, réservoir filtré sur `porteur = moi`, zone
« je suis bloqué », bouton « sortir de mes mains ». Seed : 93 tâches importées +
8 chantiers dictés + 3 blocages réels (Regnr, Caixa, Decathlon).
**Hors périmètre F1 :** dictée intégrée (elle passe par Dispatch), miroir hebdo (F2 —
il faut des données d'usage d'abord), glisser-déposer (un bouton suffit à valider l'usage).

**Ordre de démarrage demain :**
1. Appliquer `db/001_schema.sql` sur le projet « Flex Up APPS » (schéma `cockpit`).
2. Seed : `people` (16 internes), puis l'import depuis `IMPORT-INITIAL.md`.
3. Repo + GitHub + squelette Next.js + premier déploiement Vercel (écran vide mais en ligne).
4. L'écran F1 v2.

**Fini quand :** déployé et vérifié en direct · `APP_VERSION = 0.1` · tests verts ·
`CHANGELOG.md` complété · décisions consignées · commité et poussé.

**Preuve d'usage attendue :** que Manu ouvre l'app spontanément une semaine durant, et
qu'il conteste au moins une proposition sur cinq. Sinon on s'arrête et on regarde pourquoi.

## Arbitrages restant à Manu
- ~~**B-01bis — le plafond**~~ → **TRANCHÉ (D39) : slots fermes avec réapprovisionnement.**
  Départ proposé : 1 Créer (protégé) · 2 Performer · 2 Mécanique. Plus rien ne bloque l'écran.
- **Périmètre exact du « Caixa résolu »** — à préciser avant de réécrire le bloc Caixa de
  COCKPIT.md. Sert aussi de cas de test de référence (D40).
- Les 3 chantiers actifs : Manu a donné un ordre de 5 (onboarding · remodelage offre ·
  rapport QC + facturation · Price Machine · offre Franchise-Affiliate-Leaders) qui diffère
  de la sélection proposée en D35. Confirmer lesquels sont actifs.
- Le rapport QC client reste chez Manu ou part chez un responsable ? (D18)
- Les deux « remodelages » — un seul chantier ou deux ?
- Les 5 points de `IMPORT-INITIAL.md` (Hodgson/Ruben/Borja, commandes Lift & Firewire,
  impayés Flex Up, les 4 dashboards).
- Catégorie **Perso** : vide à l'import, comme elle l'était dans Obsidian. La garder ?

## Vigilances
- **D22 est le cœur.** Toute fonctionnalité qui demande une saisie à Manu doit être
  refusée — y compris si Manu la demande.
- **Le rail Créer est vide à l'import** (D33) : les 15 tâches commerciales sont du
  Performer et du Mécanique. Les vrais chantiers ont été dictés le 15 août et n'existaient
  dans aucun fichier avant.
- Monter `~/FLEX UP Dropbox/CLAUDE` au début de chaque session — le doc canonique de
  méthode y vit, hors du dossier COCKPIT, et l'étape 0 échoue sans lui.
