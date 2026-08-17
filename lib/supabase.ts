// Client Supabase — serveur uniquement (service role, jamais exposé au client).
// Schéma dédié `cockpit` (D38) : rien ne lit ni n'écrit dans `public`.
import { createClient } from "@supabase/supabase-js";

export function cockpitClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    // Garde-fou méthode : une valeur absente ne se déguise pas en valeur
    // rassurante. On lève, et /api/health dira précisément ce qui manque.
    throw new Error(
      `Variables d'environnement manquantes : ${[
        !url && "NEXT_PUBLIC_SUPABASE_URL",
        !key && "SUPABASE_SERVICE_ROLE_KEY",
      ]
        .filter(Boolean)
        .join(", ")}`
    );
  }
  return createClient(url, key, {
    db: { schema: "cockpit" },
    auth: { persistSession: false },
    // D46 : lectures JAMAIS mises en cache. L'app est nourrie par dictée —
    // les écritures arrivent de l'extérieur (Claude / Dispatch), sans passer
    // par une action de l'app. Le Data Cache de Next.js les rendait invisibles
    // jusqu'au prochain clic de Manu (bug réel du 17 août : tâche dictée
    // introuvable à l'écran pendant 30 min alors qu'elle était en base).
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) =>
        fetch(input, { ...init, cache: "no-store" }),
    },
  });
}
