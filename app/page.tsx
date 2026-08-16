// F0 — squelette : « écran vide mais en ligne » (ordre de démarrage, étape 3).
// L'écran F1 v2 (« Ma journée ») arrive à l'étape suivante — une
// fonctionnalité à la fois, déployée et vérifiée avant d'ouvrir la suivante.
import { APP_VERSION } from "@/lib/regles";

async function etatBase(): Promise<{ ok: boolean; detail: string }> {
  try {
    const { cockpitClient } = await import("@/lib/supabase");
    const sb = cockpitClient();
    const { count, error } = await sb
      .from("task")
      .select("*", { count: "exact", head: true });
    if (error) return { ok: false, detail: error.message };
    return { ok: true, detail: `${count ?? 0} tâches en base` };
  } catch (e) {
    return { ok: false, detail: e instanceof Error ? e.message : String(e) };
  }
}

export const dynamic = "force-dynamic";

export default async function Page() {
  const base = await etatBase();
  return (
    <main
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "4rem 1.5rem",
      }}
    >
      <h1 style={{ fontSize: "1.6rem", marginBottom: "0.25rem" }}>
        Cockpit — Ma journée
      </h1>
      <p style={{ color: "#8b949e", marginTop: 0 }}>
        v{APP_VERSION} · squelette en ligne — l&apos;écran F1 arrive.
      </p>
      {/* Garde-fou : « je ne sais pas » et « tout va bien » n'ont pas la même
          couleur. Vert = base jointe. Orange = état inconnu, avec le détail. */}
      <p
        style={{
          display: "inline-block",
          padding: "0.4rem 0.8rem",
          borderRadius: 8,
          background: base.ok ? "#0f2e1d" : "#3a2a12",
          color: base.ok ? "#3fb950" : "#d29922",
          border: `1px solid ${base.ok ? "#238636" : "#9e6a03"}`,
        }}
      >
        {base.ok ? `Base cockpit jointe — ${base.detail}` : `Base injoignable — ${base.detail}`}
      </p>
    </main>
  );
}
