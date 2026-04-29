-- SQL for Supabase Editor

-- 1. Companies Table
CREATE TABLE IF NOT EXISTS public.empresas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    nombre TEXT NOT NULL UNIQUE,
    tenant_id TEXT DEFAULT 'default'
);

-- 2. Transactions Table
CREATE TABLE IF NOT EXISTS public.movimientos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    tipo TEXT NOT NULL CHECK (tipo IN ('ingreso', 'egreso')),
    moneda TEXT NOT NULL CHECK (moneda IN ('ARS', 'USD')),
    monto NUMERIC,
    categoria TEXT,
    empresa_nombre TEXT, -- Storing name for easier fuzzy matching logic
    descripcion TEXT,
    original_text TEXT,
    tenant_id TEXT DEFAULT 'default'
);

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS public.categorias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    nombre TEXT NOT NULL UNIQUE,
    tenant_id TEXT DEFAULT 'default'
);

-- 4. Users Table (for bot tracking/reminders)
CREATE TABLE IF NOT EXISTS public.usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id BIGINT UNIQUE NOT NULL,
    username TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    reminders_enabled BOOLEAN DEFAULT true
);

-- 5. Recurring Movements Table
CREATE TABLE IF NOT EXISTS public.recurrentes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    monto DECIMAL(15,2) NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('ingreso', 'egreso')),
    moneda TEXT NOT NULL CHECK (moneda IN ('ARS', 'USD')),
    categoria TEXT,
    empresa_nombre TEXT DEFAULT 'Personal',
    descripcion TEXT,
    frecuencia TEXT NOT NULL CHECK (frecuencia IN ('diario', 'semanal', 'mensual')),
    last_processed TIMESTAMPTZ,
    chat_id BIGINT
);

-- Enable Realtime
alter publication supabase_realtime add table public.movimientos;
alter publication supabase_realtime add table public.empresas;
alter publication supabase_realtime add table public.categorias;
alter publication supabase_realtime add table public.recurrentes;
