-- Table des dépenses
create table if not exists expenses (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  expense_date date not null,
  user_name    text not null,
  amount       numeric(10, 2) not null check (amount > 0),
  category     text not null,
  payment_type text not null,
  description  text
);

-- Index pour accélérer le tri par date
create index if not exists expenses_expense_date_idx on expenses (expense_date desc);
create index if not exists expenses_created_at_idx  on expenses (created_at desc);

-- RLS (Row Level Security) — désactivé pour simplifier (accès via service key uniquement)
alter table expenses disable row level security;
