-- Vapor&Go - Initial Database Schema
-- Based on marketplaceConfig.database: perfiles, equipos, ordenes

-- 1. Profiles (Client or Partner B2B)
CREATE TABLE IF NOT EXISTS perfiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('cliente', 'partner')) DEFAULT 'cliente',
  nombre TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  telefono TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Equipment listings
CREATE TABLE IF NOT EXISTS equipos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES perfiles(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  precio NUMERIC(10, 2) NOT NULL CHECK (precio >= 0),
  categoria TEXT NOT NULL,
  potencia TEXT,
  peso TEXT,
  imagenes TEXT[] DEFAULT '{}',
  estado TEXT NOT NULL CHECK (estado IN ('disponible', 'alquilado', 'mantenimiento')) DEFAULT 'disponible',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Orders (transactions between clients, partners, and equipment)
CREATE TABLE IF NOT EXISTS ordenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES perfiles(id) ON DELETE CASCADE,
  partner_id UUID NOT NULL REFERENCES perfiles(id) ON DELETE CASCADE,
  equipo_id UUID NOT NULL REFERENCES equipos(id) ON DELETE CASCADE,
  estado TEXT NOT NULL CHECK (estado IN ('pendiente', 'confirmada', 'en_curso', 'completada', 'cancelada')) DEFAULT 'pendiente',
  fecha_inicio TIMESTAMPTZ NOT NULL,
  fecha_fin TIMESTAMPTZ NOT NULL,
  precio_total NUMERIC(10, 2) NOT NULL CHECK (precio_total >= 0),
  notas TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fechas_validas CHECK (fecha_fin > fecha_inicio)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_equipos_partner ON equipos(partner_id);
CREATE INDEX IF NOT EXISTS idx_equipos_categoria ON equipos(categoria);
CREATE INDEX IF NOT EXISTS idx_equipos_estado ON equipos(estado);
CREATE INDEX IF NOT EXISTS idx_ordenes_cliente ON ordenes(cliente_id);
CREATE INDEX IF NOT EXISTS idx_ordenes_partner ON ordenes(partner_id);
CREATE INDEX IF NOT EXISTS idx_ordenes_equipo ON ordenes(equipo_id);
CREATE INDEX IF NOT EXISTS idx_ordenes_estado ON ordenes(estado);

-- Enable Row Level Security
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordenes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for perfiles
CREATE POLICY "Usuarios pueden ver su propio perfil"
  ON perfiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuarios pueden crear su propio perfil"
  ON perfiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Usuarios pueden actualizar su propio perfil"
  ON perfiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for equipos
CREATE POLICY "Cualquiera puede ver equipos disponibles"
  ON equipos FOR SELECT
  USING (estado = 'disponible' OR auth.uid() = partner_id);

CREATE POLICY "Partners pueden insertar sus equipos"
  ON equipos FOR INSERT
  WITH CHECK (auth.uid() = partner_id);

CREATE POLICY "Partners pueden actualizar sus equipos"
  ON equipos FOR UPDATE
  USING (auth.uid() = partner_id)
  WITH CHECK (auth.uid() = partner_id);

CREATE POLICY "Partners pueden eliminar sus equipos"
  ON equipos FOR DELETE
  USING (auth.uid() = partner_id);

-- RLS Policies for ordenes
CREATE POLICY "Clientes y partners pueden ver sus ordenes"
  ON ordenes FOR SELECT
  USING (auth.uid() = cliente_id OR auth.uid() = partner_id);

CREATE POLICY "Clientes pueden crear ordenes"
  ON ordenes FOR INSERT
  WITH CHECK (auth.uid() = cliente_id);

CREATE POLICY "Partners pueden actualizar estado de ordenes"
  ON ordenes FOR UPDATE
  USING (auth.uid() = partner_id)
  WITH CHECK (auth.uid() = partner_id);

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER trg_perfiles_updated_at
  BEFORE UPDATE ON perfiles
  FOR EACH RSEXECUTE FUNCTION actualizar_timestamp();

CREATE TRIGGER trg_equipos_updated_at
  BEFORE UPDATE ON equipos
  FOR EACH RSEXECUTE FUNCTION actualizar_timestamp();

CREATE TRIGGER trg_ordenes_updated_at
  BEFORE UPDATE ON ordenes
  FOR EACH RSEXECUTE FUNCTION actualizar_timestamp();
