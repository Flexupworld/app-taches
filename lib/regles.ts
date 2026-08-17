// ============================================================================
// RÈGLES MÉTIER — emplacement unique (méthode §5 : les règles vivent à un seul
// endroit ; on ne les réimplémente jamais de mémoire dans un second chemin).
// APP_VERSION est ici et nulle part ailleurs.
// ============================================================================

export const APP_VERSION = "0.5";

// ─── Catégories (D03) ───────────────────────────────────────────────────────
export const CATEGORIES = [
  "commercial",
  "administratif",
  "legal",
  "marketing",
  "logistique",
  "finance",
  "tech",
  "ops",
  "perso",
] as const;
export type Categorie = (typeof CATEGORIES)[number];

/** D03 + D06 : « moteur / support » n'est pas un champ saisi — il découle de
 *  la catégorie. Commercial est moteur, les huit autres ne le sont pas. */
export function isCommercial(categorie: Categorie): boolean {
  return categorie === "commercial";
}

// ─── Rails (D30) ────────────────────────────────────────────────────────────
export const RAILS = ["creer", "performer", "mecanique"] as const;
export type Rail = (typeof RAILS)[number];

// ─── Slots du jour (D39 — plafond ferme avec réapprovisionnement) ───────────
// La journée a un nombre fixe de slots. L'app REFUSE d'en ajouter un de plus
// et demande ce qui sort. Une action terminée / déléguée / abandonnée libère
// son slot. Le slot Créer est protégé : jamais pris par Performer ou Mécanique.
// Nombre à caler à l'usage ; départ validé par Manu le 16 août 2026.
export const SLOTS: Record<Rail, number> = {
  creer: 1,
  performer: 2,
  mecanique: 2,
};

/** D39 : un ajout dans un rail plein est refusé — pas d'exception, pas de
 *  dépassement signalé (ça, c'était D14, remplacée). */
export function peutAjouterAuJour(
  rail: Rail,
  occupesDansCeRail: number
): boolean {
  return occupesDansCeRail < SLOTS[rail];
}

/** D30/D39 : le slot Créer est protégé — une tâche Performer ou Mécanique ne
 *  peut jamais le prendre. */
export function railAutoriseDansSlot(slotRail: Rail, tacheRail: Rail): boolean {
  if (slotRail === "creer") return tacheRail === "creer";
  return tacheRail === slotRail;
}

// ─── Classement rail depuis le verbe (D29) ──────────────────────────────────
// Claude propose, Manu corrige. Table unique — ne pas réimplémenter ailleurs.
// Racines, pas des infinitifs : « relance » couvre relance/relancer, etc.
const VERBES_MECANIQUE = [
  "envoy", "vérif", "verif", "check", "appel", "command", "relanc", "relance",
  "pay", "lien", "fix", "corrig", "annul", "déclar", "declar", "récup", "recup",
];
const VERBES_CREER = [
  "cadrer", "concevoir", "définir", "definir", "structurer", "réfléchir",
  "reflechir", "créer", "creer", "remodeler", "remodelage", "proposition",
  "offre", "module", "modèle", "modele", "simulation",
];

/** D29 : proposition de rail depuis le texte. Jamais imposé — Manu corrige. */
export function proposerRail(texte: string): Rail {
  const t = texte.toLowerCase();
  if (VERBES_CREER.some((v) => t.includes(v))) return "creer";
  if (VERBES_MECANIQUE.some((v) => t.includes(v))) return "mecanique";
  return "performer";
}

// ─── Porteur (D19) ──────────────────────────────────────────────────────────
export const PORTEURS = ["moi", "delegue", "supervise"] as const;
export type Porteur = (typeof PORTEURS)[number];

/** D19 : l'écran quotidien n'affiche que `moi`. Le reste est consultable,
 *  jamais imposé. */
export function visibleDansMaJournee(porteur: Porteur): boolean {
  return porteur === "moi";
}
