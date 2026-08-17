"use server";
// Tous les gestes de l'écran. Chaque geste écrit dans `arbitrage` (D21/D32).
// Les règles (slots D39, rails D30) sont appliquées ICI, côté serveur —
// l'interface ne fait que présenter des boutons (D22 : aucun formulaire).
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cockpitClient } from "@/lib/supabase";
import { peutAjouterAuJour, proposerRail, RAILS, type Rail } from "@/lib/regles";

async function consigner(
  taskId: string | null,
  geste: string,
  rail: string | null
) {
  const sb = cockpitClient();
  const { error } = await sb
    .from("arbitrage")
    .insert({ task_id: taskId, geste, rail });
  if (error) throw new Error(`arbitrage : ${error.message}`);
}

async function slotsOccupes(rail: Rail): Promise<number> {
  const sb = cockpitClient();
  const { count, error } = await sb
    .from("task")
    .select("*", { count: "exact", head: true })
    .eq("plan", "aujourdhui")
    .eq("rail", rail)
    .eq("porteur", "moi")
    .not("status", "in", '("fait","abandonne")');
  if (error) throw new Error(error.message);
  return count ?? 0;
}

/** Mettre une tâche au jour — refus ferme si le rail est plein (D39). */
export async function mettreAujourdhui(taskId: string, viaProposition: boolean) {
  const sb = cockpitClient();
  const { data: t, error } = await sb
    .from("task")
    .select("id, title, raw_capture, rail")
    .eq("id", taskId)
    .single();
  if (error) throw new Error(error.message);

  // D29 : si le rail n'est pas encore classé, Claude propose — Manu corrige
  // ensuite d'un geste (bouton rail sur la carte).
  const rail: Rail = (t.rail as Rail) ?? proposerRail(t.title ?? t.raw_capture);

  if (!peutAjouterAuJour(rail, await slotsOccupes(rail))) {
    // D39 : l'app refuse — pas d'exception. Le refus est porté à l'écran.
    revalidatePath("/");
    redirect(`/?refus=${rail}`);
  }

  const { error: e2 } = await sb
    .from("task")
    .update({ plan: "aujourdhui", rail, status: "actif" })
    .eq("id", taskId);
  if (e2) throw new Error(e2.message);
  await consigner(taskId, viaProposition ? "propose_accepte" : "mis_au_jour", rail);
  revalidatePath("/");
}

/** Refuser la proposition du jour — nourrit le taux de contestation (D32). */
export async function refuserProposition(taskId: string, rail: string) {
  await consigner(taskId, "propose_refuse", rail);
  revalidatePath("/");
}

/** Marquer fait (Performer / Mécanique — un chantier ne se coche pas, D27). */
export async function marquerFait(taskId: string) {
  const sb = cockpitClient();
  const { data: t, error } = await sb
    .from("task")
    .select("rail")
    .eq("id", taskId)
    .single();
  if (error) throw new Error(error.message);
  const { error: e2 } = await sb
    .from("task")
    .update({ status: "fait", done_at: new Date().toISOString() })
    .eq("id", taskId);
  if (e2) throw new Error(e2.message);
  await consigner(taskId, "fait", t.rail);
  revalidatePath("/");
}

/** « J'y ai travaillé » — ajoute une session au chantier (D27). */
export async function ajouterSession(taskId: string) {
  const sb = cockpitClient();
  const { error } = await sb.from("session").insert({ task_id: taskId });
  if (error) throw new Error(error.message);
  await consigner(taskId, "session", "creer");
  revalidatePath("/");
}

/** « C'est bouclé » — clôt le chantier (D27). */
export async function cloturerChantier(taskId: string) {
  const sb = cockpitClient();
  const { error } = await sb
    .from("task")
    .update({ status: "fait", done_at: new Date().toISOString() })
    .eq("id", taskId);
  if (error) throw new Error(error.message);
  await consigner(taskId, "fait", "creer");
  revalidatePath("/");
}

/** Reporter — la tâche retourne au réservoir, le slot se libère. */
export async function reporterAuReservoir(taskId: string) {
  const sb = cockpitClient();
  const { data: t } = await sb.from("task").select("rail").eq("id", taskId).single();
  const { error } = await sb
    .from("task")
    .update({ plan: "reservoir", status: "actif" })
    .eq("id", taskId);
  if (error) throw new Error(error.message);
  await consigner(taskId, "reporte", t?.rail ?? null);
  revalidatePath("/");
}

/** « Sortir de mes mains » (D20/D24) : quoi, à qui, quand — puis rangée. */
export async function sortirDesMains(taskId: string, personneId: string) {
  const sb = cockpitClient();
  const { data: t } = await sb.from("task").select("rail").eq("id", taskId).single();
  const { error } = await sb.from("delegation_log").insert({
    task_id: taskId,
    vers: personneId,
  });
  if (error) throw new Error(error.message);
  const { error: e2 } = await sb
    .from("task")
    .update({ plan: "archive", porteur: "delegue", responsable: personneId })
    .eq("id", taskId);
  if (e2) throw new Error(e2.message);
  await consigner(taskId, "delegue", t?.rail ?? null);
  revalidatePath("/");
}

/** D31 : une seule action possible sur une tâche confiée — demander. */
export async function demander(delegationId: string) {
  const sb = cockpitClient();
  const { error } = await sb
    .from("delegation_log")
    .update({ redemande_le: new Date().toISOString().slice(0, 10) })
    .eq("id", delegationId);
  if (error) throw new Error(error.message);
  revalidatePath("/");
}

/** Clore une délégation (la chose confiée a été faite). */
export async function cloreDelegation(delegationId: string) {
  const sb = cockpitClient();
  const { error } = await sb
    .from("delegation_log")
    .update({ clos: true })
    .eq("id", delegationId);
  if (error) throw new Error(error.message);
  revalidatePath("/");
}

/** Débloquer (D34/D40) — le blocage est résolu. */
export async function resoudreBlocage(blocageId: string) {
  const sb = cockpitClient();
  const { error } = await sb
    .from("blocker")
    .update({ resolu: true })
    .eq("id", blocageId);
  if (error) throw new Error(error.message);
  revalidatePath("/");
}

// ─── Ordre dans la colonne (D28 : ordinal — passer devant, pas noter) ────────

// La « colonne » d'une tâche : au réservoir on range par catégorie ; au jour,
// par rail. Un seul endroit décide de ça.
type Colonne = { plan: string; categorie?: string; rail?: string | null };
function colonneDe(t: { plan: string; categorie: string; rail: string | null }): Colonne {
  return t.plan === "aujourdhui"
    ? { plan: t.plan, rail: t.rail }
    : { plan: t.plan, categorie: t.categorie };
}

/** Helper unique de renumérotation d'une colonne (ARCHITECTURE : reorder). */
async function renumeroter(c: Colonne) {
  const sb = cockpitClient();
  let req = sb
    .from("task")
    .select("id, rang, created_at")
    .eq("plan", c.plan)
    .eq("porteur", "moi")
    .not("status", "in", '("fait","abandonne")');
  if (c.categorie) req = req.eq("categorie", c.categorie);
  if (c.rail) req = req.eq("rail", c.rail);
  const { data, error } = await req
    .order("rang", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  const lignes = data ?? [];
  for (let i = 0; i < lignes.length; i++) {
    if (lignes[i].rang !== i + 1) {
      const { error: e } = await sb
        .from("task")
        .update({ rang: i + 1 })
        .eq("id", lignes[i].id);
      if (e) throw new Error(e.message);
    }
  }
  return lignes.map((l) => l.id);
}

async function lireColonne(taskId: string): Promise<Colonne> {
  const sb = cockpitClient();
  const { data: t, error } = await sb
    .from("task")
    .select("categorie, plan, rail")
    .eq("id", taskId)
    .single();
  if (error) throw new Error(error.message);
  return colonneDe(t);
}

/** « ↑ » — la tâche passe devant celle qui la précède (D28). */
export async function monterDunCran(taskId: string) {
  const sb = cockpitClient();
  const ordre = await renumeroter(await lireColonne(taskId));
  const i = ordre.indexOf(taskId);
  if (i > 0) {
    const { error: e1 } = await sb.from("task").update({ rang: i }).eq("id", taskId);
    if (e1) throw new Error(e1.message);
    const { error: e2 } = await sb.from("task").update({ rang: i + 1 }).eq("id", ordre[i - 1]);
    if (e2) throw new Error(e2.message);
  }
  revalidatePath("/");
}

/** « ⇈ » — la tâche passe en tête de sa colonne (D28). */
export async function mettreEnTete(taskId: string) {
  const sb = cockpitClient();
  const colonne = await lireColonne(taskId);
  const { error: e1 } = await sb.from("task").update({ rang: 0 }).eq("id", taskId);
  if (e1) throw new Error(e1.message);
  await renumeroter(colonne);
  revalidatePath("/");
}

/** Corriger le rail (D22/D29 : Manu corrige d'un geste — choix direct du tag).
 *  Sur une tâche DU JOUR, c'est un déplacement de slot : refusé si le rail
 *  cible est plein (D39), Créer compris. */
export async function changerRailVers(taskId: string, rail: Rail) {
  if (!RAILS.includes(rail)) throw new Error(`Rail inconnu : ${rail}`);
  const sb = cockpitClient();
  const { data: t, error } = await sb
    .from("task")
    .select("plan, rail")
    .eq("id", taskId)
    .single();
  if (error) throw new Error(error.message);
  if (t.rail === rail) return;

  if (t.plan === "aujourdhui" && !peutAjouterAuJour(rail, await slotsOccupes(rail))) {
    revalidatePath("/");
    redirect(`/?refus=${rail}`);
  }

  const { error: e2 } = await sb
    .from("task")
    .update({ rail })
    .eq("id", taskId);
  if (e2) throw new Error(e2.message);
  revalidatePath("/");
}
