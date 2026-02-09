# Configuración de productosv2 con base de datos

## Ejecutar la migración

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard) → SQL Editor
2. Copia el contenido de `supabase/migrations/007_products_with_category_public.sql`
3. Ejecuta la consulta

## Qué hace la migración

- **products**: Habilita RLS. Usuarios anónimos solo ven productos con `estado = 'activo'`. Admins (authenticated) pueden gestionar todos.
- **products_with_category**: Otorga `SELECT` a `anon` y `authenticated` para consumir la vista.

## Uso en productosv2

La pantalla `/productosv2` hace una sola consulta a `products_with_category` al cargar (server-side), agrupa por categoría y forma páginas de máximo 2 categorías. Los datos se mantienen en memoria para el carrusel.
