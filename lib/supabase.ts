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
  });
}
