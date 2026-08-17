// Lectures serveur pour l'écran « Ma journée ».
// Tout passe par le client service_role (lib/supabase) — rien côté navigateur.
import { cockpitClient } from "./supabase";
import type { Rail, Categorie } from "./regles";

export type Tache = {
  id: string;
  raw_capture: string;
  title: string;
  categorie: Categorie;
  entity: string;
  rail: Rail | null;
  porteur: string;
  responsable: string | null;
  interlocuteur: string | null;
  rang: number | null;
  plan: string;
  status: string;
  actif_chantier: boolean;
  due_date: string | null;
  created_at: string;
  done_at: string | null;
};

export type Personne = {
  id: string;
  nom: string;
  type: string;
  actif: boolean;
  est_moi: boolean;
};

export type Blocage = {
  id: string;
  task_id: string | null;
  titre: string;
  attendu: string;
  pourquoi: string;
  declenche: string[] | null;
  responsable: string | null;
  depuis: string;
  relance_le: string | null;
  resolu: boolean;
};

export type Delegation = {
  id: string;
  task_id: string;
  vers: string;
  confie_le: string;
  redemande_le: string | null;
  clos: boolean;
};

export type EcranData = {
  aujourdhui: Tache[];
  reservoir: Tache[];
  autres: Tache[]; // D19 : délégué & supervisé — consultable, jamais imposé
  sessionsParTache: Record<string, number>;
  blocages: Blocage[];
  delegations: Delegation[];
  tachesParId: Record<string, Tache>;
  personnes: Personne[];
  refuseesAujourdhui: string[];
};

export async function chargerEcran(): Promise<EcranData> {
  const sb = cockpitClient();
  const jour = new Date().toISOString().slice(0, 10);

  const [taches, personnes, blocages, delegations, sessions, refus] =
    await Promise.all([
      sb
        .from("task")
        .select("*")
        .neq("plan", "archive")
        .order("rang", { ascending: true, nullsFirst: false }),
      sb.from("people").select("*").eq("actif", true).order("nom"),
      sb.from("blocker").select("*").eq("resolu", false).order("depuis"),
      sb.from("delegation_log").select("*").eq("clos", false).order("confie_le"),
      sb.from("session").select("task_id"),
      sb
        .from("arbitrage")
        .select("task_id")
        .eq("jour", jour)
        .eq("geste", "propose_refuse"),
    ]);

  const premierErreur =
    taches.error ?? personnes.error ?? blocages.error ?? delegations.error ??
    sessions.error ?? refus.error;
  if (premierErreur) throw new Error(premierErreur.message);

  const toutes = (taches.data ?? []) as Tache[];
  const sessionsParTache: Record<string, number> = {};
  for (const s of (sessions.data ?? []) as { task_id: string }[]) {
    sessionsParTache[s.task_id] = (sessionsParTache[s.task_id] ?? 0) + 1;
  }

  // Pour afficher les titres des tâches déléguées/bloquées, on a besoin de
  // toutes les tâches, archivées comprises.
  const archivees = await sb.from("task").select("*").eq("plan", "archive");
  if (archivees.error) throw new Error(archivees.error.message);
  const tachesParId: Record<string, Tache> = {};
  for (const t of [...toutes, ...((archivees.data ?? []) as Tache[])]) {
    tachesParId[t.id] = t;
  }

  return {
    // D19 : l'écran n'affiche que porteur=moi.
    aujourdhui: toutes.filter(
      (t) => t.plan === "aujourdhui" && t.porteur === "moi" &&
        t.status !== "fait" && t.status !== "abandonne"
    ),
    reservoir: toutes.filter(
      (t) => t.plan === "reservoir" && t.porteur === "moi" &&
        t.status !== "fait" && t.status !== "abandonne"
    ),
    autres: toutes.filter(
      (t) => t.porteur !== "moi" &&
        t.status !== "fait" && t.status !== "abandonne"
    ),
    sessionsParTache,
    blocages: (blocages.data ?? []) as Blocage[],
    delegations: (delegations.data ?? []) as Delegation[],
    tachesParId,
    personnes: (personnes.data ?? []) as Personne[],
    refuseesAujourdhui: ((refus.data ?? []) as { task_id: string | null }[])
      .map((r) => r.task_id)
      .filter((x): x is string => x !== null),
  };
}

/** B-13 : recherche par mot-clé — titre et raw_capture, toutes zones confondues,
 *  archive comprise. Lecture pure : ne nourrit rien (compatible D22). */
export async function rechercherTaches(q: string): Promise<Tache[]> {
  const sb = cockpitClient();
  // Neutralise les caractères spéciaux de la syntaxe PostgREST / ilike.
  const propre = q.replace(/[,()%_]/g, " ").trim();
  if (!propre) return [];
  const { data, error } = await sb
    .from("task")
    .select("*")
    .or(`title.ilike.*${propre}*,raw_capture.ilike.*${propre}*`)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw new Error(error.message);
  return (data ?? []) as Tache[];
}

export function joursDepuis(dateISO: string): number {
  const ms = Date.now() - new Date(dateISO).getTime();
  return Math.max(0, Math.floor(ms / 86_400_000));
}
