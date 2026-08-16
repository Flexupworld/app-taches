# ARCHITECTURE — App tâches (Cockpit)
_App version : 0.1 — schéma écrit, **rien n'est déployé**._
_Réécrite le 15 août 2026 après D30–D36. La version précédente (2 surfaces, impact 1-3)
est périmée et supprimée — un document faux est pire qu'un document absent._

## Ce que l'app est
Un outil **personnel et mono-utilisateur** (D25), entre Manu et Claude. Il n'est ni un
outil d'équipe ni un module de LineApp — arbitré le 15 août : LineApp appartient à
l'équipe et à Nathan, celle-ci reste privée.
Sa fonction : **maintenir Manu sur commercial / business development / création**, et
faire sortir le reste de ses mains.

## Stack
- **Front :** Next.js (App Router) sur **Vercel**, comme les autres apps du groupe.
  Responsive — consultable sur téléphone, pas d'app native.
- **Base :** Supabase, projet existant **« Flex Up APPS »** (`cnhkxjinyaaokwobbphg`,
  eu-west-1), dans un **schéma dédié `cockpit`**. Rien n'est écrit dans `public`, où
  vivent Cash Today et Stock Balance.
- **Capture :** via **Dispatch** (CHARTE §4) — Manu dicte depuis Claude mobile, l'agent
  desktop écrit dans la base. Pas de champ de saisie dans l'app (D22).
- **Lecture de contexte :** LineApp (`/dashboard`, `/subscriptions`, `/stripe`,
  `/circuly`, `/inventory`…) en **lecture seule**, pour alimenter le rail Performer.

## Les quatre zones de l'écran
| Zone | Contenu | Règle |
|---|---|---|
| **Créer** | 1 chantier, protégé | avance par sessions, ne se coche pas (D27) |
| **Performer** | performance du jour, outils existants | plusieurs |
| **Mécanique** | nécessaire, chronophage | **à réduire** |
| **Chez quelqu'un d'autre** | confié, avec ancienneté | une seule action : demander (D31) |
| **Je suis bloqué** | dépend d'un tiers | contexte dépliable, rédigé par Claude (D34) |

Le **réservoir** (colonnes par catégorie, filtré sur `porteur = moi`) reste visible en
permanence. Manu peut y piocher sans passer par une proposition.

## Flux de données
```
Manu dicte (Dispatch / Claude mobile)
  └─ raw_capture stocké tel quel                              [D08]
       └─ Claude classe : catégorie · rail · entité · porteur [D29]
            └─ status = inbox → Manu corrige d'un geste       [D22]
                 └─ reservoir (rangé, ordinal)                [D28]
                      └─ Manu ou proposition Claude → aujourdhui
                           └─ chaque geste écrit dans `arbitrage` [D21/D32]
```

## Modèle
Schéma `cockpit`, 6 tables — voir `../db/001_schema.sql` (source de vérité du schéma) :
`people` · `task` · `session` · `delegation_log` · `blocker` · `arbitrage`.

**Ce qui n'existe pas, volontairement :**
- pas de champ `priorite` ni `impact` — remplacés par `rang` ordinal (D28, annule D05)
- pas de champ `moteur` — dérivé de `categorie` par un helper unique (D06)
- pas de suivi d'exécution ni de zone « à valider » — la boucle se ferme chez Wijnand (D23)

## Où vivent les règles _(règle méthode : un seul endroit)_
| Règle | Emplacement unique |
|---|---|
| catégorie → prioritaire ? | `isCommercial(categorie)` |
| verbe dicté → rail | table de résolution du parsing (D29) |
| « Manu » vs « Manuel Wing » | même table de résolution (D10) |
| renumérotation du rang | `reorder(colonne)` |
| remplacement de personne | procédure serveur unique (D09) |
| miroir hebdo + taux de contestation | vue SQL sur `arbitrage` (D32) |

## Divergences ouvertes
- **Plafond du plan du jour non tranché.** D14 dit « alerte souple », Manu a ensuite
  décrit des **slots fermes avec réapprovisionnement**. Le schéma ne borne rien pour
  l'instant. À trancher avant l'écran (B-01bis).
- **Le rail Performer n'a pas encore de source réelle.** Tant qu'il n'est pas branché sur
  LineApp, ce sont des tâches dictées, pas de la performance mesurée.
- **LineApp affiche « sin objetivo definido » sous chaque métrique.** Performer sans
  objectif est du monitoring, pas de la performance. Les cibles n'existent nulle part.
