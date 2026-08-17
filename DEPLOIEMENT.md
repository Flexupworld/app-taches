# BRIEF — Premier déploiement App tâches (F0)
_Écrit le 16 août 2026 pour la session maison. **À supprimer une fois F0 vérifié en ligne**
(pas de note orpheline — règle méthode)._

Tout est dans Dropbox : ta machine a déjà le repo à jour. Prérequis : Dropbox synchronisé.

---

## 1. Exposer le schéma à l'API (2 min)
supabase.com → projet **Flex Up APPS** → Settings → API → **Exposed schemas** →
ajouter `cockpit` → Save.
Sans ça, l'app ne peut pas lire la base.

## 2. Premier déploiement (5 min)
```
cd "$HOME/FLEX UP Dropbox/CLAUDE/COCKPIT/APP-TACHES"
bash deploy-app-taches.sh
```
- Si le poste n'est pas connecté à Vercel, le script ouvre le navigateur pour
  `vercel login` (une fois par machine).
- Il lance les tests d'abord — s'ils échouent, rien ne part.
- À la fin il affichera probablement `schema_cockpit: ERREUR` avec
  « variables manquantes » : **normal**, c'est l'étape 3.

## 3. Variables d'environnement (3 min)
vercel.com → projet **app-taches** → Settings → Environment Variables → ajouter :
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Mêmes valeurs que Cash Today (même projet Supabase, « Flex Up APPS »).
Puis relance `bash deploy-app-taches.sh`.

## 4. Vérifier
Ouvre **https://app-taches-rose.vercel.app/api/health**
Attendu : `schema_cockpit: "OK"` avec les comptes (`task: 101`, `people: 9`, `blocker: 3`).
La page d'accueil doit afficher une pastille **verte** :
« Base cockpit jointe — 101 tâches en base ».

## 5. GitHub (backup, quand tu veux)
Créer le repo `Flexupworld/app-taches` sur github.com (**privé, vide** — sans README), puis :
```
cd "$HOME/FLEX UP Dropbox/CLAUDE/COCKPIT/APP-TACHES"
git remote add origin https://github.com/Flexupworld/app-taches.git
git push -u origin main
```

---

**Si ça coince :** `/api/health` dit précisément quoi — copie sa réponse à Claude
dans la session. **F0 est fini quand le health est OK.** Ensuite : écran F1
(« Ma journée » — trois rails à slots fermes, D39).

**Pour ouvrir la session maison :** monter `~/FLEX UP Dropbox/CLAUDE`, la skill
`methode-de-construction` fait le reste (lecture méthode + docs + brief).
