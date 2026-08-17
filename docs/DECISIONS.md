# DECISIONS — App tâches (Cockpit)
_Une ligne par décision structurelle, avec sa raison. **Ajout seul. Jamais réécrit.**_
_App version : 0 (pré-construction)_

---

**D01 — Pas de dashboard. Uniquement de la gestion de tâches.** _(15 août 2026, Manu)_
Aucun chiffre de pilotage (CA, abonnements, pipe) dans l'app.
_Raison : ces données existent déjà ailleurs. Les dupliquer ici créerait une seconde
source de vérité et une ressaisie._

**D02 — Base de données : Supabase.** _(15 août 2026, Manu)_
Postgres + auth, connecteur déjà en place, intégration native Vercel.
_Raison : la seule option qui n'ajoute pas une brique à administrer._

**D03 — Neuf catégories, une seule prioritaire.** _(15 août 2026, Manu)_
**Commercial** (prioritaire) · Administratif · Légal · Marketing · Logistique ·
Finance · Tech · Ops · Perso.
_Raison : la priorité doit être portée par une propriété stable, pas par un jugement
répété à chaque tâche. Commercial = ventes et leur monitoring, abonnements, vente
d'articles, business development — l'activité principale de Manu._

**D04 — Deux surfaces distinctes : réservoir et plan du jour.** _(15 août 2026)_
Le réservoir range par catégorie en colonnes. Le plan du jour a deux couloirs :
Commercial (plus large, en haut) et Le reste. On tire de l'un vers l'autre.
_Raison : une tâche ne change pas de catégorie en devenant prioritaire — elle change
d'écran. Empiler catégorie + priorité + importance sur un seul écran le rend illisible._

**D05 — L'ordre de passage et l'impact sont deux choses séparées.** _(15 août 2026)_
Ordre = position dans le couloir (glisser-déposer, pas de champ). Impact = 1 à 3,
propriété stable de la tâche.
_Raison : un score de priorité **et** un ordre finissent toujours par se contredire.
Ne jamais réintroduire de champ « priorité »._

**D06 — « Moteur / support » n'est pas un champ saisi ; il découle de la catégorie.**
_(15 août 2026)_ Commercial est moteur, les huit autres ne le sont pas.
_Raison : un axe de saisie en moins, et le critère reste structurant._

**D07 — Deux champs personne : `responsable` et `interlocuteur`.** _(15 août 2026, Manu)_
Responsable = qui exécute. Interlocuteur = qui est en face.
_Raison : « lien de paiement harnais — Gonzague » a Gonzague comme client, pas comme
exécutant. Un champ unique rendrait impossible « tout ce qui attend Nathan »._

**D08 — `raw_capture` est conservé et jamais écrasé.** _(15 août 2026)_
La phrase dictée reste, à côté du titre nettoyé par le parsing.
_Raison : c'est ce qui rend la dictée sûre. Si le parsing se trompe, l'original est là._

**D09 — Le remplacement d'une personne ne renomme jamais.** _(15 août 2026, Manu)_
Départ : on désactive (`actif = false`, `sorti_le`, `remplace_par`), on crée le nouveau,
et **seules les tâches ouvertes** basculent. Les tâches terminées gardent leur nom.
Pas de suppression dure si la personne est liée à une tâche.
_Raison : écraser le libellé rendrait l'archive fausse — le travail de l'un
apparaîtrait comme fait par son successeur. Un historique faux est pire qu'absent._

**D10 — Manu ≠ Manuel Wing.** _(15 août 2026, Manu)_
« Manu » seul → le propriétaire du cockpit. « Manuel » seul → Manuel Wing.
En cas de doute, la tâche part en `inbox` avec les deux candidats.
_Raison : Wispr Flow transcrit du son et ne les distingue pas. Un arbitrage silencieux
attribuerait des tâches au mauvais destinataire._

---
## Étape 1 — Périmètre : franchie le 15 août 2026

**D11 — L'app est construite malgré son échec à la question 2 du filtre, à condition
d'être amorcée par l'existant.** _(15 août 2026, Manu — arbitrage B-00)_
L'app ne se nourrit d'aucune source existante : elle repose intégralement sur une
nouvelle habitude de saisie. Manu assume le pari, **sous réserve de l'import de
`COCKPIT.md` et `TODO.md` au démarrage** (ex-B-06), qui devient donc une condition
de périmètre et non un confort.
_Raison : le risque n'est pas la saisie en régime établi, c'est l'écran vide du
premier jour. Une app qui s'ouvre pleine a une chance d'être adoptée ; une app vide
qu'il faut nourrir avant d'être utile n'en a aucune. Le pari restant — « dicter est
plus rapide que ne rien noter » — est explicitement accepté par Manu, et sera vérifié
à l'usage, pas supposé._

**D12 — Le réservoir se purge par remontée automatique, pas par rituel.**
_(15 août 2026, Manu — arbitrage B-02)_ Une tâche non touchée depuis 6 semaines
remonte pour arbitrage : garder / requalifier / tuer.
_Raison : un entretien qui dépend d'une discipline hebdomadaire ne sera pas tenu.
Le mécanisme doit survivre à l'oubli._

**D13 — L'app signale son propre silence.** _(15 août 2026, Manu)_
Si aucune capture n'entre pendant X jours, l'app le dit.
_Raison : c'est le détecteur d'abandon précoce. Sans lui, on apprend que l'outil est
mort le jour où on le rouvre — trop tard pour corriger._

**D14 — Plafond du plan du jour : alerte souple.** _(15 août 2026, Manu — arbitrage B-01)_
3 Commercial + 2 Reste. L'app laisse dépasser et le signale. À durcir si l'usage déborde.
_Raison : plafonner dur avant d'avoir observé l'usage réel serait un réglage décidé
à l'aveugle._
⚠️ _Susceptible d'être remplacée : Manu a décrit ensuite un modèle à **slots fermes avec
réapprovisionnement** (une action faite libère un slot). Non tranché — cf. B-01bis._

**D15 — Import unique du vault Obsidian, puis abandon.** _(15 août 2026, Manu)_
`~/Obsidian Vault/TODO/` (14 fichiers, ~93 tâches ouvertes) est importé **une seule fois**.
Ensuite tout se traite dans l'app. Le vault n'est plus alimenté.
_Raison : deux systèmes vivants = deux sources de vérité, interdit par la méthode.
Ferme B-08._

**D16 — La classification Obsidian n'est pas reprise.** _(15 août 2026, Manu)_
Les tâches sont reclassées dans les 9 catégories, indépendamment du fichier d'origine.
Claude propose une première affectation (catégorie + impact) ; Manu la corrige ensuite
par glisser-déposer.
_Raison : la structure Obsidian (NOW / DEADLINE / COOKING / par personne) mélangeait
urgence, nature et responsable sur un seul axe. C'est une des raisons pour lesquelles
elle n'a pas tenu._

**D17 — Constat versé au dossier : le système précédent est mort en 6 mois.**
_(15 août 2026, Claude — constat, pas décision)_
`MASTER CHECKLIST.md` : dernière mise à jour 2026-02-06. `NOW.md` et `RONALD.md` cochés
à 100 % et jamais réalimentés. `MEET.md` : une ligne. `MAILS.md` et `EDITH.md` : vides.
Le seul fichier vivant est `BOTTLE NECK.md` — 45 lignes de jet brut, sans structure.
_Portée : le pari de D11 (« la saisie tiendra ») a **déjà échoué une fois sur ce même
contenu**. Ce constat est consigné pour qu'il ne soit pas re-perdu. Il valide en revanche
le choix de `raw_capture` + inbox (D08) : le comportement réel de Manu est de vider, pas
de ranger._

---
## Réorientation du 15 août 2026 — l'app n'est pas une to-do list

**D18 — Contexte : Wijnand, directeur général, prend le management du groupe.**
_(15 août 2026, Manu)_ Il supervise les responsables de secteur et porte **marketing et
finance** en direct. Le rôle de Manu se resserre sur **commercial, business development,
vision produit** et le monitoring quotidien de la performance.
_Conséquence directe sur l'app : sur les 93 tâches importées, **15 relèvent de Manu**,
30 de Wijnand, 48 des responsables de secteur. L'app ne doit pas aider Manu à faire 93
tâches — elle doit l'aider à en **sortir 78**._

**D19 — Troisième axe : `porteur`.** _(15 août 2026)_
Valeurs : `moi` · `délégué à X` · `supervisé par Wijnand`.
L'écran quotidien n'affiche que `moi`. Le reste est consultable, jamais imposé.
_Raison : le réservoir doit montrer le **périmètre** de Manu, pas sa charge historique._

**D20 — Le second couloir est un couloir de délégation, pas de travail secondaire.**
_(15 août 2026)_ Renommé « À sortir de mes mains ». Une tâche en sort par une **décision
de délégation**, pas par une exécution.
_Raison : c'est le geste que Manu doit répéter quotidiennement pendant sa transition.
L'app doit rendre ce geste plus facile que l'exécution._

**D21 — L'app conserve la trace des arbitrages de Manu.** _(15 août 2026, Manu)_
Ce qui est entré dans « ma journée », quand, et ce qui en est ressorti.
_Raison : Manu sera jugé sur sa sélection de priorités et ses résultats. Ce n'est pas
un dashboard business (D01 tient) — c'est l'historique de ses décisions._

**D22 — Règle de conception non négociable : Claude écrit, Manu corrige.**
_(15 août 2026, Manu + Claude)_ Manu dicte en vrac ; Claude classe, propose la journée,
tient la base à jour. Manu ajuste d'un geste. **Aucun formulaire à remplir.**
_Raison : la raison d'être de cette V2. Toutes les tentatives précédentes (Obsidian,
NOW.md, MAILS.md) sont mortes parce qu'elles attendaient que Manu vienne les alimenter.
Le facteur différenciant identifié par Manu n'est pas l'outil, c'est l'interaction
quotidienne avec Claude — déjà tenue sur Cash Today et les autres apps du groupe.
**Si à un moment du design Manu doit remplir un champ, le design est faux.**_

**D23 — La boucle de délégation ne passe pas par notre app.** _(15 août 2026, Manu)_
Manu émet et attribue ; **Wijnand arbitre la priorité** dans la charge du responsable ;
le résultat remonte à Manu pour validation. Mais la délégation se fait à l'oral / WhatsApp
/ en réunion, et **Wijnand a son propre outil**.
→ Donc : pas de zone « à valider », pas de suivi d'exécution, pas de remontée automatique.
_Raison : sans source écrite, la seule façon de fermer la boucle serait que Manu saisisse
lui-même l'avancement de tâches qu'il ne fait pas. C'est la forme de to-do list qui pourrit
le plus vite, et elle viole D22. La boucle se ferme chez Wijnand — c'est son métier._

**D24 — Le second couloir devient un journal de délégation, pas une colonne active.**
_(15 août 2026)_ Quand Manu sort une tâche de ses mains, l'app enregistre **quoi, à qui,
quand** — puis la range. Elle ne réapparaît pas, ne relance pas, n'affiche pas de statut.
_Raison : une liste de choses qu'on ne fait pas et qui ne se ferme jamais devient du bruit
en quelques semaines. Sa valeur est celle d'une archive (cf. D21 : trace des arbitrages),
pas celle d'un suivi._

**D25 — Périmètre V1 : les 15 tâches de Manu + le geste d'émission.** _(15 août 2026, Manu)_
Aucune dépendance à l'adoption d'un outil par l'équipe.
_Raison : la transition de Manu est déjà un pari. Y empiler l'adoption d'un outil par
quinze personnes, c'est un second pari qui ne dépend pas de lui._

**D26 — Deux natures de tâche, deux rails séparés : chantier et expédition.**
_(15 août 2026, Manu)_
- **Chantier** — projet, réflexion, création. Demande du temps et de la concentration,
  ne se termine pas forcément en une journée. **Un seul par jour, protégé.**
- **Expédition** — mécanique, rapide, peu d'implications. Plusieurs par jour, à écouler.

_Raison : les deux ne consomment pas la même ressource — l'une des minutes, l'autre de
l'attention. Dans des slots communs, **le mécanique gagne toujours** : plus facile, il
se termine, il donne la satisfaction de cocher. C'est le mécanisme exact par lequel le
travail de fond de Manu s'est fait écraser ces deux dernières années. La séparation
n'est pas cosmétique, elle est protectrice._
**Règle rigide : une expédition ne peut jamais prendre la place du chantier.**

**D27 — Le chantier n'a pas de case à cocher ; il avance par sessions.**
_(15 août 2026)_ Deux gestes : « j'y ai travaillé » (ajoute une session) et « c'est
bouclé » (clôt). L'app affiche le nombre de sessions et la date de la dernière.
_Raison : marquer « fait » une tâche de fond au bout d'une journée est faux. C'est ce
faux qui a tué `NOW.md` — soit Manu cochait des choses non finies, soit il ne cochait
rien et la liste croupissait._

**D28 — Suppression de l'impact 1-3, remplacé par un ordre dans la colonne.**
_(15 août 2026, Manu)_ Manu ne note pas une tâche : il la fait passer devant une autre.
Ordinal, pas cardinal. **Annule et remplace la partie « impact » de D05** (la séparation
ordre / importance disparaît : il n'y a plus qu'un ordre).
_Raison : Manu — « elles sont en fonction les unes des autres ». Un score absolu ne
décrit pas une priorité relative. Et c'est un champ de moins à tenir, conforme à D22._

**D29 — Le classement chantier/expédition est proposé par Claude depuis le verbe dicté.**
_(15 août 2026)_ « envoyer, vérifier, appeler, commander, relancer » → expédition ;
« cadrer, concevoir, définir, structurer, réfléchir » → chantier. Plus le test : est-ce
que ça se termine en une fois ? Manu corrige, Claude se calibre.
_Raison : conforme à D22 — Claude propose, Manu corrige. Un classement qui s'améliore
avec l'usage, là où un formulaire ne s'améliore jamais._

---
## Le modèle définitif des rails — 15 août 2026

**D30 — Trois rails, pas deux. Annule et remplace D26.** _(15 août 2026, Manu)_
- **Créer** — développer le modèle, créer des modules, aller vers de nouveaux
  partenaires, marques, affiliés. **Un seul par jour, protégé.** Avance par sessions (D27).
- **Performer** — augmenter la performance du jour avec les **outils existants** :
  ventes, abonnements, monitoring.
- **Mécanique** — simple, chronophage, nécessaire. **À réduire au maximum.**

_Raison : D26 ne connaissait que « chantier » et « expédition » et manquait « Performer »,
que Manu identifie comme le quotidien de son nouveau rôle. Le mot « expédition » est
également abandonné : lu au sens propre (envoi de colis), il était ambigu._

**D31 — « Chez quelqu'un d'autre » resurgit. Nuance D24.** _(15 août 2026, Manu)_
Une tâche confiée est taguée au nom de la personne et **réapparaît** avec l'ancienneté
(« Pablo, depuis 6 j »). **Une seule action possible : demander.** Pas de statut, pas
d'avancement, pas de relance automatique.
_Raison : Manu veut pouvoir vérifier qu'une chose confiée a bien été faite. C'est un
aide-mémoire de conversation, pas un suivi de projet — la distinction préserve D23
(la boucle se ferme chez Wijnand, pas ici)._

**D32 — Le miroir hebdomadaire : répartition du temps entre les trois rails.**
_(15 août 2026, Claude, validé par le cadrage de Manu)_
Une seule mesure dans l'app : le pourcentage de Créer / Performer / Mécanique sur la
semaine. **Ne viole pas D01** (pas de dashboard) : elle ne mesure pas le business, elle
mesure Manu. Se déduit des gestes quotidiens, **sans aucune saisie supplémentaire** (D22).
_Raison : Manu doit démontrer à Wijnand et à ses partenaires qu'il tient son recentrage.
Ce ratio est la preuve, et c'est le seul livrable de l'app qui parle de sa transition._
⚠️ _Deux limites à ne pas oublier : (1) la cible n'est pas 100 % Créer — si le chiffre
devient une note, il sera truqué ou fui ; (2) il ne mesure que ce qui est déclaré._

**D33 — Constat : le rail Créer est vide à l'import.** _(15 août 2026, Claude)_
Les 15 tâches commerciales importées sont des liens de paiement, listings et
vérifications de prix — du Performer et du Mécanique. Aucun projet de fond.
_Portée : les vrais chantiers de Manu (Decathlon, nouveaux modules, affiliés, marques)
**n'existent dans aucun fichier**. Première action attendue dans l'app : les dicter.
Trier les 93 tâches existantes est secondaire._

**D34 — Quatrième zone : « Je suis bloqué ».** _(15 août 2026, Manu)_
Distincte de « chez quelqu'un d'autre » (D31) :
- **Délégué** (D31) → quelqu'un fait le travail, Manu vérifie de temps en temps.
- **Bloqué** (D34) → Manu **ne peut pas avancer** tant qu'un tiers n'a pas répondu.
  Ce n'est pas du travail confié, c'est une décision suspendue.

Chaque blocage porte : ce qu'on attend · pourquoi ça bloque · ce que ça déclenche ensuite ·
l'ancienneté · la date de relance · le responsable du dossier. Consultable en dépliant,
jamais affiché en entier dans l'écran principal.
**Le contexte est rédigé par Claude depuis la conversation de Manu** — jamais saisi (D22).
_Raison : c'est ce qui rend cette zone tenable là où Slack et Asana ne l'ont jamais été
pour Manu — il n'aime pas les process à forte interaction ni le multi-utilisateur (D25)._

**D35 — Trois chantiers actifs maximum, le reste en réserve explicite.**
_(15 août 2026, Claude — à valider par Manu)_ Avec un seul slot Créer protégé par jour et
plusieurs sessions par chantier, huit chantiers en parallèle produisent un cycle de
plusieurs mois pendant lequel la majorité dort.
_Raison : c'est le mécanisme exact d'Obsidian (D17). Une réserve explicite n'est pas un
cimetière ; une liste de huit projets « actifs » en est un._

**Chantiers Créer dictés le 15 août 2026 :**
| Chantier | Statut proposé |
|---|---|
| Proposition Decathlon — tentes sur modèle Ledger | actif |
| Offre Flex Up : Franchise, Affiliate, Leaders | actif |
| Simulation Flex Up pour Ion Club + transition | actif |
| Module retour matériel Flex Up Europe + workshop (réparation voile, réparation planche, studio photo, mise en ligne) | réserve |
| Mise à jour du Flex Up Price Machine | réserve |
| Remodelage offre — pénalités et réparations | réserve _(même objet que le suivant ?)_ |
| Remodelage présentation — frais de sortie | réserve _(même objet que le précédent ?)_ |
| Finaliser le modèle de rapport Quality Check client | ⚠️ Ops — devrait sortir des mains de Manu (D18) |

**D36 — Decathlon et Ion Club ne sont pas écartés : ils sont séquencés.**
_(15 août 2026, Manu)_ Ils dépendent des outils que Manu construit d'abord (onboarding,
remodelage de l'offre, rapport QC, Price Machine, offre Franchise-Affiliate-Leaders).
État : **bloqué par mes propres chantiers** — distinct de « réserve » (D35) et de
« bloqué par un tiers » (D34).
_Raison : la liste des 5 chantiers n'est pas une liste, c'est une chaîne. L'app doit
montrer ce qu'ils débloquent, sinon le travail quotidien perd sa raison d'être._
⚠️ _Tension assumée : l'horloge de Decathlon ne s'arrête pas pendant la construction._

**D37 — L'app reste séparée de LineApp.** _(15 août 2026, Manu)_
LineApp (`lineapp-production-b662.up.railway.app`) est une plateforme d'équipe complète
— `/shop` `/items` `/inventory` `/subscriptions` `/stripe` `/circuly` `/flexup`
`/damages` `/refunds` `/simulator` `/intercompany` `/assistant` — portée par Nathan et
destinée à l'équipe et aux partenaires.
Claude s'y **connecte en lecture** pour alimenter le rail Performer, mais **n'y écrit
rien** et n'y ajoute aucun module.
_Raison (Manu) : « je ne souhaite pas intervenir dans le travail de Nathan. J'ai besoin
que cette app soit personnelle, c'est quelque chose entre toi et moi. »_
_Conforme au garde-fou méthode §5 : lecture seule sur les sources de vérité._

**D38 — Validations du 15 août (fin de session, Manu).**
- GitHub + Vercel : **OK**, comme les autres apps du groupe.
- Supabase : **OK** — schéma dédié `cockpit` dans le projet existant « Flex Up APPS »
  (`cnhkxjinyaaokwobbphg`). Aucun nouveau projet, aucun coût, `public` non touché.
- **Plan F1 v2 : validé.** Étape 2 de la méthode franchie → la construction peut commencer.
- Dashboard LineApp : **pas d'exposition** — la session était ouverte dans le navigateur,
  et l'app est privée. Alerte levée.

**D39 — Plafond ferme à slots avec réapprovisionnement. Annule et remplace D14.**
_(15 août 2026, Manu — arbitrage B-01bis)_
La journée a un nombre fixe de slots. **L'app refuse d'en ajouter un de plus** et demande
ce qui sort. Une action terminée, déléguée ou abandonnée **libère son slot** ; l'app
propose alors un candidat (jamais une présélection — cf. D22 et le bouton « je choisis
moi-même »).
Le slot **Créer** reste protégé : aucune tâche Performer ou Mécanique ne peut le prendre (D30).
_Raison : un plafond franchissable ne force aucune sélection. Manu sera jugé sur sa
sélection de priorités — la rareté est le mécanisme, pas un effet de bord._
_Nombre de slots à caler à l'usage ; départ proposé : 1 Créer · 2 Performer · 2 Mécanique._

**D40 — Cas de test de référence : le déblocage Caixa.** _(15 août 2026, Manu)_
Le litige frais Caixa est **résolu**. Il sert de premier scénario de test réel du cycle
`blocker` → résolu : une entrée bloquée depuis 42 jours, avec son contexte, ses relances
et son responsable, que Manu débloque dans l'app.
_Raison : tester le cycle sur une donnée vraie plutôt que sur un jeu fictif. Conforme à la
méthode §3 (tests de référence : un cas connu, résultat attendu écrit en dur)._
⚠️ _Périmètre exact du « résolu » à préciser avant de réécrire le bloc Caixa de COCKPIT.md
— ne pas consigner un état vague._

---
## Étape 3 — Construction : F0 livré le 17 août 2026

**D41 — Le dépôt git vit à la racine d'APP-TACHES, docs et schéma inclus.**
_(16 août 2026, Claude — construction F0)_
Un seul dossier = une seule application : `docs/`, `db/` et le code Next.js dans le même
repo, contrairement à Cash Today (repo `cash-today/` séparé, docs dedans).
_Raison : méthode §3 — le harnais et les documents vivent dans le dépôt, versionnés. Les
docs préexistaient à la racine ; les déplacer aurait cassé les références de COCKPIT.md._

**D42 — Accès base : Data API avec schéma `cockpit` exposé, service_role uniquement.**
_(17 août 2026, Claude, constaté avec Manu)_
`cockpit` ajouté aux « Exposed schemas » du Data API ; grants au seul `service_role`
(migration `cockpit_002`). `anon` et `authenticated` : aucun droit — vérifié en direct
(42501 permission denied). L'app parle à la base exclusivement côté serveur.
_Raison : D25 (mono-utilisateur) — aucune raison d'ouvrir la moindre lecture au navigateur._

**D43 — Le domaine de production est `app-taches-rose.vercel.app`.**
_(17 août 2026, constaté)_
`app-taches.vercel.app` appartient à un tiers (« Ma Todo App ») — les sous-domaines
vercel.app sont globaux. Script et docs pointent sur le domaine réel.
_Raison : consigné pour ne pas re-vérifier un « faux 404 » à chaque session._

**D44 — Grammaire de capture pour les personnes.** _(17 août 2026, Manu)_
- « **avec X** » → la tâche reste chez Manu, X en `interlocuteur` (D07). Compte dans ses slots.
- « **délégué X** » / « **pour X** » → sort de ses mains : `porteur=delegue`,
  `delegation_log`, visible dans « Chez quelqu'un d'autre » (D31).
- « **surveiller** » → `porteur=supervise` (le monde de Wijnand, D19). Jamais dans sa journée.
- **Ambigu (« = X ») → Claude demande**, il n'arbitre pas en silence.
_Raison : née d'une vraie erreur le jour même — « fix bob / circuly = nathan » lu comme une
délégation alors que Manu voulait la faire AVEC Nathan. Même logique que D10 : un arbitrage
silencieux attribue mal. S'ajoute à la table de résolution du parsing (D29/D10)._

**D45 — « Onboarding » n'est pas un chantier Créer : c'est du Performer avec Nathan.**
_(17 août 2026, Manu)_
L'« onboarding » de l'ordre de 5 donné le 15 août = la tâche dictée « Terminer
l'onboarding flow Flex Up EU » (ops · performer · avec Nathan). L'écart entre l'ordre
de 5 et les 8 chantiers dictés est donc résolu.
_Conséquence : il reste 4 candidats pour les 3 slots de chantiers actifs (D35) :
remodelage offre (un ou deux ?) · rapport QC (⚠️ D18 : devrait sortir des mains de Manu) ·
Price Machine · offre Franchise-Affiliate-Leaders. Le choix des 3 reste à Manu._
