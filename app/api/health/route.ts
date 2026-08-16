// Endpoint de santé — garde-fou méthode : une panne ne doit jamais ressembler
// à un refus ni à un écran vide. Ce endpoint dit précisément ce qui va et ce
// qui manque, table par table.
import { NextResponse } from "next/server";
import { cockpitClient } from "@/lib/supabase";
import { APP_VERSION } from "@/lib/regles";

export const dynamic = "force-dynamic";

export async function GET() {
  const rapport: Record<string, unknown> = {
    app: "app-taches",
    version: APP_VERSION,
    horodatage: new Date().toISOString(),
  };

  let sb;
  try {
    sb = cockpitClient();
  } catch (e) {
    return NextResponse.json(
      {
        ...rapport,
        schema_cockpit: "ERREUR",
        diagnostic: e instanceof Error ? e.message : String(e),
      },
      { status: 500 }
    );
  }

  const tables = [
    "people",
    "task",
    "session",
    "delegation_log",
    "blocker",
    "arbitrage",
  ] as const;
  const comptes: Record<string, number | string> = {};
  let erreur: string | null = null;

  for (const t of tables) {
    const { count, error } = await sb
      .from(t)
      .select("*", { count: "exact", head: true });
    if (error) {
      comptes[t] = `ERREUR : ${error.message}`;
      erreur = error.message;
    } else {
      comptes[t] = count ?? 0;
    }
  }

  if (erreur) {
    return NextResponse.json(
      {
        ...rapport,
        schema_cockpit: "ERREUR",
        comptes,
        diagnostic:
          "Une table au moins ne répond pas. Si le message parle de schéma " +
          "introuvable : ajouter `cockpit` aux « Exposed schemas » dans " +
          "Supabase → Settings → API.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ ...rapport, schema_cockpit: "OK", comptes });
}
