-- Vapor&Go - Actualizar imágenes de servicios con URLs reales Kärcher
-- Ejecutar en Supabase Dashboard > SQL Editor

UPDATE equipos
SET image_url = CASE
  WHEN categoria IN ('Limpieza Técnica', 'Mantenimiento Industrial', 'Hidrolimpiadoras', 'Lavado exterior')
    THEN 'https://s1.kaercher-media.com/products/10719000/main/1/d0.jpg'
  WHEN categoria IN ('Fregadoras', 'Logística y Almacenes')
    THEN 'https://s1.kaercher-media.com/products/11270110/main/1/d0.jpg'
  WHEN categoria IN ('Sanitaria e Alimentaria', 'Generadores', 'Limpiacristales')
    THEN 'https://s1.kaercher-media.com/products/10921040/main/1/d0.jpg'
  WHEN categoria IN ('Aspiradoras')
    THEN 'https://s1.kaercher-media.com/products/16672860/main/1/d0.jpg'
  ELSE image_url
END
WHERE image_url IS NULL OR image_url = '';
