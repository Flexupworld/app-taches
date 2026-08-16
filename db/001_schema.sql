-- App tâches (Cockpit) — schéma initial
-- Projet Supabase : "Flex Up APPS" (cnhkxjinyaaokwobbphg, eu-west-1)
-- Schéma dédié `cockpit` : n'écrit RIEN dans public (Cash Today, Stock Balance y vivent).
-- APP_VERSION 0.1 · 15 août 2026
-- ✅ APPLIQUÉ le 16 août 2026 (migration `cockpit_001_schema`). 6 tables, RLS activé, `public` non touché.

create schema if not exists cockpit;

-- ─────────────────────────────────────────────────────────────
-- people  (D07, D09, D10)
-- ─────────────────────────────────────────────────────────────
create table cockpit.people (
  id            uuid primary key default gen_random_uuid(),
  nom           text not null unique,
  type          text not null check (type in ('interne','externe')),
  actif         boolean not null default true,
  est_moi       boolean not null default false,   -- Manu : responsable par défaut (D10)
  remplace_par  uuid references cockpit.people(id),
  sorti_le      date,
  created_at    timestamptz not null default now()
);
comment on column cockpit.people.remplace_par is
  'D09 : un remplacement ne renomme jamais. On désactive, on crée le successeur, et seules les tâches ouvertes basculent.';

-- ─────────────────────────────────────────────────────────────
-- task  (D03, D19, D22, D24, D26→D30, D28)
-- ─────────────────────────────────────────────────────────────
create table cockpit.task (
  id             uuid primary key default gen_random_uuid(),
  raw_capture    text not null,                   -- D08 : jamais écrasé
  title          text not null,
  categorie      text not null check (categorie in
                   ('commercial','administratif','legal','marketing',
                    'logistique','finance','tech','ops','perso')),
  entity         text not null default 'groupe'
                   check (entity in ('line_up','flex_up','groupe')),
  rail           text check (rail in ('creer','performer','mecanique')),  -- D30
  porteur        text not null default 'moi'
                   check (porteur in ('moi','delegue','supervise')),      -- D19
  responsable    uuid references cockpit.people(id),
  interlocuteur  uuid references cockpit.people(id),
  rang           integer,                          -- D28 : ordinal, pas de score
  plan           text not null default 'reservoir'
                   check (plan in ('reservoir','aujourdhui','archive')),
  status         text not null default 'inbox'
                   check (status in ('inbox','actif','bloque','fait','abandonne')),
  actif_chantier boolean not null default false,   -- D35 : 3 chantiers actifs max
  due_date       date,
  source         text,                             -- provenance de l'import (D15)
  created_at     timestamptz not null default now(),
  done_at        timestamptz
);
comment on column cockpit.task.rail is
  'D30 : creer (1/jour, protégé) · performer (outils existants) · mecanique (à réduire). NULL tant que non classé.';
comment on column cockpit.task.rang is
  'D28 : position dans la colonne. Ordinal — Manu fait passer une tâche devant une autre, il ne la note pas.';

create index on cockpit.task (plan, rail, rang);
create index on cockpit.task (categorie, porteur);

-- ─────────────────────────────────────────────────────────────
-- session  (D27 : un chantier avance par sessions, il ne se coche pas)
-- ─────────────────────────────────────────────────────────────
create table cockpit.session (
  id         uuid primary key default gen_random_uuid(),
  task_id    uuid not null references cockpit.task(id) on delete cascade,
  faite_le   date not null default current_date,
  note       text,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- delegation_log  (D24, D31 : archive + résurgence, jamais un tracker)
-- ─────────────────────────────────────────────────────────────
create table cockpit.delegation_log (
  id           uuid primary key default gen_random_uuid(),
  task_id      uuid not null references cockpit.task(id) on delete cascade,
  vers         uuid not null references cockpit.people(id),
  confie_le    date not null default current_date,
  redemande_le date,                                -- dernière fois que Manu a demandé
  clos         boolean not null default false,
  created_at   timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- blocker  (D34 : « je suis bloqué » — contexte rédigé par Claude, jamais saisi)
-- ─────────────────────────────────────────────────────────────
create table cockpit.blocker (
  id           uuid primary key default gen_random_uuid(),
  task_id      uuid references cockpit.task(id) on delete set null,
  titre        text not null,
  attendu      text not null,                       -- ce qu'on attend
  pourquoi     text not null,                       -- pourquoi ça bloque
  declenche    text[],                              -- ce que ça débloque ensuite
  responsable  uuid references cockpit.people(id),
  depuis       date not null default current_date,
  relance_le   date,
  resolu       boolean not null default false,
  created_at   timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- arbitrage  (D21 : trace des décisions de Manu · D32 : miroir hebdo)
-- ─────────────────────────────────────────────────────────────
create table cockpit.arbitrage (
  id          uuid primary key default gen_random_uuid(),
  task_id     uuid references cockpit.task(id) on delete set null,
  jour        date not null default current_date,
  geste       text not null check (geste in
                ('mis_au_jour','propose_accepte','propose_refuse',
                 'delegue','fait','session','reporte')),
  rail        text,
  created_at  timestamptz not null default now()
);
comment on table cockpit.arbitrage is
  'D21 + D32. Alimente le miroir hebdomadaire (répartition creer/performer/mecanique) et le TAUX DE CONTESTATION : propose_refuse / (propose_refuse + propose_accepte). Si ce taux tombe à zéro, c''est une alerte — Manu a cessé de choisir.';

-- RLS : mono-utilisateur (D25). Activé par principe, ouvert au service role uniquement.
alter table cockpit.people          enable row level security;
alter table cockpit.task            enable row level security;
alter table cockpit.session         enable row level security;
alter table cockpit.delegation_log  enable row level security;
alter table cockpit.blocker         enable row level security;
alter table cockpit.arbitrage       enable row level security;
