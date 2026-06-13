-- Supabase schema for CUCU MUTUGI Poultry app

create table products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null,
  breed text,
  price integer not null,
  stock integer not null,
  image text,
  description text,
  age_range text,
  vaccinated boolean not null default true,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table orders (
  id uuid primary key default uuid_generate_v4(),
  farmer text not null,
  phone text not null,
  county text not null,
  breed text not null,
  qty integer not null,
  total_kes integer not null,
  status text not null,
  date date not null default now(),
  notes text
);

create table farmers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text not null,
  email text,
  county text not null,
  flocks integer not null default 0,
  total_orders integer not null default 0,
  joined_at date not null default now()
);

create table blog_posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  content text not null,
  author text not null,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  category text not null
);
