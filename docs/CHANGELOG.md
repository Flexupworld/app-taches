# CHANGELOG — App tâches (Cockpit)
_Une entrée datée par fonctionnalité livrée. **Ajout seul.**_

---

## 17 août 2026 — B-13 · Recherche par mot-clé (v0.3)
Champ de recherche en tête d'écran : titre + `raw_capture`, toutes zones confondues,
archive comprise. Lecture pure — ne nourrit pas la base (nuance D22 assumée).
Arbitrée en priorité par Manu le jour même : « trop compliqué de lire toutes les cartes ».

## 17 août 2026 — F1 v2 · Écran « Ma journée » (v0.2)
**Vérifié en direct** : health v0.2 OK, écran complet à l'accueil.
- Trois rails à **slots fermes avec réapprovisionnement** (D39 : 1 Créer protégé ·
  2 Performer · 2 Mécanique) — l'app **refuse** d'ajouter quand c'est plein et le dit.
- **Propositions** par slot libre, deux boutons : « Aujourd'hui » / « Non » — le Non
  écrit `propose_refuse` et nourrit le **taux de contestation** (D32).
- **Réservoir** filtré `porteur = moi` (D19), rail proposé depuis le verbe (D29,
  corrigeable d'un clic), « Sortir de mes mains » → personne (D20/D24).
- **Je suis bloqué** (D34) : contexte dépliable, bouton « Débloqué » — le cas Caixa
  (43 j) attend son déblocage par Manu (test D40).
- **Chez quelqu'un d'autre** (D31) : ancienneté, « Demander », « C'est fait ».
- Chaque geste écrit dans `arbitrage` (D21/D32). Aucun champ de saisie (D22).
- 8 tests verts (D29 ajouté). Hors périmètre, comme prévu : dictée, miroir hebdo,
  glisser-déposer.

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
