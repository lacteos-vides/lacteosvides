-- ============================================================
-- MIGRACIÓN: Galería (Lácteos Vides)
-- Imágenes y promociones para carrusel en pantalla TV
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- ------------------------------------------------------------
-- 1. TABLA: galeria
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS galeria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  product TEXT NOT NULL,
  price TEXT NOT NULL DEFAULT '',
  order_index INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT galeria_image_url_not_empty CHECK (trim(image_url) != ''),
  CONSTRAINT galeria_product_not_empty CHECK (trim(product) != ''),
  CONSTRAINT galeria_order_min_1 CHECK (order_index >= 1)
);

CREATE INDEX IF NOT EXISTS idx_galeria_order ON galeria(order_index);

ALTER TABLE galeria ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Galeria visible publicamente" ON galeria;
CREATE POLICY "Galeria visible publicamente" ON galeria FOR SELECT USING (true);

DROP POLICY IF EXISTS "Solo admins insertan galeria" ON galeria;
CREATE POLICY "Solo admins insertan galeria" ON galeria FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Solo admins actualizan galeria" ON galeria;
CREATE POLICY "Solo admins actualizan galeria" ON galeria FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Solo admins eliminan galeria" ON galeria;
CREATE POLICY "Solo admins eliminan galeria" ON galeria FOR DELETE USING (auth.role() = 'authenticated');


-- ------------------------------------------------------------
-- 2. STORAGE: Bucket 'gallery' para imágenes
-- ------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery',
  'gallery',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Políticas de Storage para el bucket 'gallery'
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'lacteos_gallery_select') THEN
    EXECUTE 'CREATE POLICY "lacteos_gallery_select" ON storage.objects FOR SELECT USING (bucket_id = ''gallery'')';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'lacteos_gallery_insert') THEN
    EXECUTE 'CREATE POLICY "lacteos_gallery_insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = ''gallery'')';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'lacteos_gallery_update') THEN
    EXECUTE 'CREATE POLICY "lacteos_gallery_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = ''gallery'')';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'lacteos_gallery_delete') THEN
    EXECUTE 'CREATE POLICY "lacteos_gallery_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = ''gallery'')';
  END IF;
EXCEPTION
  WHEN undefined_table THEN NULL;
END $$;
