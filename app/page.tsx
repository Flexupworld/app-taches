// F1 v2 — « Ma journée ». Trois rails à slots fermes (D39), réservoir
// porteur=moi (D19), « chez quelqu'un d'autre » (D31), « je suis bloqué » (D34).
// Aucun champ de saisie nulle part : que des boutons (D22).
import { APP_VERSION, CATEGORIES, SLOTS, RAILS, proposerRail, type Rail } from "@/lib/regles";
import { chargerEcran, rechercherTaches, joursDepuis, type Tache } from "@/lib/data";
import {
  mettreAujourdhui, refuserProposition, marquerFait, ajouterSession,
  cloturerChantier, reporterAuReservoir, sortirDesMains, demander,
  cloreDelegation, resoudreBlocage, changerRailVers,
  monterDunCran, mettreEnTete, changerCategorie, reprendreEnMain,
  supprimerTache, renommerTache,
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
  // Les trois tags côte à côte : l'actif est plein, les autres estompés.
  // Un clic bascule directement (D22 : corriger = un geste, pas un cycle).
  const actif = (t.rail as Rail) ?? proposerRail(t.title);
  const propose = t.rail === null;
  return (
    <span style={{ display: "inline-flex", gap: "0.25rem" }}>
      {RAILS.map((r) => {
        const estActif = r === actif;
        return (
          <form key={r} action={changerRailVers.bind(null, t.id, r)} style={{ display: "inline" }}>
            <button
              style={{
                ...S.bouton,
                color: estActif ? COULEURS_RAIL[r] : "#484f58",
                borderColor: estActif ? COULEURS_RAIL[r] : "#30363d",
                fontWeight: estActif ? 600 : 400,
              }}
              title={
                estActif && propose
                  ? "Proposé par Claude — clique un autre tag pour corriger"
                  : `Basculer en ${NOMS_RAIL[r]}`
              }
            >
              {NOMS_RAIL[r]}{estActif && propose ? " ?" : ""}
            </button>
          </form>
        );
      })}
    </span>
  );
}

function EditerSupprimer({ t }: { t: Tache }) {
  return (
    <>
      <details style={{ display: "inline-block" }}>
        <summary
          style={{ ...S.bouton, listStyle: "none", display: "inline-block" }}
          title="Corriger le titre (ta phrase dictée d'origine est conservée)"
        >
          ✎
        </summary>
        <form
          action={renommerTache.bind(null, t.id)}
          style={{ ...S.rangee, marginTop: "0.4rem" }}
        >
          <input
            name="title"
            defaultValue={t.title}
            style={{ ...S.bouton, cursor: "text", width: "min(340px, 100%)" }}
          />
          <button style={S.boutonVert}>OK</button>
        </form>
        {t.raw_capture !== t.title && (
          <p style={{ ...S.meta, marginTop: "0.3rem" }}>Dicté : « {t.raw_capture} »</p>
        )}
      </details>
      <form action={supprimerTache.bind(null, t.id)} style={{ display: "inline" }}>
        <button
          style={{ ...S.bouton, color: "#f85149" }}
          title="Abandonner — la carte disparaît et libère son slot ; la ligne reste en base"
        >
          ✕
        </button>
      </form>
    </>
  );
}

function ChoixCategorie({ t }: { t: Tache }) {
  return (
    <details style={{ display: "inline-block" }}>
      <summary style={{ ...S.bouton, listStyle: "none", display: "inline-block" }}>
        Réservoir : {t.categorie} →
      </summary>
      <div style={{ ...S.rangee, marginTop: "0.4rem" }}>
        {CATEGORIES.filter((c) => c !== t.categorie).map((c) => (
          <form key={c} action={changerCategorie.bind(null, t.id, c)}>
            <button style={S.bouton}>{c}</button>
          </form>
        ))}
      </div>
    </details>
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
  searchParams: { refus?: string; q?: string };
}) {
  const d = await chargerEcran();
  const q = (searchParams.q ?? "").trim();
  const resultats = q ? await rechercherTaches(q) : [];
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
        <div style={{ display: "flex", gap: "0.8rem" }}>
          <a href="/aide" style={{ ...S.bouton, textDecoration: "none" }}>Manuel</a>
          <a href="/api/health" style={{ ...S.meta, textDecoration: "none", alignSelf: "center" }}>santé</a>
        </div>
      </header>

      {/* B-13 — recherche : lit la base, ne la nourrit pas (D22 sauve). */}
      <form method="GET" style={{ ...S.rangee, marginTop: "1rem" }}>
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Chercher un mot… (toutes zones, archive comprise)"
          style={{
            ...S.bouton,
            width: "min(420px, 100%)",
            cursor: "text",
          }}
        />
        <button style={S.bouton}>Chercher</button>
        {q && (
          <a href="/" style={{ ...S.bouton, textDecoration: "none" }}>Effacer</a>
        )}
      </form>

      {q && (
        <section style={S.section}>
          <h2 style={S.h2}>
            Résultats pour « {q} » <span style={S.meta}>{resultats.length}</span>
          </h2>
          {resultats.length === 0 && (
            <p style={S.meta}>Rien. Ni dans les titres, ni dans les phrases dictées.</p>
          )}
          {resultats.map((t) => (
            <div key={t.id} style={S.carte}>
              <p style={S.titre}>{t.title}</p>
              <p style={S.meta}>
                {t.categorie} · {t.entity} · {t.plan}
                {t.porteur !== "moi" && ` · ${t.porteur}`}
                {(t.status === "fait" || t.status === "abandonne") && ` · ${t.status}`}
                {t.raw_capture !== t.title && ` · « ${t.raw_capture} »`}
              </p>
              {t.plan === "reservoir" && t.porteur === "moi" &&
                t.status !== "fait" && t.status !== "abandonne" && (
                <div style={S.rangee}>
                  <form action={mettreAujourdhui.bind(null, t.id, false)}>
                    <button style={S.boutonVert}>Aujourd&apos;hui</button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

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
                    <form action={monterDunCran.bind(null, t.id)}>
                      <button style={S.bouton} title="Passer devant la précédente">↑</button>
                    </form>
                    <ChoixPersonne taskId={t.id} personnes={d.personnes} />
                  </div>
                  <div style={S.rangee}>
                    <ChipRail t={t} />
                    <EditerSupprimer t={t} />
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
          return (
            <details key={cat} style={{ marginBottom: "0.5rem", opacity: taches.length === 0 ? 0.45 : 1 }}>
              <summary style={{ ...S.h2, cursor: "pointer", display: "list-item", marginTop: 0 }}>
                {cat} <span style={S.meta}>{taches.length}</span>
              </summary>
              {taches.length === 0 && (
                <p style={{ ...S.meta, fontStyle: "italic" }}>Vide.</p>
              )}
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
                    <form action={mettreEnTete.bind(null, t.id)}>
                      <button style={S.bouton} title="Passer en tête de la colonne">⇈</button>
                    </form>
                    <form action={monterDunCran.bind(null, t.id)}>
                      <button style={S.bouton} title="Passer devant la précédente">↑</button>
                    </form>
                    <ChipRail t={t} />
                  </div>
                  <div style={S.rangee}>
                    <ChoixCategorie t={t} />
                    <ChoixPersonne taskId={t.id} personnes={d.personnes} />
                    <EditerSupprimer t={t} />
                  </div>
                </div>
              ))}
            </details>
          );
        })}
      </section>

      {/* ─── Délégué & supervisé (D19 : consultable, jamais imposé) ─── */}
      <section style={S.section}>
        <h2 style={S.h2}>
          Délégué &amp; supervisé <span style={S.meta}>{d.autres.length} · consultable, jamais imposé</span>
        </h2>
        {(["supervise", "delegue"] as const).map((p) => {
          const taches = d.autres.filter((t) => t.porteur === p);
          if (taches.length === 0) return null;
          return (
            <details key={p} style={{ marginBottom: "0.5rem" }}>
              <summary style={{ ...S.h2, cursor: "pointer", display: "list-item", marginTop: 0 }}>
                {p === "supervise" ? "Supervisé (le monde de Wijnand)" : "Délégué aux responsables"}{" "}
                <span style={S.meta}>{taches.length}</span>
              </summary>
              {taches.map((t) => (
                <div key={t.id} style={{ ...S.carte, opacity: 0.85 }}>
                  <p style={S.titre}>{t.title}</p>
                  <p style={S.meta}>
                    {t.categorie} · {t.entity}
                    {t.responsable && ` · ${nomPar(t.responsable)}`}
                  </p>
                  <div style={S.rangee}>
                    <form action={reprendreEnMain.bind(null, t.id)}>
                      <button style={S.bouton}>Reprendre en main</button>
                    </form>
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
