# CHANGELOG — App tâches (Cockpit)
_Une entrée datée par fonctionnalité livrée. **Ajout seul.**_

---

## 17 août 2026 — F0 · Squelette en ligne (v0.1)
**https://app-taches-rose.vercel.app** — vérifié en direct : `/api/health` répond
`schema_cockpit: OK` (101 tâches · 9 personnes · 3 blocages), pastille verte à l'accueil.
- Schéma `cockpit` appliqué sur « Flex Up APPS » (migrations `cockpit_001` + `cockpit_002`),
  RLS activé, accès service_role uniquement, `public` intact.
- Seed : 93 tâches (IMPORT-INITIAL, répartition D18 : 15 moi / 30 supervisé / 48 délégué),
  8 chantiers Créer, 3 blocages (Caixa laissé ouvert — cas de test D40), 9 personnes.
- Règles D39/D30/D19/D06 dans `lib/regles.ts`, 7 tests verts (harnais dans le dépôt).
- Repo git à la racine d'APP-TACHES (docs/ et db/ versionnés), script `deploy-app-taches.sh`.
- ⚠️ Domaine : `app-taches-rose.vercel.app` (`app-taches.vercel.app` appartient à un tiers).
- Reste : push GitHub (repo `Flexupworld/app-taches` à créer).

_Le travail du 15 août 2026 (conception, 38 décisions, schéma SQL) n'était pas une
livraison — il relève de `DECISIONS.md` et `PROJECT_STATE.md`._
