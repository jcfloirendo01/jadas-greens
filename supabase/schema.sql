-- ============================================================
-- Jada's Greens — Supabase Schema
-- Run this in your Supabase SQL Editor (supabase.com/dashboard)
-- ============================================================

-- Products
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  variety text,
  description text,
  price_single integer not null default 40,
  price_bundle_qty integer not null default 3,
  price_bundle_total integer default 100,
  available boolean not null default true,
  coming_soon boolean not null default false,
  created_at timestamptz not null default now()
);

-- Customers
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  address text,
  notes text,
  created_at timestamptz not null default now()
);

-- Orders
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete set null,
  customer_name text not null,
  customer_phone text not null,
  customer_address text not null,
  items jsonb not null default '[]',
  total integer not null,
  status text not null default 'new'
    check (status in ('new','processing','out_for_delivery','delivered','cancelled')),
  delivery_zone text not null default 'gran_seville'
    check (delivery_zone in ('gran_seville','banlic','other')),
  notes text,
  payment_method text not null default 'cash'
    check (payment_method in ('cash','gcash')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Expenses
create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  category text not null default 'other'
    check (category in ('nutrients','cups','soil','seeds','tools','packaging','utilities','other')),
  description text not null,
  amount integer not null,
  expense_date date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);

alter table expenses enable row level security;
create policy "admin full access expenses" on expenses
  for all using (auth.role() = 'authenticated');

-- Auto-update updated_at on orders
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();

-- Row Level Security (allow service_role full access, anon can insert orders)
alter table products enable row level security;
alter table customers enable row level security;
alter table orders enable row level security;

-- Public: read available products
create policy "public read products" on products
  for select using (true);

-- Public: insert orders (from the order form)
create policy "public insert orders" on orders
  for insert with check (true);

-- Public: insert customers
create policy "public insert customers" on customers
  for insert with check (true);

-- Authenticated (admin): full access
create policy "admin full access orders" on orders
  for all using (auth.role() = 'authenticated');

create policy "admin full access customers" on customers
  for all using (auth.role() = 'authenticated');

create policy "admin full access products" on products
  for all using (auth.role() = 'authenticated');

-- ============================================================
-- Seed data
-- ============================================================
insert into products (name, variety, description, price_single, price_bundle_qty, price_bundle_total, available, coming_soon)
values
  ('Olmetie', 'Green Leaf', 'Frilly, bright green leaves with a soft, fresh crunch. Harvested whole-head, roots on.', 40, 3, 100, true, false),
  ('Thurinus', 'Red Romaine', 'Tall, upright heads with deep ruby tips and a sweet, slightly nutty crunch.', 40, 3, 100, false, true),
  ('Rincon', 'Green Romaine', 'Classic green romaine — tall, ribbed leaves with a satisfying crunch and clean flavor.', 40, 3, 100, false, true);
