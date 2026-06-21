-- Vapor&Go - Seed: Servicios de Limpieza Industrial
-- Ejecutar en el SQL Editor de Supabase (Dashboard > SQL Editor)
-- NOTA: Si la tabla equipos ya usa CHECK (estado IN ('disponible','alquilado','mantenimiento')),
-- ejecuta primero la línea ALTER para añadir 'stock_bajo' y 'no_disponible'.

-- 1. Añadir estados permitidos para servicios
ALTER TABLE equipos DROP CONSTRAINT IF EXISTS equipos_estado_check;
ALTER TABLE equipos ADD CONSTRAINT equipos_estado_check
  CHECK (estado IN ('disponible', 'stock_bajo', 'no_disponible', 'en_curso'));

-- 2. Crear perfil partner por defecto (reemplazar el UUID con un usuario real existente)
-- NOTA: Si ya tienes un partner registrado, usa su UUID.
-- Si no, puedes omitir partner_id haciendo que la columna acepte NULL:

-- Opción A: Hacer partner_id nullable para servicios semilla
-- ALTER TABLE equipos ALTER COLUMN partner_id DROP NOT NULL;

-- Opción B: Insertar con un partner real (recomendado)
-- Reemplaza 'REPLACE_WITH_PARTNER_UUID' con el UUID del partner desde auth.users
-- Ejemplo: SELECT id FROM perfiles WHERE email = 'partner@vaporandgo.com';

-- 3. Insertar servicios
-- NOTA: PENDIENTE - reemplazar 'REPLACE_WITH_PARTNER_UUID' antes de ejecutar

/*
INSERT INTO equipos (partner_id, nombre, descripcion, precio, categoria, estado)
VALUES
(
  'REPLACE_WITH_PARTNER_UUID',
  'Servicio de Desengrasado y Alta Presión HDS',
  'Limpieza industrial con agua caliente a alta presión. Incluye operario especializado y maquinaria HDS. Ideal para suelos, maquinaria y superficies con grasa incrustada.',
  250.00,
  'Limpieza Técnica',
  'disponible'
),
(
  'REPLACE_WITH_PARTNER_UUID',
  'Tratamiento de Desinfección Térmica por Vapor V4',
  'Eliminación de patógenos mediante vapor seco a alta temperatura. Sin químicos. Certificado para industrias alimentaria, sanitaria y farmacéutica.',
  380.00,
  'Sanitaria e Alimentaria',
  'disponible'
),
(
  'REPLACE_WITH_PARTNER_UUID',
  'Limpieza de Fachadas y Estructuras HD',
  'Eliminación de residuos difíciles en fachadas, muros y estructuras industriales con agua fría presurizada. Incluye alpine y personal en altura.',
  190.00,
  'Mantenimiento Industrial',
  'stock_bajo'
),
(
  'REPLACE_WITH_PARTNER_UUID',
  'Aspirado y Saneamiento de Suelos Continuos',
  'Servicio de aspiración pesada, fregado y abrillantado de pavimentos continuos. Maquinaria industrial de arrastre para naves y almacenes.',
  220.00,
  'Logística y Almacenes',
  'disponible'
);
*/

-- 4. Verificación
-- SELECT id, nombre, categoria, precio, estado FROM equipos;
