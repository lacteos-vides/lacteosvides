-- ============================================================
-- Permisos públicos para la vista products_with_category
-- Permite que anon (sin autenticación) consuma la vista
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- Products: anon solo ve activos; authenticated (admin) tiene acceso completo
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Productos activos visibles publicamente" ON products;
CREATE POLICY "Productos activos visibles publicamente" ON products
  FOR SELECT TO anon USING (estado = 'activo');
DROP POLICY IF EXISTS "Admins gestionan productos" ON products;
CREATE POLICY "Admins gestionan productos" ON products
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- La vista: anon y authenticated necesitan permiso explícito
GRANT SELECT ON products_with_category TO anon;
GRANT SELECT ON products_with_category TO authenticated;
