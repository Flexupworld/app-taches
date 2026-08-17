// F1 v2 — « Ma journée ». Trois rails à slots fermes (D39), réservoir
// porteur=moi (D19), « chez quelqu'un d'autre » (D31), « je suis bloqué » (D34).
// Aucun champ de saisie nulle part : que des boutons (D22).
import { APP_VERSION, CATEGORIES, SLOTS, RAILS, proposerRail, type Rail } from "@/lib/regles";
import { chargerEcran, joursDepuis, type Tache } from "@/lib/data";
import {
  mettreAujourdhui, refuserProposition, marquerFait, ajouterSession,
  cloturerChantier, reporterAuReservoir, sortirDesMains, demander,
  cloreDelegation, resoudreBlocage, changerRail,
} from "./actions";

export const dynamic = "force-dynamic";

const NOMS_RAIL: Record<Rail, string> = {
  creer: "Créer",
  performer: "Performer",
  mecanique: "Mécanique",
};
const COULEURS_RAIL: Record<Rail, string> = {
  creer: "#a371f7",
  performer: "#3fb950",
  mecanique: "#8b949e",
};

const S = {
  section: { marginTop: "2rem" } as const,
  h2: { fontSize: "1.05rem", color: "#e6e8eb", margin: "0 0 0.6rem" } as const,
  carte: {
    background: "#161b22",
    border: "1px solid #30363d",
    borderRadius: 10,
    padding: "0.7rem 0.9rem",
    marginBottom: "0.55rem",
  } as const,
  titre: { margin: 0, fontSize: "0.95rem", lineHeight: 1.35 } as const,
  meta: { color: "#8b949e", fontSize: "0.78rem", marginTop: "0.15rem" } as const,
  bouton: {
    background: "#21262d",
    color: "#e6e8eb",
    border: "1px solid #30363d",
    borderRadius: 7,
    padding: "0.3rem 0.65rem",
    fontSize: "0.8rem",
    cursor: "pointer",
  } as const,
  boutonVert: {
    background: "#238636",
    color: "#fff",
    border: "1px solid #2ea043",
    borderRadius: 7,
    padding: "0.3rem 0.65rem",
    fontSize: "0.8rem",
    cursor: "pointer",
  } as const,
  rangee: { display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.5rem" } as const,
};

function ChipRail({ t }: { t: Tache }) {
  const rail = (t.rail as Rail) ?? proposerRail(t.title);
  const propose = t.rail === null;
  return (
    <form action={changerRail.bind(null, t.id)} style={{ display: "inline" }}>
      <button
        style={{
          ...S.bouton,
          color: COULEURS_RAIL[rail],
          borderColor: COULEURS_RAIL[rail],
          opacity: propose ? 0.7 : 1,
        }}
        title="Corriger le rail (D29 : Claude propose, tu corriges)"
      >
        {NOMS_RAIL[rail]}{propose ? " ?" : ""}
      </button>
    </form>
  );
}

function ChoixPersonne({
  taskId, personnes,
}: {
  taskId: string;
  personnes: { id: string; nom: string; est_moi: boolean }[];
}) {
  return (
    <details style={{ display: "inline-block" }}>
      <summary style={{ ...S.bouton, listStyle: "none", display: "inline-block" }}>
        Sortir de mes mains →
      </summary>
      <div style={{ ...S.rangee, marginTop: "0.4rem" }}>
        {personnes.filter((p) => !p.est_moi).map((p) => (
          <form key={p.id} action={sortirDesMains.bind(null, taskId, p.id)}>
            <button style={S.bouton}>{p.nom}</button>
          </form>
        ))}
      </div>
    </details>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: { refus?: string };
}) {
  const d = await chargerEcran();
  const jour = new Date().toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long",
  });

  const parRail = (rail: Rail) => d.aujourdhui.filter((t) => t.rail === rail);

  // Proposition par rail libre : premier candidat du réservoir (rang), non
  // refusé aujourd'hui. Jamais une présélection imposée (D39) — deux boutons.
  const propositions = RAILS.flatMap((rail) => {
    const libres = SLOTS[rail] - parRail(rail).length;
    if (libres <= 0) return [];
    const candidat = d.reservoir.find(
      (t) =>
        ((t.rail as Rail) ?? proposerRail(t.title)) === rail &&
        !d.refuseesAujourdhui.includes(t.id)
    );
    return candidat ? [{ rail, candidat }] : [];
  });

  const nomPar = (id: string | null) =>
    d.personnes.find((p) => p.id === id)?.nom ?? "?";

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "2.5rem 1.25rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", margin: 0 }}>Ma journée</h1>
          <p style={{ ...S.meta, textTransform: "capitalize" }}>{jour} · v{APP_VERSION}</p>
        </div>
        <a href="/api/health" style={{ ...S.meta, textDecoration: "none" }}>santé</a>
      </header>

      {searchParams.refus && (
        <div style={{ ...S.carte, borderColor: "#9e6a03", background: "#3a2a12", marginTop: "1rem" }}>
          <p style={{ ...S.titre, color: "#d29922" }}>
            Rail « {NOMS_RAIL[searchParams.refus as Rail] ?? searchParams.refus} » plein.
            Termine, délègue ou abandonne une action pour libérer le slot — la journée
            n&apos;est pas extensible (D39).
          </p>
          <div style={S.rangee}><a href="/" style={{ ...S.bouton, textDecoration: "none" }}>OK</a></div>
        </div>
      )}

      {/* ─── Les trois rails ─── */}
      <section style={{ ...S.section, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
        {RAILS.map((rail) => {
          const taches = parRail(rail);
          const proposition = propositions.find((p) => p.rail === rail);
          return (
            <div key={rail}>
              <h2 style={{ ...S.h2, color: COULEURS_RAIL[rail] }}>
                {NOMS_RAIL[rail]}{" "}
                <span style={S.meta}>
                  {taches.length}/{SLOTS[rail]}
                  {rail === "creer" && " · protégé"}
                  {rail === "mecanique" && " · à réduire"}
                </span>
              </h2>

              {taches.length === 0 && !proposition && (
                <p style={{ ...S.meta, fontStyle: "italic" }}>
                  {rail === "creer"
                    ? "Slot vide — aucun chantier actif n'est tranché."
                    : "Slot libre."}
                </p>
              )}

              {taches.map((t) => (
                <div key={t.id} style={S.carte}>
                  <p style={S.titre}>{t.title}</p>
                  <p style={S.meta}>
                    {t.categorie} · {t.entity}
                    {rail === "creer" &&
                      ` · ${d.sessionsParTache[t.id] ?? 0} session${(d.sessionsParTache[t.id] ?? 0) > 1 ? "s" : ""}`}
                  </p>
                  <div style={S.rangee}>
                    {rail === "creer" ? (
                      <>
                        <form action={ajouterSession.bind(null, t.id)}>
                          <button style={S.boutonVert}>J&apos;y ai travaillé</button>
                        </form>
                        <form action={cloturerChantier.bind(null, t.id)}>
                          <button style={S.bouton}>C&apos;est bouclé</button>
                        </form>
                      </>
                    ) : (
                      <form action={marquerFait.bind(null, t.id)}>
                        <button style={S.boutonVert}>Fait</button>
                      </form>
                    )}
                    <form action={reporterAuReservoir.bind(null, t.id)}>
                      <button style={S.bouton}>Reporter</button>
                    </form>
                    <ChoixPersonne taskId={t.id} personnes={d.personnes} />
                  </div>
                </div>
              ))}

              {proposition && (
                <div style={{ ...S.carte, borderStyle: "dashed" }}>
                  <p style={{ ...S.meta, marginBottom: "0.2rem" }}>Proposition :</p>
                  <p style={S.titre}>{proposition.candidat.title}</p>
                  <div style={S.rangee}>
                    <form action={mettreAujourdhui.bind(null, proposition.candidat.id, true)}>
                      <button style={S.boutonVert}>Aujourd&apos;hui</button>
                    </form>
                    <form action={refuserProposition.bind(null, proposition.candidat.id, rail)}>
                      <button style={S.bouton}>Non</button>
                    </form>
                    <span style={{ ...S.meta, alignSelf: "center" }}>
                      ou choisis toi-même dans le réservoir ↓
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* ─── Je suis bloqué (D34) ─── */}
      <section style={S.section}>
        <h2 style={{ ...S.h2, color: "#f85149" }}>
          Je suis bloqué <span style={S.meta}>{d.blocages.length}</span>
        </h2>
        {d.blocages.length === 0 && <p style={S.meta}>Rien — aucune décision suspendue.</p>}
        {d.blocages.map((b) => (
          <details key={b.id} style={S.carte}>
            <summary style={{ cursor: "pointer" }}>
              <strong style={{ fontSize: "0.95rem" }}>{b.titre}</strong>{" "}
              <span style={S.meta}>
                depuis {joursDepuis(b.depuis)} j · dossier : {nomPar(b.responsable)}
              </span>
            </summary>
            <div style={{ marginTop: "0.6rem" }}>
              <p style={S.meta}><strong>On attend :</strong> {b.attendu}</p>
              <p style={S.meta}><strong>Pourquoi ça bloque :</strong> {b.pourquoi}</p>
              {b.declenche && b.declenche.length > 0 && (
                <p style={S.meta}><strong>Ça débloque :</strong> {b.declenche.join(" · ")}</p>
              )}
              {b.relance_le && <p style={S.meta}><strong>Relance :</strong> {b.relance_le}</p>}
              <div style={S.rangee}>
                <form action={resoudreBlocage.bind(null, b.id)}>
                  <button style={S.boutonVert}>Débloqué</button>
                </form>
              </div>
            </div>
          </details>
        ))}
      </section>

      {/* ─── Chez quelqu'un d'autre (D31) ─── */}
      <section style={S.section}>
        <h2 style={S.h2}>
          Chez quelqu&apos;un d&apos;autre <span style={S.meta}>{d.delegations.length}</span>
        </h2>
        {d.delegations.length === 0 && (
          <p style={S.meta}>Rien de confié en attente. Le bouton « sortir de mes mains » nourrit cette zone.</p>
        )}
        {d.delegations.map((dl) => (
          <div key={dl.id} style={S.carte}>
            <p style={S.titre}>{d.tachesParId[dl.task_id]?.title ?? "?"}</p>
            <p style={S.meta}>
              {nomPar(dl.vers)}, depuis {joursDepuis(dl.confie_le)} j
              {dl.redemande_le && ` · demandé le ${dl.redemande_le}`}
            </p>
            <div style={S.rangee}>
              <form action={demander.bind(null, dl.id)}>
                <button style={S.bouton}>Demander</button>
              </form>
              <form action={cloreDelegation.bind(null, dl.id)}>
                <button style={S.bouton}>C&apos;est fait</button>
              </form>
            </div>
          </div>
        ))}
      </section>

      {/* ─── Réservoir (D19 : porteur = moi) ─── */}
      <section style={S.section}>
        <h2 style={S.h2}>
          Réservoir <span style={S.meta}>{d.reservoir.length} · porteur = moi</span>
        </h2>
        {CATEGORIES.map((cat) => {
          const taches = d.reservoir.filter((t) => t.categorie === cat);
          if (taches.length === 0) return null;
          return (
            <details key={cat} open={cat === "commercial"} style={{ marginBottom: "0.8rem" }}>
              <summary style={{ ...S.h2, cursor: "pointer", display: "list-item" }}>
                {cat} <span style={S.meta}>{taches.length}</span>
              </summary>
              {taches.map((t) => (
                <div key={t.id} style={S.carte}>
                  <p style={S.titre}>
                    {t.actif_chantier ? "★ " : ""}{t.title}
                  </p>
                  <p style={S.meta}>{t.entity}{t.rang != null && ` · rang ${t.rang}`}</p>
                  <div style={S.rangee}>
                    <form action={mettreAujourdhui.bind(null, t.id, false)}>
                      <button style={S.boutonVert}>Aujourd&apos;hui</button>
                    </form>
                    <ChipRail t={t} />
                    <ChoixPersonne taskId={t.id} personnes={d.personnes} />
                  </div>
                </div>
              ))}
            </details>
          );
        })}
      </section>
    </main>
  );
}
