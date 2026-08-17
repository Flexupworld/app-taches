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

/** Corriger le rail proposé (D22/D29 : Manu corrige d'un geste). */
export async function changerRail(taskId: string) {
  const sb = cockpitClient();
  const { data: t, error } = await sb
    .from("task")
    .select("rail")
    .eq("id", taskId)
    .single();
  if (error) throw new Error(error.message);
  const actuel = (t.rail as Rail) ?? "performer";
  const suivant = RAILS[(RAILS.indexOf(actuel) + 1) % RAILS.length];
  const { error: e2 } = await sb
    .from("task")
    .update({ rail: suivant })
    .eq("id", taskId);
  if (e2) throw new Error(e2.message);
  revalidatePath("/");
}
