#!/bin/bash
# =====================================================================
#  APP TÂCHES (Cockpit) — déploiement sur Vercel  (v1 — 16 août 2026)
#
#  Ce script ne contient aucun secret et n'en lit aucun.
#
#  Les variables d'environnement (NEXT_PUBLIC_SUPABASE_URL,
#  SUPABASE_SERVICE_ROLE_KEY) sont posées une fois pour toutes sur
#  Vercel et y persistent. Si l'une doit changer, cela se fait par le
#  tableau de bord Vercel, pas ici.
#
#  L'authentification est celle de la machine : « vercel login », une
#  fois par poste. Le script le propose si ce n'est pas encore fait.
#
#  Lancer :   bash deploy-app-taches.sh
# =====================================================================
set -e

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC="$HERE"

NODEDIR="$HOME/.app-taches/node"

# ------------------------------------------------------------- Contrôles
if [ ! -d "$SRC/.git" ]; then
  echo "✗ $SRC n'est pas un dépôt git — rien n'a été déployé."
  exit 1
fi

if ! command -v git >/dev/null 2>&1; then
  echo "✗ git est introuvable sur ce poste."
  echo "  Sur macOS : lance « xcode-select --install » puis relance ce script."
  exit 1
fi

echo "▸ Source   : $SRC"

# ------------------------------------------------------------------ Node
if command -v npx >/dev/null 2>&1; then
  echo "▸ Node     : $(node -v)"
else
  if [ ! -x "$NODEDIR/bin/npx" ]; then
    echo "▸ Installation locale de Node (aucun droit administrateur requis)…"
    case "$(uname -m)" in
      arm64)  ARCH="darwin-arm64" ;;
      x86_64) ARCH="darwin-x64"   ;;
      *) echo "Architecture inconnue : $(uname -m)"; exit 1 ;;
    esac
    FILE=$(curl -fsSL https://nodejs.org/dist/latest-v22.x/SHASUMS256.txt | grep "$ARCH.tar.gz" | awk '{print $2}' | head -1)
    mkdir -p "$NODEDIR"
    curl -fsSL "https://nodejs.org/dist/latest-v22.x/$FILE" | tar -xz -C "$NODEDIR" --strip-components=1
  fi
  export PATH="$NODEDIR/bin:$PATH"
  echo "▸ Node     : $(node -v)"
fi

# ------------------------------------------------------------------ Tests
# Méthode §3 : les tests tournent AVANT chaque déploiement, pas quand
# quelque chose paraît suspect. S'ils échouent, rien ne part.
cd "$SRC"
echo "▸ Tests…"
npm test

V="npx --yes vercel@latest"

# ------------------------------------------------- Identité Vercel du poste
if $V whoami >/dev/null 2>&1; then
  echo "▸ Vercel   : connecté en tant que $($V whoami 2>/dev/null | tail -1)"
else
  echo "▸ Vercel   : ce poste n'est pas encore connecté."
  echo "  Une fenêtre de navigateur va s'ouvrir pour t'identifier. C'est à faire une seule fois."
  $V login
  if ! $V whoami >/dev/null 2>&1; then
    echo "✗ Connexion Vercel non aboutie — rien n'a été déployé."
    exit 1
  fi
  echo "▸ Vercel   : connecté en tant que $($V whoami 2>/dev/null | tail -1)"
fi

# -------------------------------------------- Enregistrement avant déploiement
if [ -n "$(git status --porcelain)" ]; then
  git add -A
  git commit -q -m "Déploiement du $(date '+%d/%m/%Y à %H:%M')"
  echo "▸ Modifications enregistrées dans git."
else
  echo "▸ Rien de nouveau depuis le dernier enregistrement."
fi

# Pousse vers GitHub si un remote existe (méthode : committé ET poussé).
if git remote get-url origin >/dev/null 2>&1; then
  git push -q origin main || echo "  ⚠ push GitHub non abouti — à vérifier."
  echo "▸ Poussé vers GitHub."
fi

COMMIT=$(git rev-parse --short HEAD)
echo "▸ Version  : $COMMIT — $(git log -1 --format=%s)"

# ------------------------------------------------------------ Projet Vercel
if [ -f "$SRC/.vercel/project.json" ]; then
  echo "▸ Projet   : déjà lié (.vercel/project.json)"
else
  echo "▸ Liaison du projet…"
  $V link --yes --project app-taches
fi

# ---------------------------------------------------------------- Déploiement
echo
echo "▸ Déploiement en production…"
$V deploy --prod --yes

git tag -f "en-ligne" >/dev/null 2>&1 || true
git tag -f "deploiement-$(date '+%Y%m%d-%H%M')" >/dev/null 2>&1 || true

# ------------------------------------------------- Vérification après coup
echo
echo "▸ Vérification de l'application en ligne…"
sleep 5
SANTE=$(curl -fsS --max-time 20 https://app-taches.vercel.app/api/health 2>/dev/null || echo '')
if [ -z "$SANTE" ]; then
  echo "  ⚠ /api/health n'a pas répondu. Ouvre https://app-taches.vercel.app/api/health"
  echo "    dans le navigateur — le déploiement peut simplement être encore en cours."
else
  echo "$SANTE"
  case "$SANTE" in
    *'"schema_cockpit":"OK"'*) echo "  ✓ Base accessible, variables d'environnement en place." ;;
    *) echo "  ⚠ Réponse inattendue — lis le champ « diagnostic » ci-dessus." ;;
  esac
fi

echo
echo "======================================================"
echo " Version en ligne : $COMMIT"
echo " https://app-taches.vercel.app"
echo "======================================================"
