import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import { ScaleToFit } from "@/components/productos/scale-to-fit";
import { TVMenuBoard } from "@/components/productosv2/TVMenuBoard";
import type { ProductWithCategory } from "@/lib/types/database";

const CACHE_TAG = "productos-tv";
const REVALIDATE_SECONDS = 86400; // 24 horas

/** Agrupa productos por categoría y forma páginas de máximo 2 categorías */
function buildPagesFromProducts(rows: ProductWithCategory[]) {
  if (rows.length === 0) {
    return [{ id: 1, columns: [] }];
  }

  const byCategory = new Map<string, { title: string; order: number; items: { name: string; price: string }[] }>();

  for (const p of rows) {
    const key = p.category_id;
    if (!byCategory.has(key)) {
      byCategory.set(key, {
        title: p.category_name.toUpperCase(),
        order: p.category_order,
        items: [],
      });
    }
    byCategory.get(key)!.items.push({
      name: p.name.toUpperCase(),
      price: `$${Number(p.price).toFixed(2)}`,
    });
  }

  const categories = Array.from(byCategory.values()).sort((a, b) => a.order - b.order);

  const pages: { id: number; columns: { title: string; items: { name: string; price: string }[] }[] }[] = [];
  for (let i = 0; i < categories.length; i += 2) {
    pages.push({
      id: pages.length + 1,
      columns: categories.slice(i, i + 2).map((c) => ({ title: c.title, items: c.items })),
    });
  }

  return pages.length > 0 ? pages : [{ id: 1, columns: [] }];
}

async function fetchProducts(): Promise<ProductWithCategory[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("products_with_category")
    .select("id, name, price, order_index, category_id, category_name, category_order, estado")
    .eq("estado", "activo")
    .order("category_order", { ascending: true })
    .order("order_index", { ascending: true })
    .order("name", { ascending: true });
  return (data ?? []) as ProductWithCategory[];
}

export default async function ProductosV2Page() {
  const getCached = unstable_cache(fetchProducts, [CACHE_TAG], {
    revalidate: REVALIDATE_SECONDS,
    tags: [CACHE_TAG],
  });

  const rows = await getCached();
  const pages = buildPagesFromProducts(rows);

  return (
    <ScaleToFit>
      <div className="h-full w-full">
        <TVMenuBoard initialPages={pages} />
      </div>
    </ScaleToFit>
  );
}
