# Configuración de Supabase para Galería

## Paso 1: Ejecutar la migración SQL

1. Ve al proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Entra a **SQL Editor**
3. Abre el archivo `supabase/migrations/006_galeria_table_and_storage.sql`
4. Copia todo el contenido y pégalo en el editor
5. Ejecuta la consulta (**Run**)

Esto creará:
- La tabla `galeria`
- El bucket `gallery` en Storage (si no existe)
- Las políticas RLS para la tabla y el bucket

---

## Paso 2: Si el bucket no se creó automáticamente

Si al ejecutar la migración aparece un error relacionado con `storage.buckets`, crea el bucket manualmente:

1. En Supabase Dashboard → **Storage**
2. Clic en **New bucket**
3. Configura:
   - **Name:** `gallery`
   - **Public bucket:** ON
   - **File size limit:** 10 MB
   - **Allowed MIME types:** `image/jpeg`, `image/png`, `image/webp`, `image/gif`

---

## Resumen

- **Tabla `galeria`:** id, image_url, product, price, order_index, created_at
- **Bucket `gallery`:** público para lectura, subida/edición/borrado solo con sesión admin
- **Formatos aceptados:** JPG, PNG, WebP, GIF
- **Límite de archivo:** 10 MB por imagen
