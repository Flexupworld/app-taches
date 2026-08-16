# PROJECT_STATE — App tâches (Cockpit)
_État actuel et prochaine étape, rien d'autre. Réécrit à chaque session._
_App version : 0.1 — schéma appliqué, base seedée, squelette committé. **Pas encore déployé.**_
_Session du 16 août 2026 — **en cours**._

## Où on en est
**Étape 3 (Construction) entamée. F0 (squelette) construit, en attente du premier déploiement.**

Fait le 16 août :
- **D39 confirmée par Manu** (slots fermes 1 Créer · 2 Performer · 2 Mécanique). BACKLOG à jour.
- **Schéma `cockpit` appliqué** sur « Flex Up APPS » (migration `cockpit_001_schema`) —
  6 tables, RLS activé, `public` intact. Grants service_role only (`cockpit_002`).
- **Seed complet** : 93 tâches importées (15 moi / 30 supervisé / 48 délégué — conforme D18),
  8 chantiers Créer, 3 blocages (Caixa seedé OUVERT exprès — cas de test D40), 9 personnes.
- **Squelette Next.js committé** (`d883fdb`) à la racine d'`APP-TACHES` (docs/ et db/ versionnés
  avec le code). Règles D39/D30/D19/D06 dans `lib/regles.ts` (emplacement unique), 7 tests verts,
  build vérifié. `/api/health` + écran « vide mais parlant ».

## Prochaine étape — le premier déploiement (checklist Manu, ~10 min)
1. **Supabase** → projet « Flex Up APPS » → Settings → API → **Exposed schemas : ajouter `cockpit`**.
   Sans ça, l'app ne peut pas lire la base — /api/health le dira noir sur blanc.
2. Terminal : `cd "~/FLEX UP Dropbox/CLAUDE/COCKPIT/APP-TACHES" && bash deploy-app-taches.sh`
   (propose `vercel login` au premier passage ; crée le projet `app-taches`).
3. **Vercel** → projet app-taches → Settings → Environment Variables :
   `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (mêmes valeurs que Cash Today,
   même projet Supabase) → relancer le script.
4. GitHub (backup) : créer `Flexupworld/app-taches`, puis
   `git remote add origin https://github.com/Flexupworld/app-taches.git && git push -u origin main`.
**Fini quand** `/api/health` répond `schema_cockpit: OK` en ligne → alors CHANGELOG + écran F1.

Ensuite : **l'écran F1 v2 « Ma journée »** — trois rails à slots fermes (D39), réservoir
`porteur = moi`, « je suis bloqué », bouton « sortir de mes mains ».

## Arbitrages restant à Manu
- **7 internes manquants** : la liste des 16 n'existe dans aucun fichier. Seedés (sourcés) :
  Manu · Wijnand · Nathan · Edith · Manuel Wing · Gonzalo · Ronald (+ externes Gonzague, Hervé).
- **Les 3 chantiers actifs** : les 8 sont seedés `actif_chantier = false` en attendant que Manu
  confirme (son ordre de 5 — onboarding · remodelage offre · rapport QC · Price Machine ·
  offre Franchise-Affiliate-Leaders — diffère de D35, et « onboarding » n'est dans aucun des 8).
- **Périmètre exact du « Caixa résolu »** (D40) — avant de réécrire le bloc Caixa de COCKPIT.md.
- Le rapport QC client reste chez Manu ou part chez un responsable ? (D18)
- Les deux « remodelages » — un seul chantier ou deux ?
- Hodgson / Ruben / Borja (3 noms sans verbe) · commandes Lift & Firewire (Logistique ou
  Commercial ?) · impayés Flex Up (Finance ou Commercial ?) · les 4 dashboards (un chantier ?)
- Catégorie **Perso** : vide à l'import. La garder ?

## Vigilances
- **D22 est le cœur.** Toute fonctionnalité qui demande une saisie à Manu doit être refusée.
- **Caixa est volontairement OUVERT en base** alors qu'il est résolu dans la vraie vie :
  c'est le scénario de test du cycle blocker → résolu (D40). Ne pas le « corriger » en SQL.
- `raw_capture` = titre d'IMPORT-INITIAL.md (source canonique, D15). Le texte brut BOTTLE NECK
  d'Obsidian n'a pas été récupéré — le vault n'était pas monté. Backfill possible, à arbitrer.
- Monter `~/FLEX UP Dropbox/CLAUDE` au début de chaque session — le doc canonique de méthode
  y vit, hors du dossier COCKPIT, et l'étape 0 échoue sans lui.
