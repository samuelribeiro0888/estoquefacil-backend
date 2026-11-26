-- Rode no Supabase: SQL Editor > New query > Run
create table if not exists produtos (
  id bigint generated always as identity primary key,
  nome text not null,
  categoria text,
  preco numeric(10,2) not null check (preco >= 0),
  quantidade integer not null default 0 check (quantidade >= 0),
  created_at timestamptz not null default now()
);

-- Dados de exemplo (opcional)
insert into produtos (nome, categoria, preco, quantidade) values
  ('Caneta azul', 'Papelaria', 2.50, 120),
  ('Caderno 100 folhas', 'Papelaria', 18.90, 8),
  ('Mouse sem fio', 'Informática', 59.90, 25);
