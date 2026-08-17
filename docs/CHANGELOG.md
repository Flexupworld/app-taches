# CHANGELOG — App tâches (Cockpit)
_Une entrée datée par fonctionnalité livrée. **Ajout seul.**_

---

## 17 août 2026 — Slots calés à l'usage : 2 Créer · 2 Performer · 3 Mécanique (v0.10)
Décision Manu au premier jour d'usage (D48). Le principe ferme (D39) tient, les
nombres bougent. Réserve consignée : le Créer unique était le cœur protecteur de
D30 — le miroir hebdo tranchera si les deux chantiers avancent vraiment.

## 17 août 2026 — Éditer et supprimer les cartes (v0.9)
✎ corrige le titre (la phrase dictée reste intangible et visible) · ✕ abandonne la
carte (soft — la ligne reste en base, le slot se libère). Sur les cartes du jour et
du réservoir. Décision D47 : aucune suppression dure, jamais.

## 17 août 2026 — Les 104 tâches sont visibles (v0.8)
Retour de Manu : « je ne comprends pas où sont les 104 tâches ».
- **Réservoir : les 9 catégories toujours listées** avec leur compte (vides estompées) —
  plus de catégorie qui disparaît quand elle se vide.
- **« Réservoir : x → »** : bouger une carte d'une catégorie à une autre (D16).
- **Nouvelle zone « Délégué & supervisé »** (78 tâches) : consultable, jamais imposée —
  la moitié manquante de D19 existait en base mais nulle part à l'écran. Bouton
  « Reprendre en main ».

## 17 août 2026 — La journée se réorganise (v0.7)
Sur les cartes du jour : ↑ (ordre dans le rail) et les trois tags de rail pour
basculer Performer ↔ Mécanique ↔ Créer. **La bascule vers un rail plein est refusée
comme un ajout (D39), Créer compris.** La « colonne » d'une tâche est désormais
définie à un seul endroit : catégorie au réservoir, rail au jour.

## 17 août 2026 — Ordre des cartes : ⇈ en tête · ↑ passer devant (v0.6)
Demandé par Manu. Fidèle à D28 : ordinal, pas de note — on fait passer une tâche
devant une autre. Renumérotation unique des rangs de seed (doublons corrigés) ;
helper `renumeroter()` unique côté serveur (ARCHITECTURE : reorder). Le menu
déroulant est écarté (lourd) ; le glisser-déposer reste au backlog (B-05) —
à industrialiser seulement si ⇈/↑ ne suffisent pas à l'usage.

## 17 août 2026 — Correctif : dictées invisibles à l'écran (v0.5)
Bug trouvé par Manu à l'usage : une tâche dictée (« onboarding flow Flex Up EU »)
était en base mais invisible — réservoir ET recherche. Cause : le Data Cache de
Next.js ne rafraîchissait les lectures qu'après un geste dans l'app, jamais sur les
écritures venues de l'extérieur (dictée via Claude). Correctif : `no-store` sur
toutes les lectures Supabase, dans `cockpitClient()` (D46).

## 17 août 2026 — Manuel embarqué + sélecteur de rail (v0.4)
Bouton « Manuel » en tête d'écran → `/aide`. Décrit la version en ligne : les trois
rails, les slots fermes, les propositions et le taux de contestation, sortir de mes
mains, je suis bloqué, la recherche, et la grammaire de dictée (D44).
Sélecteur de rail sur les cartes du réservoir : les trois tags côte à côte, clic
direct pour basculer (retour d'usage Manu le jour même — le cycle caché ne se voyait pas).
**Règle d'entretien (méthode) : le manuel se met à jour dans le même mouvement que
chaque livraison — s'il diverge de l'écran, c'est un bug.**

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
