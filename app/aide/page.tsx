// Manuel d'utilisation embarqué — mis à jour À CHAQUE livraison, dans le même
// mouvement que la fonctionnalité (méthode : la doc embarquée suit le changement).
// Versionné avec le code : ce qui est écrit ici décrit la version en ligne, jamais une autre.
import { APP_VERSION, SLOTS } from "@/lib/regles";

export const metadata = { title: `Manuel · Cockpit v${APP_VERSION}` };

const S = {
  h2: { fontSize: "1.1rem", marginTop: "2.2rem", marginBottom: "0.4rem" } as const,
  p: { color: "#c9d1d9", fontSize: "0.95rem", lineHeight: 1.65, margin: "0.5rem 0" } as const,
  meta: { color: "#8b949e", fontSize: "0.82rem" } as const,
  regle: {
    background: "#161b22",
    border: "1px solid #30363d",
    borderLeft: "3px solid #a371f7",
    borderRadius: 8,
    padding: "0.7rem 1rem",
    margin: "0.8rem 0",
    fontSize: "0.92rem",
    lineHeight: 1.6,
  } as const,
};

export default function Aide() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "2.5rem 1.25rem" }}>
      <header>
        <a href="/" style={{ ...S.meta, textDecoration: "none" }}>← Ma journée</a>
        <h1 style={{ fontSize: "1.5rem", margin: "0.5rem 0 0" }}>Manuel</h1>
        <p style={S.meta}>
          Décrit la version en ligne (v{APP_VERSION}). Mis à jour à chaque livraison —
          si l&apos;écran et le manuel divergent, c&apos;est un bug.
        </p>
      </header>

      <div style={S.regle}>
        <strong>La règle qui gouverne tout : tu ne saisis jamais.</strong><br />
        Tu dictes à Claude (session Cockpit sur l&apos;ordi, ou Dispatch sur le
        téléphone) ; Claude écrit dans la base et propose un classement ; toi tu
        corriges d&apos;un geste dans l&apos;app. Il n&apos;y a aucun champ
        d&apos;ajout ici, et c&apos;est voulu : si un jour tu dois remplir un
        formulaire, le design est faux.
      </div>

      <h2 style={S.h2}>À quoi sert cette app</h2>
      <p style={S.p}>
        Ce n&apos;est pas une to-do list. Elle te maintient sur <strong>commercial,
        business development et création</strong>, et fait sortir le reste de tes
        mains. Chaque journée est une sélection rare et assumée — pas une pile.
      </p>

      <h2 style={S.h2}>Les trois rails du jour</h2>
      <p style={S.p}>
        <strong style={{ color: "#a371f7" }}>Créer</strong> ({SLOTS.creer}/jour,
        protégé) — développer le modèle, nouveaux modules, partenaires, marques.
        Un chantier ne se coche pas : il avance par sessions
        (« J&apos;y ai travaillé »), et se clôt quand c&apos;est bouclé.
        Aucune tâche Performer ou Mécanique ne peut prendre ce slot.
      </p>
      <p style={S.p}>
        <strong style={{ color: "#3fb950" }}>Performer</strong> ({SLOTS.performer}/jour)
        — la performance du jour avec les outils existants : ventes, abonnements,
        monitoring.
      </p>
      <p style={S.p}>
        <strong style={{ color: "#8b949e" }}>Mécanique</strong> ({SLOTS.mecanique}/jour)
        — simple, chronophage, nécessaire. À réduire, semaine après semaine.
      </p>
      <div style={S.regle}>
        <strong>Les slots sont fermes.</strong> Quand un rail est plein, l&apos;app
        refuse d&apos;ajouter — elle ne « signale » pas un dépassement, elle demande
        ce qui sort. Terminer, déléguer ou abandonner libère un slot ; une
        proposition apparaît alors. La journée n&apos;est pas extensible : c&apos;est
        le mécanisme qui te force à choisir.
      </div>

      <h2 style={S.h2}>Les propositions — et pourquoi dire « Non » compte</h2>
      <p style={S.p}>
        Quand un slot est libre, l&apos;app te propose un candidat du réservoir.
        Deux boutons : <strong>« Aujourd&apos;hui »</strong> ou <strong>« Non »</strong>
        — ou tu ignores et tu choisis toi-même dans le réservoir. Chaque geste est
        enregistré. Le rapport Non / (Oui + Non) est ton <strong>taux de
        contestation</strong> : s&apos;il tombe à zéro, tu as cessé de choisir, et
        c&apos;est une alerte — pas un succès.
      </p>

      <h2 style={S.h2}>Le réservoir</h2>
      <p style={S.p}>
        Tout ce qui est à toi (<em>porteur = moi</em>), rangé par catégorie,
        commercial en tête. Chaque carte porte les trois tags de rail côte à côte :
        l&apos;actif est en couleur, un « ? » signale une proposition de Claude pas
        encore confirmée — clique directement le tag que tu veux pour basculer.
        L&apos;ordre : <strong>⇈</strong> met la tâche en tête de sa colonne,
        <strong> ↑</strong> la fait passer devant la précédente. Pas de note, pas de
        score — tu fais passer une tâche devant une autre, rien d&apos;autre.
        « ★ » marque un chantier actif.
      </p>

      <h2 style={S.h2}>Sortir de mes mains</h2>
      <p style={S.p}>
        Le geste central de ta transition. « Sortir de mes mains → » puis un nom :
        l&apos;app enregistre quoi, à qui, quand — et range la tâche. Pas de suivi
        d&apos;exécution ici : la boucle se ferme chez Wijnand. La tâche confiée
        réapparaît dans <strong>« Chez quelqu&apos;un d&apos;autre »</strong> avec son
        ancienneté (« Nathan, depuis 6 j »). Une seule action possible :
        <strong> « Demander »</strong>. Quand c&apos;est fait : « C&apos;est fait ».
      </p>

      <h2 style={S.h2}>Je suis bloqué</h2>
      <p style={S.p}>
        Différent de « confié » : ici <em>tu</em> ne peux pas avancer tant qu&apos;un
        tiers n&apos;a pas répondu. Chaque blocage se déplie : ce qu&apos;on attend,
        pourquoi ça bloque, ce que ça débloque, l&apos;ancienneté. Le contexte est
        rédigé par Claude depuis vos conversations — jamais saisi. Quand la réponse
        arrive : <strong>« Débloqué »</strong>.
      </p>

      <h2 style={S.h2}>Chercher</h2>
      <p style={S.p}>
        Le champ en haut fouille les titres <em>et</em> les phrases dictées
        d&apos;origine, toutes zones confondues, archive comprise. C&apos;est le seul
        champ de l&apos;app — il lit, il n&apos;écrit rien.
      </p>

      <h2 style={S.h2}>Comment dicter (la grammaire qui évite les malentendus)</h2>
      <p style={S.p}>
        « <strong>ajoute : relancer X pour le devis</strong> » → la tâche est à toi.<br />
        « <strong>… avec Nathan</strong> » → elle reste à toi, Nathan en face.<br />
        « <strong>… délégué Nathan</strong> » ou « <strong>pour Nathan</strong> » →
        elle sort de tes mains, visible dans « Chez quelqu&apos;un d&apos;autre ».<br />
        « <strong>… à surveiller</strong> » → monde de Wijnand, jamais dans ta journée.<br />
        Ambigu ? Claude demande au lieu de deviner. Et ta phrase d&apos;origine est
        toujours conservée telle quelle : si le classement est faux, corrige — c&apos;est
        comme ça que le parsing se calibre.
      </p>

      <h2 style={S.h2}>Ce que l&apos;app mesure — et rien d&apos;autre</h2>
      <p style={S.p}>
        Aucun chiffre business ici. Une seule mesure, à venir (F2) : le <strong>miroir
        hebdomadaire</strong> — la répartition de ton temps entre Créer, Performer et
        Mécanique, plus le taux de contestation. Elle ne mesure pas l&apos;entreprise,
        elle te mesure toi, pendant ta transition.
      </p>

      <p style={{ ...S.meta, marginTop: "2.5rem" }}>
        Panne ou écran vide ? <a href="/api/health" style={{ color: "#8b949e" }}>/api/health</a>{" "}
        dit précisément ce qui va et ce qui manque. Une erreur ne ressemble jamais à
        un refus — si quelque chose cloche, copie la réponse de cette page à Claude.
      </p>
    </main>
  );
}
